(ns webster.macros)

(defmacro blueprint-event [event bridge & body]
  `(if (dom/is-blueprint-mode?)
     (do
       ~@body)
     (stop-propagation event)))