(ns webster.elements
  (:require
   [clojure.string :as string]
   [clojure.set :as set]))

(def all
     {:editing    [{:name "paragraph", :tag :p}
                   {:name "heading", :tag :h1}]
      :structural [{:name "container", :tag :div, :class "container-fluid"}
                   {:name "row", :tag :div, :class "row-fluid"}
                   {:name "column", :tag :div, :class "span1", :only-under-classes #{"row-fluid"}}]})

(def all-flat
     (apply concat (map #(second %) all)))

(defn node-classes [node]
  (string/split (.attr node "class") #"\s"))

(defn allowed [element node]
  (if (seq (:only-under-classes element))
    (seq (set/intersection (:only-under-classes element) (set (string/split (.attr node "class") #"\s"))))
    true))

(defn possible-under [node]
  (loop [category-els all acc {}]
    (if (seq category-els)
      (let [category (first (first category-els))
            elements (second (first category-els))]
        (recur (next category-els) (assoc acc
                                     category
                                     (map #(:name %) (filter #(allowed % node) elements)))))
      acc)))

(defn get-by-name [name]
  (first (filter #(= (:name %) name) all-flat)))