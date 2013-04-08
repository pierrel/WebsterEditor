(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]
            [webster.html :as html]
            [webster.dir :as dir]
            [webster.elements :as elements]
            [clojure.string :as string]))

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    ;; initialize the bridge
    (.init bridge "handler?")
    ;; Setup selectable containers
    (dom/each-node (.getElementsByClassName js/document "selectable")
                   (fn [node]
                     (.addEventListener node
                                        "click"
                                        (fn [event] (listeners/container-listener event bridge))
                                        false)))
    ;; Don't allow link clicks in dev mode
    (dom/each-node (.getElementsByTagName js/document "a")
                   (fn [node]
                     (.addEventListener node "click" (fn [event]
                                                       (.preventDefault event)
                                                       true))))
    ;; Setup default listener
    (.addEventListener js/document "click" (fn [event] (listeners/default-listener event bridge)) false)
    (.registerHandler bridge "removeElementHandler" (fn [data callback] (remove-element-handler data callback bridge)))
    (.registerHandler bridge "editElementHandler" edit-element-handler)
    (.registerHandler bridge "deselectSelectedElement" deselect-selected-element)
    (.registerHandler bridge "addRowUnderSelectedElement" (fn [data callback] (add-row-handler data callback bridge)))
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

(defn select-parent-element [data callback bridge]
  (let [selected-node (listeners/get-selected)
        parent-node (.parent selected-node)]
    (when (> (.-length parent-node) 0)
      (listeners/make-unselected selected-node)
      (listeners/select-node parent-node bridge))))

(defn export-markup
  [data callback]
  (let [$body (.clone (js/$ "html"))]
    ;; remove some elements
    (.remove (.find $body "head"))
    (.remove (.find $body "iframe"))
    (.remove (.find $body "script[src*=rangy]"))
    (.remove (.find $body "script[src*=development]"))
    (.remove (.find $body ".thumbnails .empty"))

    ;; remove development classe
    (.removeClass (.find $body ".selectable") "selectable")
    (.removeClass (.find $body ".selectable-thumb") "selectable-thumb")
    (.removeClass (.find $body ".selected") "selected")
    (.removeClass (.find $body ".empty") "empty")

    ;; make sure bg is correct
    (let [$body-el (.find $body "body")
          bg (.css $body-el "background-image")]
      (if (not (string/blank? bg))
        (let [main-path (second (re-matches #"url\(.*/(media/.*)\)" bg))]
          (.css (.find $body "body") "background-image" nil)
          ;; didn't want to use "attr" here but "css" doesn't seem to work...
          (.attr $body-el "style" (format "zoom: 1; background-image: url(%s);" main-path)))))

    ;; add lightbox js
    (if (> (.-length (.find $body ".thumbnails")) 0)
      (.append $body (html/compile [:script {:src "js/bootstrap-lightbox.js"}])))

    ;; return the new markup
    (callback (js-obj "markup" (string/trim (.html $body))))))

(defn set-background-image
  [data callback bridge]
  (remove-background-image (js-obj) nil bridge)
  (let [$body (js/$ "body")
        full-path (aget data "path")
        url (str "url(" (dir/rel-path full-path) ")")]
    (.addClass $body "with-background")
    (.css $body "background-image" url)))
(defn remove-background-image
  [data callback bridge]
  (let [$body (js/$ "body")
        url (second (re-matches #"url\((.*)\)" (.css $body "background-image")))]
    (if url (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/rel-path url))))
    (.removeClass $body "with-background")
    (.css $body "background-image" "none")
    (if callback (callback (js-obj)))))
(defn has-background-image
  [data callback]
  (callback (js-obj "hasBackground" (if (.hasClass (js/$ "body") "with-background")
                                      "true"
                                      "false"))))

(defn increment-column-offset
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index"))
        all-columns (.find jselected "> div")
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
        all-columns (.find jselected "> div")
        jcolumn (dom/get-jnode all-columns index)]
    (if (> (dom/get-column-span jcolumn) 1)
      (do
        (dom/decrement-column-span jcolumn)))
    (callback (listeners/node-info jselected))))

(defn decrement-column-offset
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index") 10)
        all-columns (.find jselected "> div")
        column-count (.-length all-columns)
        jcolumn (dom/get-jnode all-columns index)
        offset-num (dom/get-column-offset jcolumn)]
    (if (> offset-num 0)
      (do
        (.log js/console offset-num)
        (dom/set-column-offset jcolumn (- offset-num 1))
        (dom/set-column-span jcolumn (+ (dom/get-column-span jcolumn) 1))))
    (callback (listeners/node-info jselected))))

(defn increment-column
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index") 10)
        all-columns (.find jselected "> div")
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
     (let [jnode (js/$ ".selected")]
       (listeners/make-unselected jnode)
       (.remove jnode)))
  ([data callback bridge]
     (remove-element-handler data callback)
     (listeners/default-listener nil bridge)))

(defn edit-element-handler
  [data callback]
  (let [node (js/$ ".selected")]
    (dom/make-editable node true)))

(defn deselect-selected-element
  [data]
  (let [$selected (listeners/get-selected)]
    (if $selected (listeners/make-unselected $selected))))

(defn add-row-handler
  [data callback bridge]
  (let [jnode (listeners/get-selected)
        new-row (dom/new-row)]
    (.append jnode new-row)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
    (listeners/select-node new-row bridge)))

(defn add-element-handler
  [data callback bridge]
  (let [el-name (aget data "element-name")
        element (elements/get-by-name el-name)
        jnode (listeners/get-selected)
        new-el (dom/new-element-with-info element)]
    (.append jnode new-el)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-el 0)
                       "click"
                       (fn [event]
                         (listeners/container-listener event bridge)))
    (listeners/select-node new-el bridge)))

;; IMAGE GALLERY STUFF
(defn add-gallery-handler
  [data callback bridge]
  (let [jnode (listeners/get-selected)
        new-row (dom/new-image-gallery)
        gallery (.find new-row ".thumbnails")]
    (.append jnode new-row)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
    (.click (listeners/add-empty-thumbnail gallery bridge))))

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
