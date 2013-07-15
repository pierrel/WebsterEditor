(ns webster.listeners
  (:require-macros [webster.macros :as macros])
  (:use [domina :only (log append! attr has-class? classes remove-class! add-class! children detach! nodes single-node)]
        [domina.css :only (sel)]
        [domina.events :only (listen! dispatch! unlisten! current-target stop-propagation prevent-default)])
  (:require [webster.dom :as dom]
            [webster.elements :as elements]
            [webster.html :as html]
            [webster.dir :as dir]
            [webster.touch :as touch]
            [webster.cart :as cart]
            [webster.range :as range]
            [clojure.string :as string]))

(defn default-listener
  [event bridge]
  (if bridge (.callHandler bridge "defaultSelectedHandler" (js-obj)))
  (make-unselected (sel ".selected"))
  (dom/stop-editing))

(defn container-listener
  [event bridge]
  (let [el (current-target event)]
    (cond
     (is-selected? el) (stop-propagation event)
     (and (has-class? el "image-thumb") (not (has-class? el "selected"))) (do
                                                                            (thumbnail-listener event bridge)
                                                                            (stop-propagation event)
                                                                            (stop-propagation event))
     :else (do
             (select-node (or (dom/first-content-child el) el) bridge)
             (stop-propagation event)
             (prevent-default event)))))

(defn thumbnail-listener
  [event bridge]
  (clear-selection)
  (let [el (current-target event)]
    (select-node el bridge (fn [data callback]
                              (if (aget data "delete")
                                (dom/delete-thumbnail! el bridge)
                                (do
                                  (if (has-class? el "empty")
                                    (dom/set-placeholder-thumbnail-src! el (aget data "resource-path") (aget data "thumb-path"))
                                    (do
                                      (dom/replace-thumbnail-src! el  (aget data "resource-path") (aget data "thumb-path"))
                                      (default-listener nil bridge)))
                                  (let [gallery (dom/closest el ".thumbnails")
                                        placeholder (sel gallery ".image-thumb.empty")]
                                    (when (nil? (single-node placeholder))
                                      (let [placeholder (dom/add-thumbnail-placeholder! gallery)]
                                        (listen! placeholder :click #(container-listener % bridge))
                                        (dispatch! placeholder :click {})
                                        (make-selected placeholder))))))))))

(def last-selected-text (atom ""))
(def last-used-selected-text (atom ""))
(def last-range-obj (atom nil))
(defn text-selected [bridge]
  (let [current-selected-text (range/selection-text)]
    (if (= current-selected-text "")
      (when-not (= @last-selected-text "")
        (reset! last-selected-text "")
        (.callHandler bridge
                      "hideLinkButton"
                      (clj->js {})))
      (do
        (reset! last-selected-text current-selected-text)
        (reset! last-range-obj (.getRangeAt (range/selection-obj) 0))
        (reset! last-used-selected-text current-selected-text)
        (.callHandler bridge
                      "showLinkButton"
                      (clj->js {}))))))

(defn get-last-range-obj []
  @last-range-obj)
(defn get-last-selected-text []
  @last-used-selected-text)


(defn select-node [el bridge & [callback]]
  (let [row-info (node-info el)]
    (make-selected el)
    (if bridge (.callHandler bridge
                             "containerSelectedHandler"
                             row-info
                             (if callback callback)))))
(defn clear-selection []
  (if (not (nothing-selected))
    (make-unselected (get-selected))))

(defn node-info
  [el]
  (let [the-info (node-info-map el)]
    (clj->js (if (is-row? el)
               (conj the-info [:children (map  node-info (children el))])
               the-info))))

(defn node-info-map
  [el]
  (let [node (single-node el)
        frame (dom/frame node)]
    (merge frame
           {:tag (.-tagName node)
            :classes (classes el)
            :addable (elements/possible-under (elements/node-to-element el))})))
 
(defn get-selected []
  (sel ".selected"))
(defn nothing-selected []
  (empty? (nodes (sel ".selected"))))

(defn make-selected [el]
  (make-unselected)
  (add-class! el "selected"))
(defn make-unselected
  ([]
     (if-let [selected (get-selected)]
       (make-unselected selected)))
  ([el]
     (remove-class! el "selected")))

(defn is-selected? [el]
  (has-class? el "selected"))

(defn is-row? [el]
  (has-class? el "row-fluid"))
