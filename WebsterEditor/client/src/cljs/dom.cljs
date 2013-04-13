(ns webster.dom
  (:require [webster.html :as html]
            [webster.elements :as elements]
            [domina :as dom]
            [domina.css :as css]))

(defn closest [el selector]
  (let [matching-els (-> selector css/sel )]))

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

(defn parent [el]
  (.-parentNode (dom/single-node el)))

;; (defn each-node
;;   "Calls callback for each DOM node in node-list"
;;   [node-list callback]
;;   (doseq [index (range (.-length node-list))]
;;     (callback (.item node-list index))))

;; (defn map-nodes
;;   [callback node-list]
;;   (map (fn [index] (callback (js/$ (.get node-list index))))
;;        (range (.-length node-list))))

;; (defn get-jnode
;;   "grabs the node at index in jnodes and returns the corresponding jnode"
;;   [jnodes index]
;;   (js/$ (.get jnodes index)))

(defn get-column-span
  [el]
  (let [matches (re-find #"span(\d+)" (dom/attr el "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-span
  [jnode count]
  (let [old-count (get-column-span jnode)]
    (dom/remove-class! jnode (str "span" old-count))
    (dom/add-class! jnode (str "span" count))))

(defn increment-column-span
  [el]
  (set-column-span el (+ (get-column-span el) 1)))
(defn decrement-column-span
  [el]
  (set-column-span el (- (get-column-span el) 1)))


(defn get-column-offset
  [el]
    (let [matches (re-find #"offset(\d+)" (dom/attr el "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-offset
  [el count]
  (let [old-count (get-column-offset el)]
    (dom/remove-class! el (str "offset" old-count))
    (dom/add-class! el (str "offset" count))))

(defn increment-column-offset
  [el]
  (set-column-offset el (+ (get-column-offset el) 1)))
(defn decrement-column-offset
  [el]
  (set-column-offset el (- (get-column-offset el) 1)))

(defn get-column-width
  [el]
  (+ (get-column-span el) (get-column-offset el)))

(def column-max 12)

(defn make-editable
  [el & focus]
  (dom/set-attr! el :contenteditable "true")
  (dom/add-class! el "editing")
  (if focus
    (let [r (.createRange js/rangy)]
      (.setStart r (dom/single-node el) 0)
      (.collapse r true)
      (.setSingleRange (.getSelection js/rangy) r))))

(defn stop-editing
  ([]
     (stop-editing (css/sel ".editing")))
  ([el]
     (dom/remove-attr! el "contenteditable")
     (dom/remove-class! el "editing")))

(defn new-element-attrs [el-info]
  (let [class {:class (str (if (not (:unselectable el-info)) "selectable" "")
                           " "
                           (if (:class el-info) (:class el-info) "")) } 
        type {:data-type (:name el-info)}]
    (merge class type)))

(defn new-element-structure [el-info]
  [(:tag el-info)
   (new-element-attrs el-info)
   (cond
    (:contains-text el-info) (:contains-text el-info)
    (:contains el-info) (new-element-structure (elements/get-by-name (:contains el-info))))])

(defn new-element-with-info [el-info]
  (html/compile (new-element-structure el-info)))

(defn new-image-gallery []
  (html/compile [:div {:class "row-fluid selectable"}
                 [:ul {:class "thumbnails" :data-span "4"}]]))

(defn empty-image-thumbnail []
  (html/compile (new-element-structure (elements/get-by-name "gallery image"))))