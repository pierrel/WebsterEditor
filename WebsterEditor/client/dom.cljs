(ns webster.dom)

(defn each-node
  "Calls callback for each DOM node in node-list"
  [node-list callback]
  (doseq [index (range (.-length node-list))]
    (callback (.item node-list index))))

(defn make-editable
  [node & focus]
  (.attr node "contenteditable" "true")
  (if focus
    (let [r (.createRange js/rangy)]
      (.setStart r (.get node 0) 0)
      (.collapse r true)
      (.setSingleRange (.getSelection js/rangy) r))))