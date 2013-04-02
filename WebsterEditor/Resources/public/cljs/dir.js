goog.provide('webster.dir');
goog.require('cljs.core');
webster.dir.rel_path = (function rel_path(full_path){
return cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*Documents\/projects\/[^\/]*\/(.*)/,full_path));
});
webster.dir.file_name = (function file_name(full_path){
return cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*\/([^\/]+)\..*/,full_path));
});
webster.dir.thumb_to_lightbox_src = (function thumb_to_lightbox_src(thumb_src){
var matches = cljs.core.re_matches.call(null,/(.*)_THUMB(\..*)/,thumb_src);
var filename = cljs.core.nth.call(null,matches,1);
var ext = cljs.core.nth.call(null,matches,2);
return [cljs.core.str(filename),cljs.core.str(ext)].join('');
});
