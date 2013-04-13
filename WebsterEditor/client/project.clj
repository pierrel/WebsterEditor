(defproject webster "1"
  :description "in-browser code for the webster html editor"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [org.clojure/clojurescript "0.0-1552"]
                 [org.clojure/google-closure-library-third-party "0.0-2029"]
                 [domina "1.0.2-SNAPSHOT"]
                 [compojure "1.1.5"]]
  :plugins [[lein-cljsbuild "0.3.0"]
            [lein-ring "0.8.2"]]
  :ring {:handler repl.handler/app}
  :cljsbuild {:builds [{:source-paths ["src/cljs"]
                        :compiler {:output-to "resources/public/js/development.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]})