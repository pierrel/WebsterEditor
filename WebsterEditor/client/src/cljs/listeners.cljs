(ns webster.listeners
  (:require [webster.dom :as dom]
            [webster.html :as html]))

;; listeners
(defn selected-listener
  [event bridge]
  (if (= (.-target event) (.-currentTarget event))
    (.stopPropagation event)))

(defn default-listener
  [event bridge]
  (make-unselected (js/$ ".selected"))
  (.removeAttr (js/$ "[contenteditable=true]") "contenteditable")
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))

(defn container-listener
  [event bridge]
  (let [el (js/$ (.-currentTarget event))]
    (if (and (not (.hasClass el "selected")) (nothing-selected))
      (do
        (select-node el bridge)
        (.stopPropagation event)
        (.preventDefault event)))))

(defn thumbnail-listener
  [event bridge]
  (let [$el (js/$ (.-currentTarget event))]
    (select-node $el bridge (fn [data callback]
                              (let [full-path (aget data "resource-path")
                                    rel-path (second (re-matches #".*Documents/(.*)" full-path))
                                    new-element (html/compile [:a {:href rel-path
                                                                   :class "thumbnail"
                                                                   :data-toggle "lightbox"}
                                                               [:img {:src rel-path }]])
                                    old-element (.find $el ".empty-decorations")]
                                (.remove old-element)
                                (.removeClass $el "empty")
                                (.append $el new-element))))))

(defn add-empty-thumbnail [$gallery bridge]
  (let [$empty-thumb (js/$ (dom/empty-image-thumbnail))]
    (.append $gallery $empty-thumb)
    (.addEventListener (.get $empty-thumb 0) "click" (fn [event] (thumbnail-listener event bridge)))
    $empty-thumb))

(defn select-node [jnode bridge & [callback]]
  (let [row-info (node-info jnode)]
    (make-selected jnode)
    (.callHandler bridge
                  "containerSelectedHandler"
                  row-info
                  (if callback callback))))
 
(defn node-info
  [jnode]
  (let [pos (.offset jnode)
        width (.width jnode)
        height (.height jnode)
        the-info {:top (.-top pos)
                  :left (.-left pos)
                  :width width
                  :height height
                  :tag (.prop jnode "tagName")
                  :classes (.split (.attr jnode "class") " ")}]
    (clj->js (if (is-row? jnode)
               (conj the-info [:children (dom/map-nodes  node-info (.find jnode "> div"))])
               the-info))))
 
(defn get-selected []
  (js/$ ".selected"))
(defn nothing-selected []
  (= (.-length (js/$ ".selected")) 0))

(defn make-selected
  [jnode]
  (let [node (.get jnode 0)]
    (.addClass jnode "selected")
    (if node (.addEventListener node "click" selected-listener))))
(defn make-unselected
  [jnode]
  (let [node (.get jnode 0)]
    (.removeClass jnode "selected")
    (if node (.removeEventListener node "click" selected-listener))))
(defn is-selected
  [jnode]
  (.hasClass jnode "selected"))

(defn is-row?
      [jnode]
      (.hasClass jnode "row-fluid"))
