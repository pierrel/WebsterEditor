(ns webster.elements
  (:use [domina :only (log attr)])
  (:require
   [clojure.string :as string]
   [clojure.set :as set]))

(def all
     (sorted-map
      :structure  [{:name "container", :tag :div, :class "container-fluid"}
                   {:name "row", :tag :div, :class "row-fluid", :only-under #{"container"}}
                   {:name "column", :tag :div, :class "span1", :only-under #{"row"}}]
      :text       [{:name "paragraph", :tag :p, :class "text-editable"}
                   {:name "heading", :tag :h1, :class "text-editable"}
                   {:name "subheading", :tag :h2, :class "text-editable"}] 
      :components [{:name "gallery", :tag :ul, :class "thumbnails", :contains "gallery image", :only-under #{"row"}}
                   {:name "gallery image", :tag :li, :class "span4 empty image-thumb", :contains "empty gallery image", :only-under #{"gallery"}}
                   {:name "empty gallery image", :tag :div, :class "empty-decorations", :contains-text "Add Image", :only-under #{"gallery image"}, :unselectable true}]))

(def all-flat
     (apply concat (map #(second %) all)))

(defn allowed? [element parent-element]
  (cond
   (contains? (set (:text all)) parent-element) false
   (seq (:only-under element))                     (contains? (:only-under element) (:name parent-element))
   :else true))

(defn possible-under [element]
  (loop [category-els all acc {}]
    (if (seq category-els)
      (let [category (first (first category-els))
            elements (second (first category-els))
            allowed-elements (map #(:name %) (filter #(allowed? % element) elements))]
        (recur (next category-els) (if (seq allowed-elements)
                                     (assoc acc
                                       category
                                       allowed-elements)
                                     acc)))
      acc)))

(defn get-by-name [name]
  (first (filter #(= (:name %) name) all-flat)))

(defn node-to-element [node]
  (let [type (attr node :data-type)]
    (if (seq type)
      (get-by-name type))))