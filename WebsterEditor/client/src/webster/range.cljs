(ns webster.range)

(defn selection-obj []
  (.getSelection js/rangy))

(defn selection-text []
  (.toString (selection-obj)))
