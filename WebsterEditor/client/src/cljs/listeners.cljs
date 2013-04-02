(ns webster.listeners
  (:require [webster.dom :as dom]
            [webster.html :as html]
            [webster.dir :as dir]
            [clojure.string :as string]))

;; listeners
(defn selected-listener
  [event bridge]
  (if (= (.-target event) (.-currentTarget event))
    (.stopPropagation event)))

(defn default-listener
  [event bridge]
  (make-unselected (js/$ ".selected"))
  (.removeAttr (js/$ "[contenteditable=true]") "contenteditable")
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))

(defn container-listener
  [event bridge]
  (let [el (js/$ (.-currentTarget event))]
    (cond
     (and (not (.hasClass el "selected")) (nothing-selected))
     (do
       (select-node el bridge)
       (.stopPropagation event)
       (.preventDefault event))
     (.hasClass el "image-thumb") (thumbnail-listener event bridge))))

(defn thumbnail-listener
  [event bridge]
  (let [$el (js/$ (.-currentTarget event))]
    (select-node $el bridge (fn [data callback]
                              (if (aget data "delete")
                                (let [$thumb-image (.find $el "img")
                                      thumb-src (.attr $thumb-image "src")
                                      lightbox-src (dir/thumb-to-lightbox-src (.attr $thumb-image "src"))
                                      old-id (str "thumb-" (string/replace (dir/file-name (.attr $thumb-image "src")) "_THUMB" "")) 
                                      old-href (str "#" old-id)
                                      $lightbox (js/$ old-href)]
                                  (.callHandler bridge "removingMedia" (js-obj "thumb-src" thumb-src
                                                                               "lightbox-src" lightbox-src))
                                  (js/alert old-href)
                                  (js/alert $lightbox)
                                  (.remove $lightbox)
                                  (.remove $el))
                                (let [full-path (aget data "resource-path")
                                      thumb-full-path (aget data "thumb-path")
                                      thumb-rel-path (dir/rel-path thumb-full-path)
                                      rel-path (dir/rel-path full-path)
                                      id (str "thumb-" (dir/file-name full-path))
                                      href (str "#" id)]
                                  (if (.hasClass $el "empty")
                                    (let [old-element (.find $el ".empty-decorations")
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
                                                                      [:img {:class "media-object" :src rel-path}]]])]
                                      (.remove old-element)
                                      (.removeClass $el "empty")
                                      (.append $el new-element)
                                      (.append (js/$ " body") lightbox-el)
                                      (.addEventListener (aget (.find $el "a:last") 0) "click" (fn [event]
                                                                                                 (.preventDefault event)
                                                                                                 true)))
                                    (let [$thumb-image (.find $el "img")
                                          $link (.closest $thumb-image "a")
                                          old-id (str "thumb-" (second (re-matches #".*media/(.*)\..*" (.attr $thumb-image "src"))))
                                          old-href (str "#" old-id)
                                          $lightbox (js/$ old-href)]
                                      (.callHandler bridge "removingMedia" (js-obj "thumb-src" (.attr $thumb-image "src")
                                                                                   "lightbox-src" (dir/thumb-to-lightbox-src (.attr $thumb-image "src"))))
                                      (.attr $thumb-image "src" rel-path)
                                      (.attr $link "href" href)
                                      (.attr $lightbox "id" id)
                                      (.attr (.find $lightbox "img") "src" rel-path)))
                                  (let [$thumbnails (.closest $el ".thumbnails")]
                                    (if (not (.hasClass (.find $thumbnails ".image-thumb:last") "empty"))
                                      (.click (add-empty-thumbnail $thumbnails  bridge))))))))))

(defn add-empty-thumbnail [$gallery bridge]
  (let [$empty-thumb (js/$ (dom/empty-image-thumbnail))]
    (.append $gallery $empty-thumb)
    (.addEventListener (.get $empty-thumb 0) "click" (fn [event] (thumbnail-listener event bridge)))
    $empty-thumb))

(defn select-node [jnode bridge & [callback]]
  (let [row-info (node-info jnode)]
    (make-selected jnode)
    (.callHandler bridge
                  "containerSelectedHandler"
                  row-info
                  (if callback callback))))
 
(defn node-info
  [jnode]
  (let [pos (.offset jnode)
        width (.width jnode)
        height (.height jnode)
        the-info {:top (.-top pos)
                  :left (.-left pos)
                  :width width
                  :height height
                  :tag (.prop jnode "tagName")
                  :classes (.split (.attr jnode "class") " ")}]
    (clj->js (if (is-row? jnode)
               (conj the-info [:children (dom/map-nodes  node-info (.find jnode "> div"))])
               the-info))))
 
(defn get-selected []
  (js/$ ".selected"))
(defn nothing-selected []
  (= (.-length (js/$ ".selected")) 0))

(defn make-selected
  [jnode]
  (let [node (.get jnode 0)]
    (.addClass jnode "selected")
    (if node (.addEventListener node "click" selected-listener))))
(defn make-unselected
  [jnode]
  (let [node (.get jnode 0)]
    (.removeClass jnode "selected")
    (if node (.removeEventListener node "click" selected-listener))))
(defn is-selected
  [jnode]
  (.hasClass jnode "selected"))

(defn is-row?
      [jnode]
      (.hasClass jnode "row-fluid"))
