(ns webster.range)

(defn selection-text []
  (.toString (.getSelection js/rangy)))