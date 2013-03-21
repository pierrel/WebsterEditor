(ns webster.dom
  (:require [webster.html :as html]))

(defn each-node
  "Calls callback for each DOM node in node-list"
  [node-list callback]
  (doseq [index (range (.-length node-list))]
    (callback (.item node-list index))))

(defn map-nodes
  [callback node-list]
  (map (fn [index] (callback (js/$ (.get node-list index))))
       (range (.-length node-list))))

(defn get-jnode
  "grabs the node at index in jnodes and returns the corresponding jnode"
  [jnodes index]
  (js/$ (.get jnodes index)))

(defn get-column-span
  [jnode]
  (let [matches (re-find #"span(\d+)" (.attr jnode "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-span
  [jnode count]
  (let [old-count (get-column-span jnode)]
    (.removeClass jnode (str "span" old-count))
    (.addClass jnode (str "span" count))))

(defn increment-column-span
  [jnode]
  (set-column-span jnode (+ (get-column-span jnode) 1)))
(defn decrement-column-span
  [jnode]
  (set-column-span jnode (- (get-column-span jnode) 1)))


(defn get-column-offset
  [jnode]
    (let [matches (re-find #"offset(\d+)" (.attr jnode "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-offset
  [jnode count]
  (let [old-count (get-column-offset jnode)]
    (.removeClass jnode (str "offset" old-count))
    (.addClass jnode (str "offset" count))))

(defn increment-column-offset
  [jnode]
  (set-column-offset jnode (+ (get-column-offset jnode) 1)))
(defn decrement-column-offset
  [jnode]
  (set-column-offset jnode (- (get-column-offset jnode) 1)))

(defn get-column-width
  [jnode]
  (+ (get-column-span jnode) (get-column-offset jnode)))

(def column-max 12)

(defn make-editable
  [node & focus]
  (.attr node "contenteditable" "true")
  (if focus
    (let [r (.createRange js/rangy)]
      (.setStart r (.get node 0) 0)
      (.collapse r true)
      (.setSingleRange (.getSelection js/rangy) r))))

(defn new-row []
  (js/$ (html/compile [:div {:class "row-fluid selectable"}
                       [:div {:class "span4 empty"}]
                       [:div {:class "span8 empty"}]])))

(defn new-image-gallery []
  (js/$ (html/compile [:div {:class "row-fluid selectable"}
                       [:ul {:class "thumbnails" :data-span "4"}]])))

(defn empty-image-thumbnail [span]
  (html/compile [:li {:class (format "span%s empty image-thumb" (or span 4))} [:div {:class "empty-decorations"} "Add Image"]]))