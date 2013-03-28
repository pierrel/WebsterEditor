goog.provide('webster.main');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('webster.html');
goog.require('webster.listeners');
goog.require('webster.dom');
webster.main.on_bridge_ready = (function on_bridge_ready(event){
var bridge = event.bridge;
bridge.init("handler?");
webster.dom.each_node.call(null,document.getElementsByClassName("selectable"),(function (node){
return node.addEventListener("click",(function (event__$1){
return webster.listeners.container_listener.call(null,event__$1,bridge);
}),false);
}));
document.addEventListener("click",(function (event__$1){
return webster.listeners.default_listener.call(null,event__$1,bridge);
}),false);
bridge.registerHandler("removeElementHandler",(function (data,callback){
return webster.main.remove_element_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("editElementHandler",webster.main.edit_element_handler);
bridge.registerHandler("deselectSelectedElement",webster.main.deselect_selected_element);
bridge.registerHandler("addRowUnderSelectedElement",(function (data,callback){
return webster.main.add_row_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("addGalleryUnderSelectedElement",(function (data,callback){
return webster.main.add_gallery_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("incrementColumn",webster.main.increment_column);
bridge.registerHandler("decrementColumn",webster.main.decrement_column);
bridge.registerHandler("incrementColumnOffset",webster.main.increment_column_offset);
bridge.registerHandler("decrementColumnOffset",webster.main.decrement_column_offset);
bridge.registerHandler("setBackgroundImage",webster.main.set_background_image);
bridge.registerHandler("removeBackgroundImage",webster.main.remove_background_image);
bridge.registerHandler("hasBackgroundImage",webster.main.has_background_image);
return bridge.registerHandler("exportMarkup",webster.main.export_markup);
});
webster.main.export_markup = (function export_markup(data,callback){
var $body = $("html").clone();
$body.find("head").remove();
$body.find("iframe").remove();
$body.find("script[src*=rangy]").remove();
$body.find("script[src*=development]").remove();
$body.find(".thumbnails .empty").remove();
$body.find(".selectable").removeClass("selectable");
$body.find(".selected").removeClass("selected");
$body.find(".empty").removeClass("empty");
var $body_el_15368 = $body.find("body");
var bg_15369 = $body_el_15368.css("background-image");
if(cljs.core.not.call(null,clojure.string.blank_QMARK_.call(null,bg_15369)))
{var main_path_15370 = cljs.core.second.call(null,cljs.core.re_matches.call(null,/url\(.*\/(media\/.*)\)/,bg_15369));
$body.find("body").css("background-image",null);
$body_el_15368.attr("style",cljs.core.format.call(null,"zoom: 1; background-image: url(%s);",main_path_15370));
} else
{}
if(($body.find(".thumbnails").length > 0))
{$body.append(webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:script",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:src","js/bootstrap-lightbox.js"], true)], true)));
} else
{}
return callback.call(null,{"markup":clojure.string.trim.call(null,$body.html())});
});
webster.main.set_background_image = (function set_background_image(data){
var $body = $("body");
var full_path = (data["path"]);
var url = [cljs.core.str("url("),cljs.core.str(cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*Documents\/(.*)/,full_path))),cljs.core.str(")")].join('');
$body.addClass("with-background");
return $body.css("background-image",url);
});
webster.main.remove_background_image = (function remove_background_image(data,callback){
var $body = $("body");
$body.removeClass("with-background");
$body.css("background-image","none");
if(cljs.core.truth_(callback))
{return callback.call(null,{});
} else
{return null;
}
});
webster.main.has_background_image = (function has_background_image(data,callback){
return callback.call(null,{"hasBackground":(cljs.core.truth_($("body").hasClass("with-background"))?"true":"false")});
});
webster.main.increment_column_offset = (function increment_column_offset(data,callback){
var jselected = webster.listeners.get_selected.call(null);
var index = parseInt((data["index"]));
var all_columns = jselected.find("> div");
var jcolumn = webster.dom.get_jnode.call(null,all_columns,index);
if((webster.dom.get_column_span.call(null,jcolumn) > 1))
{webster.dom.decrement_column_span.call(null,jcolumn);
webster.dom.increment_column_offset.call(null,jcolumn);
} else
{}
return callback.call(null,webster.listeners.node_info.call(null,jselected));
});
webster.main.decrement_column = (function decrement_column(data,callback){
var jselected = webster.listeners.get_selected.call(null);
var index = parseInt((data["index"]));
var all_columns = jselected.find("> div");
var jcolumn = webster.dom.get_jnode.call(null,all_columns,index);
if((webster.dom.get_column_span.call(null,jcolumn) > 1))
{webster.dom.decrement_column_span.call(null,jcolumn);
} else
{}
return callback.call(null,webster.listeners.node_info.call(null,jselected));
});
webster.main.decrement_column_offset = (function decrement_column_offset(data,callback){
var jselected = webster.listeners.get_selected.call(null);
var index = parseInt((data["index"]),10);
var all_columns = jselected.find("> div");
var column_count = all_columns.length;
var jcolumn = webster.dom.get_jnode.call(null,all_columns,index);
var offset_num = webster.dom.get_column_offset.call(null,jcolumn);
if((offset_num > 0))
{console.log(offset_num);
webster.dom.set_column_offset.call(null,jcolumn,(offset_num - 1));
webster.dom.set_column_span.call(null,jcolumn,(webster.dom.get_column_span.call(null,jcolumn) + 1));
} else
{}
return callback.call(null,webster.listeners.node_info.call(null,jselected));
});
webster.main.increment_column = (function increment_column(data,callback){
var jselected = webster.listeners.get_selected.call(null);
var index = parseInt((data["index"]),10);
var all_columns = jselected.find("> div");
var column_count = all_columns.length;
var jcolumn = webster.dom.get_jnode.call(null,all_columns,index);
var span_num = webster.dom.get_column_span.call(null,jcolumn);
var all_jcols_15371 = cljs.core.map.call(null,(function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
}),cljs.core.range.call(null,column_count));
var jcols_after_jcolumn_15372 = cljs.core.map.call(null,((function (all_jcols_15371){
return (function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
});})(all_jcols_15371))
,cljs.core.range.call(null,(index + 1),column_count));
var jcols_to_decrement_15373 = cljs.core.filter.call(null,((function (all_jcols_15371,jcols_after_jcolumn_15372){
return (function (jcol){
return (webster.dom.get_column_span.call(null,jcol) > 1);
});})(all_jcols_15371,jcols_after_jcolumn_15372))
,jcols_after_jcolumn_15372);
var jcols_to_inset_15374 = cljs.core.filter.call(null,((function (all_jcols_15371,jcols_after_jcolumn_15372,jcols_to_decrement_15373){
return (function (jcol){
return (webster.dom.get_column_offset.call(null,jcol) > 0);
});})(all_jcols_15371,jcols_after_jcolumn_15372,jcols_to_decrement_15373))
,jcols_after_jcolumn_15372);
var jcol_to_decrement_15375 = cljs.core.first.call(null,jcols_to_decrement_15373);
var jcol_to_inset_15376 = cljs.core.first.call(null,jcols_to_inset_15374);
var is_full_width_15377 = cljs.core._EQ_.call(null,12,cljs.core.reduce.call(null,cljs.core._PLUS_,cljs.core.map.call(null,webster.dom.get_column_width,all_jcols_15371)));
if(cljs.core.truth_(jcol_to_inset_15376))
{webster.dom.set_column_offset.call(null,jcol_to_inset_15376,(webster.dom.get_column_offset.call(null,jcol_to_inset_15376) - 1));
} else
{if(cljs.core.truth_((function (){var and__3822__auto__ = is_full_width_15377;
if(and__3822__auto__)
{return jcol_to_decrement_15375;
} else
{return and__3822__auto__;
}
})()))
{webster.dom.set_column_span.call(null,jcol_to_decrement_15375,(webster.dom.get_column_span.call(null,jcol_to_decrement_15375) - 1));
} else
{}
}
if(cljs.core.truth_((function (){var or__3824__auto__ = jcol_to_inset_15376;
if(cljs.core.truth_(or__3824__auto__))
{return or__3824__auto__;
} else
{var or__3824__auto____$1 = jcol_to_decrement_15375;
if(cljs.core.truth_(or__3824__auto____$1))
{return or__3824__auto____$1;
} else
{return !(is_full_width_15377);
}
}
})()))
{webster.dom.set_column_span.call(null,jcolumn,(1 + span_num));
} else
{}
return callback.call(null,webster.listeners.node_info.call(null,jselected));
});
webster.main.remove_element_handler = (function() {
var remove_element_handler = null;
var remove_element_handler__2 = (function (data,callback){
alert("removing");
var jnode = $(".selected");
webster.listeners.make_unselected.call(null,jnode);
return jnode.remove();
});
var remove_element_handler__3 = (function (data,callback,bridge){
remove_element_handler.call(null,data,callback);
return webster.listeners.default_listener.call(null,null,bridge);
});
remove_element_handler = function(data,callback,bridge){
switch(arguments.length){
case 2:
return remove_element_handler__2.call(this,data,callback);
case 3:
return remove_element_handler__3.call(this,data,callback,bridge);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
remove_element_handler.cljs$core$IFn$_invoke$arity$2 = remove_element_handler__2;
remove_element_handler.cljs$core$IFn$_invoke$arity$3 = remove_element_handler__3;
return remove_element_handler;
})()
;
webster.main.edit_element_handler = (function edit_element_handler(data,callback){
var node = $(".selected");
return webster.dom.make_editable.call(null,node,true);
});
webster.main.deselect_selected_element = (function deselect_selected_element(data){
var $selected = webster.listeners.get_selected.call(null);
if(cljs.core.truth_($selected))
{return webster.listeners.make_unselected.call(null,$selected);
} else
{return null;
}
});
webster.main.add_row_handler = (function add_row_handler(data,callback,bridge){
var jnode = webster.listeners.get_selected.call(null);
var new_row = webster.dom.new_row.call(null);
jnode.append(new_row);
webster.listeners.default_listener.call(null,null,bridge);
new_row.get(0).addEventListener("click",(function (event){
return webster.listeners.container_listener.call(null,event,bridge);
}));
return webster.listeners.select_node.call(null,new_row,bridge);
});
webster.main.add_gallery_handler = (function add_gallery_handler(data,callback,bridge){
var jnode = webster.listeners.get_selected.call(null);
var new_row = webster.dom.new_image_gallery.call(null);
var gallery = new_row.find(".thumbnails");
jnode.append(new_row);
webster.listeners.default_listener.call(null,null,bridge);
new_row.get(0).addEventListener("click",(function (event){
return webster.listeners.container_listener.call(null,event,bridge);
}));
return webster.listeners.add_empty_thumbnail.call(null,gallery,bridge).click();
});
document.addEventListener("WebViewJavascriptBridgeReady",webster.main.on_bridge_ready,false);
