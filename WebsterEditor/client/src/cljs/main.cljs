(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]
            [webster.html :as html]))

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
    ;; Setup default listener
    (.addEventListener js/document "click" (fn [event] (listeners/default-listener event bridge)) false)
    (.registerHandler bridge "removeElementHandler" (fn [data callback] (remove-element-handler data callback bridge)))
    (.registerHandler bridge "editElementHandler" edit-element-handler)
    (.registerHandler bridge "addRowUnderSelectedElement" (fn [data callback] (add-row-handler data callback bridge)))
    (.registerHandler bridge "addGalleryUnderSelectedElement" (fn [data callback] (add-gallery-handler data callback bridge)))
    (.registerHandler bridge "incrementColumn" increment-column)
    (.registerHandler bridge "decrementColumn" decrement-column)
    (.registerHandler bridge "incrementColumnOffset" increment-column-offset)
    (.registerHandler bridge "decrementColumnOffset" decrement-column-offset)))

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

(defn add-row-handler
  [data callback bridge]
  (let [jnode (listeners/get-selected)
        new-row (dom/new-row)]
    (.append jnode new-row)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
    (listeners/select-node new-row bridge)))

;; IMAGE GALLERY STUFF
(defn add-gallery-handler
  [data callback bridge]
  (let [jnode (listeners/get-selected)
        new-row (dom/new-image-gallery)
        gallery (.find new-row ".thumbnails")
        first-image (.find new-row "li.empty")]
    (.append jnode new-row)
    (listeners/default-listener nil bridge)
    (.addEventListener (.get new-row 0) "click" (fn [event] (listeners/container-listener event bridge)))
    (.addEventListener (.get first-image 0) "click" (fn [event] (listeners/thumbnail-listener event bridge)))
    (.click first-image)))

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
