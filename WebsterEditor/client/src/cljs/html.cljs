(ns webster.html
  (:require [clojure.string :as string]))

(defn attrs-to-str
  [attrs]
  (string/join " "
          (map (fn [key]
                 (let [skey (string/replace (str key) ":" "")]
                   (format "%s=\"%s\"" skey (attrs key))))
               (keys attrs))))