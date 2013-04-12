(ns test.handler
  (:use compojure.core
        [cljs.repl :only (repl)]
        [cljs.repl.browser :only (repl-env)])
  (:require [compojure.handler :as handler]
            [compojure.route :as route]
            [cljs.repl :as repl]))

(defroutes app-routes
  (GET "/" [] "Hello World")
  (route/resources "/")
  (route/not-found "Not Found"))

(def app
  (handler/site app-routes))