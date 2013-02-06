(ns webster)

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    ;; Setup container listener
    (let [els (.getElementsByClassName js/document "container-fluid")]
      (doseq [index (range (.-length els))]
        (let [el (.item els index)]
          (.addEventListener el
                             "click"
                             (fn [event] (container-listener event bridge))
                             false))))
    ;; Setup default listener
    (.addEventListener js/document "click" (fn [event] (default-listener event bridge)) false)))

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
                              "height" height))
        (.stopPropagation event)
        (.preventDefault event)))))

(defn default-listener
  [event bridge]
  (.removeClass (js/$ ".selected") "selected")
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))


(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
