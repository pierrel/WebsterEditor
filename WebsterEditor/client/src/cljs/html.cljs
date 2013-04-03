 (ns webster.html
  (:require [clojure.string :as string]))

(defn attrs-to-str [attrs]
  (string/join " "
               (map #(format "%s=\"%s\"" (name (first %)) (second %)) attrs)))

(defn compile-form
  [args]
  (cond
   (= (count args) 1) (compile-form [(first args) {} ""])
   (= (count args) 2) (cond
                       (map? (second args)) (compile-form [(first args) (second args) ""])
                       :else (compile-form [(first args) {} (last args)]))
   :else (let [tag (first args)
               attrs (second args)
               contents (drop 2 args)
               tag-str (sym-to-str tag)
               attrs-str (attrs-to-str attrs)
               contents-str (cond
                             (= 1 (count contents)) (if (string? (first contents)) (first contents) (compile-form (first contents)))
                             :else (reduce str (map compile-form contents)))]
           (format "<%s%s>%s</%s>"
                   tag-str
                   (if (or (empty? attrs-str) (nil? attrs-str)) "" (str " " attrs-str))
                   contents-str
                   tag-str))))
(defn compile
  [& forms]
  (reduce str (map compile-form forms)))