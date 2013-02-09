(ns webster.main
  (:require [webster.dom :as dom]))

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    ;; initialize the bridge
    (.init bridge "handler?")
    ;; Setup container listener
    (dom/each-node (.getElementsByClassName js/document "container-fluid")
                   (fn [node]
                     (.addEventListener node
                                        "click"
                                        (fn [event] (container-listener event bridge))
                                        false)))
    (dom/each-node (.getElementsByTagName js/document "h1")
                   (fn [node]
                     (.addEventListener node
                                        "click"
                                        (fn [event] (container-listener event bridge))
                                        false)))
    ;; Setup default listener
    (.addEventListener js/document "click" (fn [event] (default-listener event bridge)) false)
    (.registerHandler bridge "removeElementHandler" remove-element-handler)
    (.registerHandler bridge "editElementHandler" edit-element-handler)))

(defn remove-element-handler
  [data callback]
  (let [jnode (js/$ ".selected")]
    (make-unselected jnode)
    (.remove jnode)))

(defn edit-element-handler
  [data callback]
  (let [node (js/$ ".selected")]
    (dom/make-editable node true)))

(defn container-listener
  [event bridge]
  
  (let [el (js/$ (.-currentTarget event))]
    (if (and (not (.hasClass el "selected")) (nothing-selected))
      (let [pos (.offset el)
            width (.width el)
            height (.height el)]
        (make-selected el)
        (.callHandler bridge
                      "containerSelectedHandler"
                      (js-obj "top" (.-top pos)
                              "left" (.-left pos)
                              "width" width
                              "height" height
                              "tag" (.prop el "tagName")
                              "classes" (.split (.attr el "class") " ")))
        (.stopPropagation event)
        (.preventDefault event)))))

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

(defn selected-listener
  [event bridge]
  (if (= (.-target event) (.-currentTarget event))
    (.stropPropagation event)))

(defn default-listener
  [event bridge]
  (make-unselected (js/$ ".selected"))
  (.removeAttr (js/$ "[contenteditable=true]") "contenteditable")
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))


(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
