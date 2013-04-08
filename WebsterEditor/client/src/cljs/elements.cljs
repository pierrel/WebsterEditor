(ns webster.elements
  (:require
   [clojure.string :as string]
   [clojure.set :as set]))

(def all
     {:editing    [{:name "paragraph", :tag :p}
                   {:name "heading", :tag :h1}]
      :structural [{:name "container", :tag :div, :class "container-fluid"}
                   {:name "row", :tag :div, :class "row-fluid"}
                   {:name "column", :tag :div, :class "span1", :only-under #{"row"}}]})

(def all-flat
     (apply concat (map #(second %) all)))

(defn allowed? [element parent-element]
  (if (seq (:only-under element))
    (contains? (:only-under element) (:name parent-element))
    true))

(defn possible-under [element]
  (loop [category-els all acc {}]
    (if (seq category-els)
      (let [category (first (first category-els))
            elements (second (first category-els))]
        (recur (next category-els) (assoc acc
                                     category
                                     (map #(:name %) (filter #(allowed? % element) elements)))))
      acc)))

(defn get-by-name [name]
  (first (filter #(= (:name %) name) all-flat)))

(defn node-to-element [node]
  (let [type (.attr node "data-type")]
    (if (seq type)
      (get-by-name type))))