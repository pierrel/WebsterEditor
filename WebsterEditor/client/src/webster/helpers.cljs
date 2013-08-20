(ns webster.helpers
  (:require [domina :as domina]
            [goog.object :as gobj]
            [goog.events :as events]))

(def builtin-events (set (map keyword (gobj/getValues events/EventType))))