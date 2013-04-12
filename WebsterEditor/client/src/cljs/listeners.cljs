(ns webster.listeners
    (:use [domina :only (log append! attr has-class? classes remove-class! add-class! children detach! nodes)]
        [domina.css :only (sel)]
        [domina.events :only (listen! unlisten! current-target stop-propagation prevent-default)])
  (:require [webster.dom :as dom]
            [webster.elements :as elements]
            [webster.html :as html]
            [webster.dir :as dir]
            [clojure.string :as string]))

;; listeners
(defn selected-listener
  [event bridge]
  (if (= (.-target event) (.-currentTarget event))
    (stop-propagation event)))

(defn default-listener
  [event bridge]
  (make-unselected (sel ".selected"))
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
  (let [el (current-target event)]
    (select-node el bridge (fn [data callback]
                              (if (aget data "delete")
                                (let [$thumb-image (sel el "img")
                                      thumb-src (.attr $thumb-image "src")
                                      lightbox-src (dir/thumb-to-lightbox-src (.attr $thumb-image "src"))
                                      old-id (str "thumb-" (string/replace (dir/file-name (.attr $thumb-image "src")) "_THUMB" ""))
                                      old-href (str "#" old-id)
                                      lightbox (sel old-href)]
                                  (.callHandler bridge "removingMedia" (js-obj "media-src" thumb-src))
                                  (.callHandler bridge "removingMedia" (js-obj "media-src" lightbox-src))
                                  (detach! lightbox)
                                  (detach! el))
                                (let [full-path (aget data "resource-path")
                                      thumb-full-path (aget data "thumb-path")
                                      thumb-rel-path (dir/rel-path thumb-full-path)
                                      rel-path (dir/rel-path full-path)
                                      id (str "thumb-" (dir/file-name full-path))
                                      href (str "#" id)]
                                  (if (has-class? el "empty")
                                    (let [old-element (sel el ".empty-decorations")
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
                                      (detach! old-element)
                                      (remove-class! el "empty")
                                      (append! el new-element)
                                      (append! (sel " body") lightbox-el)
                                      (listen! (sel el "a:last") :click (fn [event]
                                                                          (prevent-default event)
                                                                          true)))
                                    (let [thumb-image (sel el "img")
                                          link (dom/closest thumb-image "a")
                                          old-id (str "thumb-" (second (re-matches #".*media/(.*)\..*" (attr thumb-image "src"))))
                                          old-href (str "#" old-id)
                                          lightbox (sel old-href)]
                                      (.callHandler bridge "removingMedia" (js-obj "media-src" (attr thumb-image "src")))
                                      (.callHandler bridge "removingMedia" (js-obj "media-src" (dir/thumb-to-lightbox-src (attr thumb-image "src"))))
                                      (set-attr! thumb-image "src" rel-path)
                                      (set-attr! link "href" href)
                                      (set-attr! lightbox "id" id)
                                      (set-attr! (sel lightbox "img") "src" rel-path)))
                                  (let [thumbnails (dom/closest el ".thumbnails")]
                                    (if (nil? (sel thumbnails ".image-thumb.empty"))
                                      (dispatch! (add-empty-thumbnail thumbnails  bridge))
                                      (clear-selection)))))))))

(defn add-empty-thumbnail [gallery bridge]
  (append! gallery (dom/empty-image-thumbnail))
  (let [empty-thumb (last (children gallery))]
    (listen! empty-thumb :click (fn [event] (container-listener event bridge)))
    empty-thumb))

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
  (sel ".selected"))
(defn nothing-selected []
  (empty? (nodes (sel ".selected"))))

(defn make-selected [el]
  (add-class! el "selected")
  (listen! el :click selected-listener))
(defn make-unselected [el]
  (remove-class! el "selected")
  (unlisten! el :click))
(defn is-selected [el]
  (has-class? el "selected"))

(defn is-row? [el]
  (has-class? el "row-fluid"))
