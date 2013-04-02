(ns webster.dir)

(defn rel-path
  [full-path]
  (second (re-matches #".*Documents/projects/[^/]*/(.*)" full-path)))

(defn file-name
  [full-path]
  (second (re-matches #".*/([^/]+)\..*" full-path)))

(defn thumb-to-lightbox-src
  [thumb-src]
  (let [matches (re-matches #"(.*)_THUMB(\..*)" thumb-src)
        filename (nth matches 1)
        ext (nth matches 2)]
    (str filename ext)))