(ns webster.main
  (:require [webster.dom :as dom]
            [webster.listeners :as listeners]))

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
    (.registerHandler bridge "removeElementHandler" remove-element-handler)
    (.registerHandler bridge "editElementHandler" edit-element-handler)
    (.registerHandler bridge "addRowUnderSelectedElement" (fn [data callback] (add-row-handler data callback bridge)))
    (.registerHandler bridge "incrementColumn" increment-column)))

(defn increment-column
  [data callback]
  (let [jselected (listeners/get-selected)
        index (js/parseInt (aget data "index") 10)
        jcolumn (js/$ (.get (.find jselected "> div") index))
        span-num (dom/get-column-count jcolumn)]
    (dom/set-column-count jcolumn (+ 1 span-num))))
 
(defn remove-element-handler
  [data callback]
  (let [jnode (js/$ ".selected")]
    (listeners/make-unselected jnode)
    (.remove jnode)))

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

(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
