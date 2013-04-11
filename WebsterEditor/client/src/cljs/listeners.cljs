(ns webster.listeners
    (:use [domina :only (log has-class? classes children)]
        [domina.css :only (sel)]
        [domina.events :only (listen! current-target stop-propagation prevent-default)])
  (:require [webster.dom :as dom]
            [webster.elements :as elements]
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
  (dom/stop-editing)
  (.callHandler bridge "defaultSelectedHandler" (js-obj)))

(defn container-listener
  [event bridge]
  (let [el (current-target event)]
    (cond
     (and (has-class? el "image-thumb") (not (has-class? el "selected"))) (do
                                                                          (thumbnail-listener event bridge)
                                                                          (stop-propagation event)
                                                                          (stop-propagation event))
     (and (not (has-class? el "selected")) (nothing-selected)) (do
                                                                (select-node el bridge)
                                                                (stop-propagation event)
                                                                (prevent-default event)))))

(defn thumbnail-listener
  [event bridge]
  (clear-selection)
  (let [$el (js/$ (.-currentTarget event))]
    (select-node $el bridge (fn [data callback]
                              (if (aget data "delete")
                                (let [$thumb-image (.find $el "img")
                                      thumb-src (.attr $thumb-image "src")
                                      lightbox-src (dir/thumb-to-lightbox-src (.attr $thumb-image "src"))
                                      old-id (str "thumb-" (string/replace (dir/file-name (.attr $thumb-image "src")) "_THUMB" ""))
                                      old-href (str "#" old-id)
                                      $lightbox (js/$ old-href)]
                                  (.callHandler bridge "removingMedia" (js-obj "media-src" thumb-src))
                                  (.callHandler bridge "removingMedia" (js-obj "media-src" lightbox-src))
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
                                      (.callHandler bridge "removingMedia" (js-obj "media-src" (.attr $thumb-image "src")))
                                      (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/thumb-to-lightbox-src (.attr $thumb-image "src"))))
                                      (.attr $thumb-image "src" rel-path)
                                      (.attr $link "href" href)
                                      (.attr $lightbox "id" id)
                                      (.attr (.find $lightbox "img") "src" rel-path)))
                                  (let [$thumbnails (.closest $el ".thumbnails")]
                                    (if (= (.-length (.find $thumbnails ".image-thumb.empty")) 0)
                                      (.click (add-empty-thumbnail $thumbnails  bridge))
                                      (clear-selection)))))))))

(defn add-empty-thumbnail [$gallery bridge]
  (let [$empty-thumb (js/$ (dom/empty-image-thumbnail))]
    (.append $gallery $empty-thumb)
    (.addEventListener (.get $empty-thumb 0) "click" (fn [event] (container-listener event bridge)))
    $empty-thumb))

(defn select-node [el bridge & [callback]]
  (let [row-info (node-info el)]
    (make-selected el)
    (.callHandler bridge
                  "containerSelectedHandler"
                  row-info
                  (if callback callback))))
(defn clear-selection []
  (if (not (nothing-selected))
    (make-unselected (get-selected))))

(defn node-info
  [el]
  (let [pos (dom/offset el)
        the-info {:top (:top pos)
                  :left (:left pos)
                  :width (dom/width el)
                  :height (dom/height el)
                  :tag (.-tagName el)
                  :classes (classes el)
                  :addable (elements/possible-under (elements/node-to-element el))}]
    (clj->js (if (is-row? el)
               (conj the-info [:children (dom/map-nodes  node-info (children el))])
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
