(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]
            [webster.html :as html]
            [webster.dir :as dir]
            [webster.elements :as elements]
            [clojure.string :as string]
            [clojure.browser.repl :as repl]
            [domina :as domi]
            [domina.css :as css]
            [domina.events :as events]))

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    ;; initialize the bridge
    (.init bridge "handler?")

    ;; Setup default listener
    (events/listen! :click #(listeners/default-listener % bridge))
    (events/listen! (css/sel ".selectable") :click #(listeners/container-listener % bridge))
    (events/listen! (css/sel "a") :click #(events/prevent-default %))

    ;; deselect on scroll
    ;; (events/listen! :onscroll #(when (not (listeners/nothing-selected))
    ;;                       (listeners/make-unselected (listeners/get-selected))
    ;;                       (.callHandler bridge "defaultSelectedHandler" (js-obj))))
    (set! (.-onscroll js/window) (fn [event]
                                   (when (not (listeners/nothing-selected))
                                     (listeners/make-unselected (listeners/get-selected))
                                     (.callHandler bridge "defaultSelectedHandler" (js-obj)))))
    
    (.registerHandler bridge "removeElementHandler" (fn [data callback] (remove-element-handler data callback bridge)))
    (.registerHandler bridge "editElementHandler" edit-element-handler)
    (.registerHandler bridge "deselectSelectedElement" deselect-selected-element)
    (.registerHandler bridge "addElementUnderSelectedElement" (fn [data callback] (add-element-handler data callback bridge)))
    (.registerHandler bridge "addGalleryUnderSelectedElement" (fn [data callback] (add-gallery-handler data callback bridge)))
    (.registerHandler bridge "incrementColumn" increment-column)
    (.registerHandler bridge "decrementColumn" decrement-column)
    (.registerHandler bridge "incrementColumnOffset" increment-column-offset)
    (.registerHandler bridge "decrementColumnOffset" decrement-column-offset)
    (.registerHandler bridge "setBackgroundImage" (fn [data callback] (set-background-image data callback bridge)))
    (.registerHandler bridge "removeBackgroundImage" (fn [data callback] (remove-background-image data callback bridge)))
    (.registerHandler bridge "hasBackgroundImage" has-background-image)
    (.registerHandler bridge "exportMarkup" export-markup)
    (.registerHandler bridge "selectParentElement" (fn [data callback] (select-parent-element data callback bridge)))))

(domi/log (repl/connect "http://localhost:9000/repl"))
(defn select-parent-element [data callback bridge]
  (let [selected-node (listeners/get-selected)
        parent-node (dom/parent selected-node)]
    (when parent-node
      (listeners/make-unselected selected-node)
      (listeners/select-node parent-node bridge))))

(defn export-markup
  [data callback]
  (let [body (domi/clone (css/sel "html"))]
    ;; remove some elements
    (domi/destroy! (css/sel body "head"))
    (domi/destroy! (css/sel body "iframe"))
    (domi/destroy! (css/sel body "script[src*=rangy]"))
    (domi/destroy! (css/sel body "script[src*=development]"))
    (domi/destroy! (css/sel body ".thumbnails .empty"))

    ;; remove development classe
    (domi/remove-class (css/sel body ".selectable") "selectable")
    (domi/remove-class (css/sel body ".selectable-thumb") "selectable-thumb")
    (domi/remove-class (css/sel body ".selected") "selected")
    (domi/remove-class (css/sel body ".empty") "empty")

    ;; make sure bg is correct
    (let [body-el (css/sel body "body")
          bg (.css body-el "background-image")]
      (if (not (string/blank? bg))
        (let [main-path (second (re-matches #"url\(.*/(media/.*)\)" bg))]
          (domi/remove-style! (css/sel body "body") :background-image)
          ;; didn't want to use "attr" here but "css" doesn't seem to work...
          (domi/set-style! body-el (format "zoom: 1; background-image: url(%s);" main-path)))))

    ;; add lightbox js
    (if (css/sel body ".thumbnails")
      (domi/append! body (html/compile [:script {:src "js/bootstrap-lightbox.js"}])))

    ;; return the new markup
    (callback (js-obj "markup" (string/trim (html body))))))

(defn set-background-image
  [data callback bridge]
  (remove-background-image (js-obj) nil bridge)
  (let [body (css/sel "body")
        full-path (aget data "path")
        url (str "url(" (dir/rel-path full-path) ")")]
    (domi/add-class! body "with-background")
    (domi/set-style! body "background-image" url)))
(defn remove-background-image
  [data callback bridge]
  (let [body (css/sel "body")
        url (second (re-matches #"url\((.*)\)" (domi/style body :background-image)))]
    (if url (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/rel-path url))))
    (domi/remove-class body "with-background")
    (domi/set-style! body :background-image "none")
    (if callback (callback (js-obj)))))
(defn has-background-image
  [data callback]
  (callback (js-obj "hasBackground" (if (domi/has-class? (css/sel "body") "with-background")
                                      "true"
                                      "false"))))

(defn increment-column-offset
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index"))
        all-columns (css/sel jselected "> div")
        jcolumn (dom/get-jnode all-columns index)]
    (if (> (dom/get-column-span jcolumn) 1)
      (do
        (dom/decrement-column-span jcolumn)
        (dom/increment-column-offset jcolumn)))
    (callback (listeners/node-info jselected))))

(defn decrement-column
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index"))
        all-columns (css/sel jselected "> div")
        jcolumn (dom/get-jnode all-columns index)]
    (if (> (dom/get-column-span jcolumn) 1)
      (do
        (dom/decrement-column-span jcolumn)))
    (callback (listeners/node-info jselected))))

(defn decrement-column-offset
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index") 10)
        all-columns (css/sel jselected "> div")
        column-count (.-length all-columns)
        jcolumn (dom/get-jnode all-columns index)
        offset-num (dom/get-column-offset jcolumn)]
    (if (> offset-num 0)
      (do
        (dom/set-column-offset jcolumn (- offset-num 1))
        (dom/set-column-span jcolumn (+ (dom/get-column-span jcolumn) 1))))
    (callback (listeners/node-info jselected))))

(defn increment-column
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index") 10)
        all-columns (css/sel jselected "> div")
        column-count (.-length all-columns)
        jcolumn (dom/get-jnode all-columns index)
        span-num (dom/get-column-span jcolumn)]
    (let [all-jcols (map (fn [i] (dom/get-jnode all-columns i)) (range column-count))
          jcols-after-jcolumn (map (fn [i] (dom/get-jnode all-columns i)) (range (+ index 1) column-count))
          jcols-to-decrement (filter (fn [jcol] (> (dom/get-column-span jcol) 1)) jcols-after-jcolumn)
          jcols-to-inset (filter (fn [jcol] (> (dom/get-column-offset jcol) 0)) jcols-after-jcolumn)]
      (let [jcol-to-decrement (first jcols-to-decrement)
            jcol-to-inset (first jcols-to-inset)
            is-full-width (= 12  (reduce + (map dom/get-column-width all-jcols)))]
        (if jcol-to-inset
          (dom/set-column-offset jcol-to-inset (- (dom/get-column-offset jcol-to-inset) 1))
          (if (and is-full-width jcol-to-decrement)
            (dom/set-column-span jcol-to-decrement (- (dom/get-column-span jcol-to-decrement) 1))))
        (if (or jcol-to-inset jcol-to-decrement (not is-full-width))
          (do
            (dom/set-column-span jcolumn (+ 1 span-num))))))
    (callback (listeners/node-info jselected))))
 
(defn remove-element-handler
  ([data callback]
     (-> ".selected" css/sel domi/detach!))
  ([data callback bridge]
     (remove-element-handler data callback)
     (listeners/default-listener nil bridge)))

(defn edit-element-handler
  [data callback]
  (let [el (css/sel ".selected")]
    (dom/make-editable el true)))

(defn deselect-selected-element
  [data]
  (if-let [selected (listeners/get-selected)]
    (listeners/make-unselected selected)))

(defn add-element-handler
  [data callback bridge]
  (let [el-name (aget data "element-name")
        element (elements/get-by-name el-name)
        jnode (listeners/get-selected)
        new-el (dom/new-element-with-info element)
        
        add-listener (fn [jel]
                       (events/listen! jel :click (fn [event]
                                             (listeners/container-listener event bridge))))]
    (.append jnode new-el)
    (listeners/default-listener nil bridge)
    (doseq [el (css/sel new-el ".selectable")]
      (add-listener el))
    (add-listener new-el)
    (listeners/select-node new-el bridge)))

;; IMAGE GALLERY STUFF
(defn add-gallery-handler
  [data callback bridge]
  (let [jnode (listeners/get-selected)
        new-row (dom/new-image-gallery)
        gallery (css/sel new-row ".thumbnails")]
    (.append jnode new-row)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
    (.click (listeners/add-empty-thumbnail gallery bridge))))

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
