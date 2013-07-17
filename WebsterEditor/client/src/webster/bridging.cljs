(ns webster.bridging)

(defn register-handler
  [bridge handler-name handler]
  (.registerHandler bridge
                    handler-name
                    (fn [data callback]
                      (handler (js->clj data) callback bridge))))

(defn register-handlers
  [bridge handler-map]
  (doseq [handler handler-map]
    (register-handler bridge
                      (first handler)
                      (second handler))))