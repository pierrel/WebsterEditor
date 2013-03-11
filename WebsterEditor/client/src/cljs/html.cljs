(ns webster.html
  (:require [clojure.string :as string]))

(defn sym-to-str [sym]
  (string/replace (str sym) ":" ""))

(defn attrs-to-str
  [attrs]
  (string/join " "
          (map (fn [key]
                 (let [skey (sym-to-str key)]
                   (format "%s=\"%s\"" skey (attrs key))))
               (keys attrs))))

(defn compile
  [args]
  (cond
   (= (count args) 1) (compile [(first args) {} ""])
   (= (count args) 2) (cond
                       (map? (second args)) (compile [(first args) (second args) ""])
                       :else (compile [(first args) {} (second args)]))
   (= (count args) 3) (let [tag (first args)
                            attrs (second args)
                            contents (last args)
                            tag-str (sym-to-str tag)
                            attrs-str (attrs-to-str attrs)
                            contents-str (cond
                                          (string? contents) contents
                                          :else (compile contents))]
                        (format "<%s%s>%s</%s>"
                                tag-str
                                (if (or (empty? attrs-str) (nil? attrs-str)) "" (str " " attrs-str))
                                contents-str
                                tag-str))))