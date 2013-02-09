(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]))

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
                                        (fn [event] (listeners/container-listener event bridge))
                                        false)))
    (dom/each-node (.getElementsByTagName js/document "h1")
                   (fn [node]
                     (.addEventListener node
                                        "click"
                                        (fn [event] (listeners/container-listener event bridge))
                                        false)))
    ;; Setup default listener
    (.addEventListener js/document "click" (fn [event] (listeners/default-listener event bridge)) false)
    (.registerHandler bridge "removeElementHandler" remove-element-handler)
    (.registerHandler bridge "editElementHandler" edit-element-handler)))

(defn remove-element-handler
  [data callback]
  (let [jnode (js/$ ".selected")]
    (listeners/make-unselected jnode)
    (.remove jnode)))

(defn edit-element-handler
  [data callback]
  (let [node (js/$ ".selected")]
    (dom/make-editable node true)))

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
