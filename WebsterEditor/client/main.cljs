(ns webster)

(defn on-bridge-ready
  [event]
  (let [bridge (.-bridge event)]
    (let [els (.getElementsByClassName js/document "container-fluid")]
      (doseq [index (range (.-length els))]
        (let [el (.item els index)]
          (.addEventListener el
                             "click"
                             (fn [event] (container-listener event bridge))
                             false))))))
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


(.addEventListener js/document "WebViewJavascriptBridgeReady" on-bridge-ready false)
