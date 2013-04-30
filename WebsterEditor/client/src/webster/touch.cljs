(ns webster.touch
  (:require [domina :as dom]
            [domina.events :as events]))
  
(defprotocol TouchEvent
  (touches [touch-evt] "returns a sequence of touch objects")
  (changed-touches [touch-evt] "returns a sequence of cahnged touch objects"))

(defn- lazy-tl-via-item
  ([tl] (lazy-tl-via-item tl 0))
  ([tl n] (when (< n (. tl -length))
            (lazy-seq
             (cons (. tl (item n))
                   (lazy-tl-via-item tl (inc n)))))))

(defn- lazy-tl-via-array-ref
  ([tl] (lazy-tl-via-array-ref tl 0))
  ([tl n] (when (< n (. tl -length))
            (lazy-seq
             (cons (aget tl n)
                   (lazy-tl-via-array-ref tl (inc n)))))))

(defn- lazy-touchlist
  "A lazy seq view of a js/TouchList, or other array-like javascript things"
  [tl]
  (if (. tl -item)
    (lazy-tl-via-item tl)
    (lazy-tl-via-array-ref tl)))

(defn property-from-raw [property raw-event]
  (lazy-touchlist (aget (.getBrowserEvent raw-event) property)))

(def touches-from-raw (partial property-from-raw "touches"))
(def changed-touches-from-raw (partial property-from-raw "changedTouches"))

(extend-protocol TouchEvent
  goog.events/Event
  (touches [event] (touches-from-raw event))
  (changed-touches [event] (changed-touches-from-raw event))
  
  default
  (touches [event]
           (touches-from-raw (events/raw-event event)))
  (changed-touches [event]
                   (changed-touches-from-raw (events/raw-event event))))

(defn single-touch [content]
  (cond
   (nil? content) nil
   (satisfies? ISeqable content) (first content)
   (array-like? content) (. content (item 0))
   :default content))

(defprotocol Touch
  (identifier [touch-event] "A unique identifier for this Touch object")
  (screen-x [touch-event] "The X coordinate of the touch point relative to the left edge of the screen")
  (screen-y [touch-event] "The Y coordinate of the touch point relative to the top edge of the screen")
  (client-x [touch-event] "The X coordinate of the touch point relative to the left edge of the browser viewport, not including any scroll offset")
  (client-y [touch-event] "The Y coordinate of the touch point relative to the top edge of the browser viewport, not including any scroll offset")
  (page-x [touch-event] "The X coordinate of the touch point relative to the left edge of the document")
  (page-y [touch-event] "The Y coordinate of the touch point relative to the top of the document")
  (radius-x [touch-event] "The X radius of the ellipse that most closely circumscribes the area of contact with the screen")
  (radius-y [touch-event] "The Y radius of the ellipse that most closely circumscribes the area of contact with the screen")
  (rotation-angle [touch-event] "The angle (in degrees) that the ellipse described by radiusX and radiusY must be rotated, clockwise, to most accurately cover the area of contact between the user and the surface")
  (force [touch-event] "The amount of pressure being applied to the surface by the user, as a float between 0.0 (no pressure) and 1.0 (maximum pressure)"))

(extend-protocol Touch
  default
  (identifier [tevt] (-> tevt single-touch .-identifier))
  (screen-x [tevt] (-> tevt single-touch .-screenX))
  (screen-y [tevt] (-> tevt single-touch .-screenY))
  (client-x [tevt] (-> tevt single-touch .-clientX))
  (client-y [tevt] (-> tevt single-touch .-clientY))
  (page-x [tevt] (-> tevt single-touch .-pageX))
  (page-y [tevt] (-> tevt single-touch .-pageY))
  (radius-x [tevt] (-> tevt single-touch .-radiusX))
  (radius-y [tevt] (-> tevt single-touch .-radiusY))
  (rotation-angle [tevt] (-> tevt single-touch .-rotationAngle))
  (force [tevt] (-> tevt single-touch .-force)))