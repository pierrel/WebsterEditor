(ns webster.dom
  (:require [webster.html :as html]
            [webster.elements :as elements]))


(defn offset-from-parent [el]
  {:top (.-offsetTop el)
   :left (.-offsetLeft el)})

(defn offset [el]
  (loop [current-el el
         off {:top 0, :left 0}]
    (if current-el
      (recur (.-offsetParent current-el) (assoc off
                                           :top (+ (:top off) (-> current-el offset-from-parent :top))
                                           :left (+ (:left off) (-> current-el offset-from-parent :left))))
      off)))

(defn width [el]
  (.-offsetWidth el))
(defn height [el]
  (.-offsetHeight el))

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
  (.addClass node "editing")
  (if focus
    (let [r (.createRange js/rangy)]
      (.setStart r (.get node 0) 0)
      (.collapse r true)
      (.setSingleRange (.getSelection js/rangy) r))))

(defn stop-editing
  ([]
     (stop-editing (js/$ ".editing")))
  ([$el]
     (.removeAttr $el "contenteditable")
     (.removeClass $el "editing")))

(defn new-element-with-info [el-info]
  (js/$ (html/compile (new-element-structure el-info))))

(defn new-element-structure [el-info]
  [(:tag el-info)
   (new-element-attrs el-info)
   (cond
    (:contains-text el-info) (:contains-text el-info)
    (:contains el-info) (new-element-structure (elements/get-by-name (:contains el-info))))])

(defn new-element-attrs [el-info]
  (let [class {:class (str (if (not (:unselectable el-info)) "selectable" "")
                           " "
                           (if (:class el-info) (:class el-info) "")) } 
        type {:data-type (:name el-info)}]
    (merge class type)))

(defn new-image-gallery []
  (js/$ (html/compile [:div {:class "row-fluid selectable"}
                       [:ul {:class "thumbnails" :data-span "4"}]])))

(defn empty-image-thumbnail []
  (html/compile (new-element-structure (elements/get-by-name "gallery image"))))