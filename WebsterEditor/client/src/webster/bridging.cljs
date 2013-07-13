(ns webster.bridging)

(defn register-handler
  [bridge handler-name handler]
  (.registerHandler bridge
                    handler-name
                    (fn [data callback]
                      (handler (js->clj data) callback bridge))))