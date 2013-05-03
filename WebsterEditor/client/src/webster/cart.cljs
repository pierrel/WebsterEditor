(ns webster.cart)

(def sqrt (.-sqrt js/Math))
(def expt (.-pow js/Math))

(defn square [n]
  (expt n 2))

(defn point-left-of?
  "Returns true when p1 is just left of p2"
  [p1 p2]
  (and (> (:top p1) (:top p2))
       (< (:top p1) (+ (:top p2) (:height p2)))
       (< (:left p1) (:left p2))))

(defn point-above?
  "return true when p1 is just above p2"
  [p1 p2]
  (and (> (:left p1) (:left p2))
       (< (:left p1) (+ (:left p2) (:width p2)))
       (< (:top p1) (:top p2))))

(defn point-in-frame? [point frame]
  (and
   (> (:left point) (:left frame))
   (> (:top point) (:top frame))
   (< (:left point) (+ (:left frame) (:width frame)))
   (< (:top point) (+ (:top frame) (:height frame)))))

(defn distance [p1 p2]
  (sqrt (+ (square (- (:left p2) (:left p1)))
           (square (- (:top p2) (:top p1))))))