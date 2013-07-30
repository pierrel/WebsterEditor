(ns webster.move
  (:require [webster.listeners :as listeners]
            [webster.dom :as dom]
            [webster.touch :as touch]
            [domina :as domi]
            [domina.events :as events]))

(defn child-movable? [el]
  (not (domi/has-class? el "editing")))

(defn movable? [el]
  (loop [all-children (dom/child-seq el)]
    (let [current-el (first all-children)]
      (domi/log current-el)
      (cond
       (nil? current-el) true
       (child-movable? current-el) (recur (rest all-children))
       :else false))))

(def move-ended? (atom false))
(def move-started? (atom false))
(def move-canceled? (atom false))
(def moved? (atom false))

(defn start [event bridge]
  (events/stop-propagation event)
  (when (movable? (events/current-target event))
    (reset! move-ended? false)
    (reset! move-canceled? false)
    (js/setTimeout
     #(when-not (or @move-ended? @moved? @move-canceled?)
        (events/prevent-default event)
        (reset! move-started? true)
        (let [element (events/current-target event)
              touches (touch/touches event)]
          (dom/start-dragging! element
                               {:x (touch/page-x touches)
                                :y (touch/page-y touches)})))
     500)))

(defn move [event bridge]
  (if (and @move-started? (not @move-canceled?))
    (do
      (reset! moved? true)
      (events/prevent-default event)
      (events/stop-propagation event)
      (if (not (listeners/nothing-selected)) (listeners/default-listener event bridge))
      (let [element (events/current-target event)
            touches (touch/touches event)]
        (dom/drag! element {:x (touch/page-x touches)
                            :y (touch/page-y touches)})))
    (reset! move-canceled? true)))

(defn end [event bridge]
  (reset! move-ended? true)
  (reset! move-started? false)
  (events/prevent-default event)
  (events/stop-propagation event)
  (let [el (events/current-target event)
        droppables (dom/possible-droppables el)
        touches (touch/changed-touches event)
        point {:left (touch/page-x touches)
               :top (touch/page-y touches)}]
    (if-not @moved?
      (if-not @move-canceled? (listeners/container-listener event bridge)) ;; hasn't moved so it's a "click"
      (let [drop-on (first (filter #(dom/point-in-element? point %) droppables))]
        (reset! moved? false)
        (when drop-on
          (domi/detach! el)
          (doseq [new-child
                  (dom/arrange-in-nodes el point (domi/children drop-on))]
            (domi/detach! new-child)
            (domi/append! drop-on new-child)))))
    (dom/stop-dragging! el))) 

