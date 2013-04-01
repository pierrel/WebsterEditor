(ns webster.dir)

(defn rel-path
  [full-path]
  (second (re-matches #".*Documents/projects/[^/]*/(.*)" full-path)))

(defn file-name
  [full-path]
  (second (re-matches #".*/([^/]+)\..*" full-path)))