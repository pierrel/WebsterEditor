goog.provide('webster.dir');
goog.require('cljs.core');
webster.dir.rel_path = (function rel_path(full_path){
return cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*Documents\/projects\/[^\/]*\/(.*)/,full_path));
});
webster.dir.file_name = (function file_name(full_path){
return cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*\/([^\/]+)\..*/,full_path));
});
