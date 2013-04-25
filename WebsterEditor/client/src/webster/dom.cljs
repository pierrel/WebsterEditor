(ns webster.dom
  (:require [webster.html :as html]
            [webster.dir :as dir]
            [webster.elements :as elements]
            [domina :as dom]
            [domina.css :as css]
            [domina.events :as events]
            [clojure.string :as string]))

(defn offset-from-parent [el]
  {:top (.-offsetTop el)
   :left (.-offsetLeft el)})

(defn offset [el]
  (loop [current-el el
         off {:top 0, :left 0}]
    (if current-el
      (recur (.-offsetParent current-el) (assoc off
                                           :top (+ (:top off) (-> current-el offset-from-parent :top))
                                           :left (+ (:left off) (-> current-el offset-from-parent :left))))
      off)))

(defn width [el]
  (.-offsetWidth el))
(defn height [el]
  (.-offsetHeight el))

(defn parent [el]
  (.-parentNode (dom/single-node el)))

(defn ancestors
  "Returns a vector of all ancestors, starting with the immediate parent"
  [of-el]
  (loop [ancestor (parent (dom/single-node of-el)) acc []]
    (if ancestor
      (recur (parent ancestor) (conj acc ancestor))
      acc)))

(defn closest [el selector]
  (let [all-matching-els (disj (-> selector css/sel dom/nodes set) (dom/single-node el))]
    (first (filter all-matching-els (ancestors el)))))

(defn new-element-attrs [el-info]
  (let [class {:class (str (if (not (:unselectable el-info)) "selectable" "")
                           " "
                           (if (:class el-info) (:class el-info) "")) } 
        type {:data-type (:name el-info)}]
    (merge class type)))

(defn new-element-structure [el-info]
  [(:tag el-info)
   (new-element-attrs el-info)
   (cond
    (:contains-text el-info) (:contains-text el-info)
    (:contains el-info) (new-element-structure (elements/get-by-name (:contains el-info))))])

(defn new-element-with-info [el-info]
  (html/compile (new-element-structure el-info)))

(defn new-image-gallery []
  (html/compile [:div {:class "row-fluid selectable"}
                 [:ul {:class "thumbnails" :data-span "4"}]]))

(defn empty-image-thumbnail []
  (html/compile (new-element-structure (elements/get-by-name "gallery image"))))

;; Thumbnail interactions
(defn delete-thumbnail! [thumbnail-el & [bridge]]
  (let [thumb-image (css/sel thumbnail-el "img")
        thumb-src (dom/attr thumb-image "src")
        lightbox-src (dir/thumb-to-lightbox-src (dom/attr thumb-image "src"))
        old-id (str "thumb-" (string/replace (dir/file-name thumb-src) "_THUMB" ""))
        old-href (str "#" old-id)
        lightbox (css/sel old-href)]
    (when bridge
      (.callHandler bridge "removingMedia" (js-obj "media-src" thumb-src))
      (.callHandler bridge "removingMedia" (js-obj "media-src" lightbox-src)))
    (dom/detach! lightbox)
    (dom/detach! thumbnail-el)))

(defn add-thumbnail-placeholder!
  "adds a placeholder thumbnail to the gallery and returns the placeholder"
  [gallery]
  (dom/append! gallery (empty-image-thumbnail))
  (-> gallery dom/children last))

(defn set-placeholder-thumbnail-src! [placeholder-el image-path thumb-path]
  (let [thumb-rel-path (dir/rel-path thumb-path)
        image-rel-path (dir/rel-path image-path)
        id (str "thumb-" (dir/file-name image-path))
        href (str "#" id)
        old-element (css/sel placeholder-el ".empty-decorations")
        new-element (html/compile [:a {:href href
                                       :class "thumbnail"
                                       :data-toggle "lightbox"}
                                   [:img {:src thumb-rel-path}]])
        lightbox-el (html/compile [:div {:id id
                                         :class "lightbox hide fade"
                                         :tabindex "-1"
                                         :role "dialog"
                                         :aria-hidden true
                                         :style "z-index: 10000;"}
                                   [:div {:class "lightbox-content"}
                                    [:img {:class "media-object" :src image-rel-path}]]])]
    (dom/destroy! old-element)
    (dom/remove-class! placeholder-el "empty")
    (dom/append! placeholder-el new-element)
    (dom/append! (css/sel " body") lightbox-el)
    (events/listen! (css/sel placeholder-el "a:last") :click dom/prevent-default)))

(defn replace-thumbnail-src! [thumbnail new-image-path new-thumb-path & [bridge]]
  (let [thumb-rel-path (dir/rel-path new-thumb-path)
        image-rel-path (dir/rel-path new-image-path)
        id (str "thumb-" (dir/file-name new-image-path))
        href (str "#" id)
        thumb-image (css/sel thumbnail "img")
        link (closest thumb-image "a")
        old-id (str "thumb-" (second (re-matches #".*media/(.*)\..*" (dom/attr thumb-image "src"))))
        old-href (str "#" old-id)
        lightbox (css/sel old-href)]
    (when bridge
      (.callHandler bridge "removingMedia" (js-obj "media-src" (dom/attr thumb-image "src")))
      (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/thumb-to-lightbox-src (dom/attr thumb-image "src")))))
    (dom/set-attr! thumb-image "src" thumb-rel-path)
    (dom/set-attr! link "href" href)
    (dom/set-attr! lightbox "id" id)
    (dom/set-attr! (css/sel lightbox "img") "src" image-rel-path)))

;; (defn each-node
;;   "Calls callback for each DOM node in node-list"
;;   [node-list callback]
;;   (doseq [index (range (.-length node-list))]
;;     (callback (.item node-list index))))

;; (defn map-nodes
;;   [callback node-list]
;;   (map (fn [index] (callback (js/$ (.get node-list index))))
;;        (range (.-length node-list))))

;; (defn get-jnode
;;   "grabs the node at index in jnodes and returns the corresponding jnode"
;;   [jnodes index]
;;   (js/$ (.get jnodes index)))

(defn get-column-span
  [el]
  (let [matches (re-find #"span(\d+)" (dom/attr el "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-span
  [jnode count]
  (let [old-count (get-column-span jnode)]
    (dom/remove-class! jnode (str "span" old-count))
    (dom/add-class! jnode (str "span" count))))

(defn increment-column-span
  [el]
  (set-column-span el (+ (get-column-span el) 1)))
(defn decrement-column-span
  [el]
  (set-column-span el (- (get-column-span el) 1)))


(defn get-column-offset
  [el]
    (let [matches (re-find #"offset(\d+)" (dom/attr el "class"))]
    (if (> (count matches) 1)
      (js/parseInt (second matches) 10)
      0)))

(defn set-column-offset
  [el count]
  (let [old-count (get-column-offset el)]
    (dom/remove-class! el (str "offset" old-count))
    (dom/add-class! el (str "offset" count))))

(defn increment-column-offset
  [el]
  (set-column-offset el (+ (get-column-offset el) 1)))
(defn decrement-column-offset
  [el]
  (set-column-offset el (- (get-column-offset el) 1)))

(defn get-column-width
  [el]
  (+ (get-column-span el) (get-column-offset el)))

(def column-max 12)

(defn make-editable
  [el & focus]
  (dom/set-attr! el :contenteditable "true")
  (dom/add-class! el "editing")
  (if focus
    (let [r (.createRange js/rangy)]
      (.setStart r (dom/single-node el) 0)
      (.collapse r true)
      (.setSingleRange (.getSelection js/rangy) r))))

(defn stop-editing
  ([]
     (stop-editing (css/sel ".editing")))
  ([el]
     (dom/remove-attr! el :contenteditable)
     (dom/remove-class! el "editing")))

(defn set-blueprint-mode []
  (if (not (is-blueprint-mode?))
    (dom/add-class! (css/sel "body") "blueprint")))
(defn set-content-mode []
  (if (not (is-content-mode?))
    (dom/remove-class! (css/sel "body") "blueprint")))

(defn dragging-element []
  (first (dragging-elements)))
(defn dragging-elements []
  (-> "dragging" dom/by-class dom/nodes))
(defn stop-dragging!
  ([]
     (stop-dragging! (dragging-elements)))
  ([content]
     (dom/remove-class! content "dragging")))
(defn start-dragging! [content]
  (dom/add-class! content "dragging"))

(defn get-mode []
  (if (dom/has-class? (css/sel "body") "blueprint")
    "blueprint"
    "content"))s
(defn is-blueprint-mode? []
  (= (get-mode) "blueprint"))
(defn is-content-mode? []
  (= (get-mode) "content"))