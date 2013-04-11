(defproject webster "1"
  :description "in-browser code for the webster html editor"
  :dependencies [[org.clojure/clojure "1.4.0"]
                 [domina "1.0.2-SNAPSHOT"]]
  :plugins [[lein-cljsbuild "0.3.0"]]
  :cljsbuild {:builds [{:source-paths ["src/cljs"]
                        :compiler {:output-to "src/js/development.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]})