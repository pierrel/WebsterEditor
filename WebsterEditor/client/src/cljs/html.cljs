 (ns webster.html
  (:require [clojure.string :as string]))

(defn attrs-to-str [attrs]
  (string/join " "
               (map #(format "%s=\"%s\"" (name (first %)) (second %)) attrs)))

(defn normalize
  ([tag]
     [tag {} nil])
  ([tag something]
     (if (map? something)
       [tag something nil]
       [tag {} (list something)]))
  ([tag attrs & contents]
     (if (map? attrs)
       [tag attrs contents]
       [tag {} (reduce conj [attrs] contents)])))

(defn compile-form [form]
  (cond (string? form) form
        (empty? form) ""
        :else (let [[tag attrs other-forms] (apply normalize form)]
                (format "<%s%s%s>%s</%s>"
                        (name tag)
                        (if (empty? attrs) "" " ")
                        (attrs-to-str attrs)
                        (apply str (map compile-form other-forms))
                        (name tag)))))

(defn compile
  [& forms]
  (apply str (map compile-form forms)))

