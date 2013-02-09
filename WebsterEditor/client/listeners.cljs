(ns webster.listeners
  (:require [webster.dom :as dom]))

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

(defn select-node [jnode bridge]
  (let [pos (.offset jnode)
        width (.width jnode)
        height (.height jnode)]
    (make-selected jnode)
    (.callHandler bridge
                  "containerSelectedHandler"
                  (js-obj "top" (.-top pos)
                          "left" (.-left pos)
                          "width" width
                          "height" height
                          "tag" (.prop jnode "tagName")
                          "classes" (.split (.attr jnode "class") " ")))))

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

