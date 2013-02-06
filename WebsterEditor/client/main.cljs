(ns webster)

(defn log [message & data]
  (let [log (.getElementById js/document "log")
        el (.createElement js/document "div")]
    (set! (.-className el) "logLine")
    (set! (.-innerHTML el) (str message (if data (str ": <br\\>" (.stringify js/JSON data)) "")))
    (if (.-length (.-children log))
      (.insertBefore log el (first (.-children log)))
      (.appendChild log el))))
(.live (js/$ "#button") "click" (fn [event]
                                  (js/alert "clicked")
                                  (log "somehting")))
(.addEventListener js/document
                   "WebViewJavascriptBridgeReady"
                   (fn [event]
                     (let [bridge (.-bridge event)]
                       (.init bridge (fn [message callback]
                                       (let [data (js-obj "Javascript responds" "Wee!")])
                                       (log "js got message" message)
                                       (log "responding with" data)
                                       (callback data)))
                       (.registerHandler bridge "testJavascriptHandler" (fn [data callback]
                                                                          (let [jsdata (js-obj "Javascript says" "Right back!")]
                                                                            (log "obj called testJavascriptHandler with" data)
                                                                            (log "JS responsing with" jsdata)
                                                                            (callback jsdata))))))
                   nil)
(.text (js/$ "#button") "this is the new text")
;; window.onerror = function(err) {
;;     log('window.onerror: ' + err)
;; }
;; document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false)
;; function onBridgeReady(event) {
;;     var bridge = event.bridge
;;     var uniqueId = 1
;;     bridge.init(function(message, responseCallback) {
;;                 log('JS got a message', message)
;;                 var data = { 'Javascript Responds':'Wee!' }
;;                 log('JS responding with', data)
;;                 responseCallback(data)
;;                 })
    
;;     bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
;;                            log('ObjC called testJavascriptHandler with', data)
;;                            var responseData = { 'Javascript Says':'Right back atcha!' }
;;                            log('JS responding with', responseData)
;;                            responseCallback(responseData)
;;                            })
            
;;     var callbackContainer = document.getElementsByClassName('container-fluid')[0];
;;     log("the container!");
;;     log(callbackContainer);
;;     callbackContainer.ontouchstart = function(e) {
;;         e.preventDefault();
;;         log("clicked the container");
;;         bridge.callHandler('elementHandler', {'element': 'container'}, function(response) {
;;                            log('Container got response', response);
;;                            });
;;     }
;; }


(js/alert "hello from cljs!")