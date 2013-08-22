(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]
            [webster.html :as html]
            [webster.dir :as dir]
            [webster.elements :as elements]
            [webster.move :as move]
            [webster.bridging :as bridging]
            [clojure.string :as string]
            [clojure.browser.repl :as repl]
            [domina :as domi]
            [domina.css :as css]
            [domina.events :as events]))

(defn add-selectable-listeners! [selectable bridge]
  ;; blueprint listeners
  (when (domi/has-class? selectable "draggable")
    (events/listen! selectable :touchstart #(move/start % bridge))
    (events/listen! selectable :touchmove #(move/move % bridge))
    (events/listen! selectable :touchend #(move/end % bridge))))

(defn add-link-listeners! [link bridge]
  (events/listen! link :touchstart #(do
                                      (events/prevent-default %)
                                      (events/stop-propagation %)))
  (events/listen! link :touchend #(do
                                    (events/prevent-default %)
                                    (events/stop-propagation %)
                                    (listeners/link-listener % bridge))))

(defn init-listeners! [bridge]
  (.addEventListener js/document
                     "selectionchange"
                     #(listeners/text-selected bridge))

  (.addEventListener js/document
                     "scroll"
                     #(if (nil? (domi/nodes (domi/by-class "editing")))
                        (.callHandler bridge
                                      "scrolled"
                                      (clj->js {}))))
  
  ;; default listener
  (events/listen! :click #(listeners/default-listener % bridge))

  (doseq [selectable (domi/nodes (domi/by-class "selectable"))]
    (add-selectable-listeners! selectable bridge))

  (doseq [link (domi/nodes (css/sel "a"))]
    (add-link-listeners! link bridge)))

(def handler-list (atom []))
(defn defhandler [name func]
  (reset! handler-list (conj @handler-list [name func])))

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    ;; initialize the bridge
    (.init bridge "handler?")

    (init-listeners! bridge)
    
    (doseq [handler @handler-list]
      (bridging/register-handler bridge
                                 (first handler)
                                 (second handler)))))

(defhandler "setSelectedTextLink"
  (fn [data callback bridge]
    (let [url (get data "url")
          sel-text (listeners/get-last-selected-text)
          html (format "<a href=\"%s\">%s</a>" url sel-text)
          node (domi/single-node (domi/html-to-dom html))]
      (when-let [rangy (listeners/get-last-range-obj)]
        (.deleteContents rangy)
        (.insertNode rangy node)
        (dom/stop-editing)
        (add-link-listeners! (domi/nodes node) bridge)))))

(defhandler "setSelectedNodeStyle"
  (fn [data callback bridge]
    (let [el (listeners/get-selected)]
      (domi/remove-attr! el "style")
      (loop [styles (keys data)]
        (if (seq styles)
          (do
            (domi/set-style! el (first styles) (get data (first styles)))
            (recur (rest styles)))))
      (dom/stop-editing)
      (callback (listeners/node-info el)))))

(defhandler "getSelectedNodeStyle"
  (fn [data callback bridge]
    (callback (clj->js (dom/style-map (listeners/get-selected))))))

(defhandler "setSelectedImageSrc"
  (fn [data callback bridge]
    (let [path (get data "path")]
      (if-let [selected (listeners/get-selected)]
        (domi/set-attr! selected "src" (dir/rel-path path))))))

(defhandler "setMode"
  (fn [data callback bridge]
    (if (= (get data "mode") "blueprint")
      (dom/set-blueprint-mode)
      (dom/set-content-mode))
    (dom/stop-editing)
    (callback)))

(domi/log (repl/connect "http://localhost:9000/repl"))
(defhandler "selectParentElement"
  (fn [data callback bridge]
    (let [selected-node (listeners/get-selected)
          parent-node (dom/parent selected-node)]
      (when parent-node
        (listeners/make-unselected selected-node)
        (listeners/select-node parent-node bridge)))))

(defhandler "exportMarkup"
  (fn [data callback bridge]
    (let [body (domi/clone (css/sel js/document "html"))]
      ;; remove some elements
      (domi/destroy! (css/sel body "head"))
      (domi/destroy! (css/sel body "iframe"))
      (domi/destroy! (css/sel body "script[src*=rangy]"))
      (domi/destroy! (css/sel body "script[src*=development]"))
      (domi/destroy! (css/sel body ".thumbnails .empty"))

      ;; remove development classe
      (domi/remove-class! (css/sel body ".selectable") "selectable")
      (domi/remove-class! (css/sel body ".selectable-thumb") "selectable-thumb")
      (domi/remove-class! (css/sel body ".selected") "selected")
      (domi/remove-class! (css/sel body ".empty") "empty")

      ;; make sure bg is correct
      (let [body-el (css/sel body "body")
            bg (domi/style body-el "background-image")]
        (if-let [main-path (second (re-matches #"url\(.*/(media/.*)\)" bg))]
          (domi/set-style! body-el :zoom "1")
          (domi/set-style! body-el :background-image (str "url(" main-path ")"))))

      ;; add lightbox js
      (if (domi/single-node (css/sel body ".thumbnails"))
        (domi/append! body (html/compile [:script {:src "js/bootstrap-lightbox.js"}])))

      ;; return the new markup
      (callback (js-obj "markup" (string/trim (domi/html body)))))))

(defhandler "setBackgroundImage"
  (fn [data callback bridge]
    (remove-background-image (js-obj) nil bridge)
    (let [body (css/sel "body")
          full-path (get data "path")
          url (str "url(" (dir/rel-path full-path) ")")]
      (domi/add-class! body "with-background")
      (domi/set-style! body "background-image" url)
      (if callback (callback (-> body dom/style-map clj->js))))))

(defn remove-background-image [data callback bridge]
  (let [body (css/sel "body")
        url (second (re-matches #"url\((.*)\)" (domi/style body :background-image)))]
    (if url (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/rel-path url))))
    (domi/remove-class! body "with-background")
    (domi/set-style! body :background-image nil)
    (if callback (callback (-> body dom/style-map clj->js)))))

(defhandler "removeBackgroundImage" remove-background-image)

(defhandler "hasBackgroundImage"
  (fn [data callback bridge]
    (callback (js-obj "hasBackground" (if (domi/has-class? (css/sel "body") "with-background")
                                        "true"
                                        "false")))))

(defhandler "incrementColumnOffset"
  (fn [data callback bridge]
    (let [jselected (listeners/get-selected)
          index (js/parseInt (get data "index"))
          all-columns (css/sel jselected "> div")
          jcolumn (nth (domi/nodes all-columns) index)]
      (if (> (dom/get-column-span jcolumn) 1)
        (do
          (dom/decrement-column-span jcolumn)
          (dom/increment-column-offset jcolumn)))
      (callback (listeners/node-info jselected)))))

(defhandler "decrementColumn"
  (fn [data callback bridge]
    (let [jselected (listeners/get-selected)
          index (js/parseInt (get data "index"))
          all-columns (css/sel jselected "> div")
          jcolumn (nth (domi/nodes all-columns) index)]
      (if (> (dom/get-column-span jcolumn) 1)
        (do
          (dom/decrement-column-span jcolumn)))
      (callback (listeners/node-info jselected)))))

(defhandler "decrementColumnOffset"
  (fn [data callback bridge]
    (let [jselected (listeners/get-selected)
          index (js/parseInt (get data "index") 10)
          all-columns (css/sel jselected "> div")
          column-count (.-length all-columns)
          jcolumn (nth (domi/nodes all-columns) index)
          offset-num (dom/get-column-offset jcolumn)]
      (if (> offset-num 0)
        (do
          (dom/set-column-offset jcolumn (- offset-num 1))
          (dom/set-column-span jcolumn (+ (dom/get-column-span jcolumn) 1))))
      (callback (listeners/node-info jselected)))))

(defhandler "incrementColumn"
  (fn [data callback bridge]
    (let [jselected (listeners/get-selected)
          index (js/parseInt (get data "index") 10)
          all-columns (css/sel jselected "> div")
          column-count (.-length all-columns)
          jcolumn (nth (domi/nodes all-columns) index)
          span-num (dom/get-column-span jcolumn)]
      (let [all-jcols (map (fn [i] (nth (domi/nodes all-columns) i)) (range column-count))
            jcols-after-jcolumn (map (fn [i] (nth (domi/nodes all-columns) i)) (range (+ index 1) column-count))
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
      (callback (listeners/node-info jselected)))))
 
(defhandler "removeElementHandler"
  (fn [data callback bridge]
    (let [selected (-> "selected" domi/by-class domi/single-node first)]
      (domi/add-class! selected "hinge")
      (.addEventListener selected
                         "webkitAnimationEnd"
                         #(domi/detach! selected)))
    (listeners/default-listener nil bridge)))

(defhandler "editElementHandler"
  (fn [data callback bridge]
    (let [el (css/sel ".selected")]
      (dom/make-editable el true))))

(defhandler "deselectSelectedElement"
  (fn [data callback bridge]
    (if-let [selected (listeners/get-selected)]
      (listeners/make-unselected selected))))

(defhandler "addElementUnderSelectedElement"
  (fn [data callback bridge]
    (let [new-el (-> (get data "element-name") elements/get-by-name dom/new-element-with-info domi/string-to-dom)
          to-el (listeners/get-selected)
          new-el-in-dom (-> (domi/append! to-el new-el)  domi/children last)
          new-selectables (conj (domi/nodes (css/sel new-el-in-dom ".selectable")) new-el-in-dom)]
      (doseq [new-selectable new-selectables]
        (add-selectable-listeners! new-selectable bridge))
      (listeners/default-listener nil bridge)
      (listeners/select-node new-el-in-dom bridge))))

;; IMAGE GALLERY STUFF
(defhandler "addGalleryHandler"
  (fn [data callback bridge]
    (let [jnode (listeners/get-selected)
          new-row (dom/new-image-gallery)
          gallery (css/sel new-row ".thumbnails")]
      (.append jnode new-row)
      (listeners/default-listener nil bridge)
      (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
      (.click (listeners/add-empty-thumbnail gallery bridge)))))

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
