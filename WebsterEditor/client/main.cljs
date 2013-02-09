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
  (.remove (js/$ ".selected")))

(defn edit-element-handler
  [data callback]
  (let [node (js/$ ".selected")
        r (.createRange js/rangy)]
    (.attr node "contenteditable" "true")
    (.setStart r (.get node 0) 0) ;; TODO put all this stuff in a function...
    (.collapse r true)
    (.setSingleRange (.getSelection js/rangy) r)))

(defn container-listener
  [event bridge]
  
  (let [el (js/$ (.-currentTarget event))]
    (if (not (.hasClass el "selected"))
      (let [pos (.offset el)
            width (.width el)
            height (.height el)]
        (.addClass el "selected")
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

(defn default-listener
  [event bridge]
  (.removeClass (js/$ ".selected") "selected")
  (.removeAttr (js/$ "[contenteditable=true]") "contenteditable")
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))


(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
