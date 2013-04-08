(ns webster.elements)

(def all
     {:editing    [{:name "paragraph", :tag :p}
                   {:name "heading", :tag :h1}]
      :structural [{:name "container", :tag :div, :class "container-fluid"}
                   {:name "row", :tag :div, :class "row-fluid"}
                   {:name "column", :tag :div, :class "span1"}]})

(def all-flat
     (apply concat (map #(second %) all)))

(defn possible-under [node]
  (loop [category-els all acc {}]
    (if (seq category-els)
      (recur (next category-els) (assoc acc
                                   (first (first category-els))
                                   (map #(:name %) (second (first category-els)))))
      acc)))

(defn get-by-name [name]
  (first (filter #(= (:name %) name) all-flat)))