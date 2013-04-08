goog.provide('webster.main');
goog.require('cljs.core');
goog.require('clojure.string');
goog.require('webster.elements');
goog.require('webster.dir');
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
webster.dom.each_node.call(null,document.getElementsByTagName("a"),(function (node){
return node.addEventListener("click",(function (event__$1){
event__$1.preventDefault();
return true;
}));
}));
window.onscroll = (function (event__$1){
if(cljs.core.not.call(null,webster.listeners.nothing_selected.call(null)))
{webster.listeners.make_unselected.call(null,webster.listeners.get_selected.call(null));
return bridge.callHandler("defaultSelectedHandler",{});
} else
{return null;
}
});
document.addEventListener("click",(function (event__$1){
return webster.listeners.default_listener.call(null,event__$1,bridge);
}),false);
bridge.registerHandler("removeElementHandler",(function (data,callback){
return webster.main.remove_element_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("editElementHandler",webster.main.edit_element_handler);
bridge.registerHandler("deselectSelectedElement",webster.main.deselect_selected_element);
bridge.registerHandler("addElementUnderSelectedElement",(function (data,callback){
return webster.main.add_element_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("addGalleryUnderSelectedElement",(function (data,callback){
return webster.main.add_gallery_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("incrementColumn",webster.main.increment_column);
bridge.registerHandler("decrementColumn",webster.main.decrement_column);
bridge.registerHandler("incrementColumnOffset",webster.main.increment_column_offset);
bridge.registerHandler("decrementColumnOffset",webster.main.decrement_column_offset);
bridge.registerHandler("setBackgroundImage",(function (data,callback){
return webster.main.set_background_image.call(null,data,callback,bridge);
}));
bridge.registerHandler("removeBackgroundImage",(function (data,callback){
return webster.main.remove_background_image.call(null,data,callback,bridge);
}));
bridge.registerHandler("hasBackgroundImage",webster.main.has_background_image);
bridge.registerHandler("exportMarkup",webster.main.export_markup);
return bridge.registerHandler("selectParentElement",(function (data,callback){
return webster.main.select_parent_element.call(null,data,callback,bridge);
}));
});
webster.main.select_parent_element = (function select_parent_element(data,callback,bridge){
var selected_node = webster.listeners.get_selected.call(null);
var parent_node = selected_node.parent();
if((parent_node.length > 0))
{webster.listeners.make_unselected.call(null,selected_node);
return webster.listeners.select_node.call(null,parent_node,bridge);
} else
{return null;
}
});
webster.main.export_markup = (function export_markup(data,callback){
var $body = $("html").clone();
$body.find("head").remove();
$body.find("iframe").remove();
$body.find("script[src*=rangy]").remove();
$body.find("script[src*=development]").remove();
$body.find(".thumbnails .empty").remove();
$body.find(".selectable").removeClass("selectable");
$body.find(".selectable-thumb").removeClass("selectable-thumb");
$body.find(".selected").removeClass("selected");
$body.find(".empty").removeClass("empty");
var $body_el_7279 = $body.find("body");
var bg_7280 = $body_el_7279.css("background-image");
if(cljs.core.not.call(null,clojure.string.blank_QMARK_.call(null,bg_7280)))
{var main_path_7281 = cljs.core.second.call(null,cljs.core.re_matches.call(null,/url\(.*\/(media\/.*)\)/,bg_7280));
$body.find("body").css("background-image",null);
$body_el_7279.attr("style",cljs.core.format.call(null,"zoom: 1; background-image: url(%s);",main_path_7281));
} else
{}
if(($body.find(".thumbnails").length > 0))
{$body.append(webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:script",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:src","js/bootstrap-lightbox.js"], true)], true)));
} else
{}
return callback.call(null,{"markup":clojure.string.trim.call(null,$body.html())});
});
webster.main.set_background_image = (function set_background_image(data,callback,bridge){
webster.main.remove_background_image.call(null,{},null,bridge);
var $body = $("body");
var full_path = (data["path"]);
var url = [cljs.core.str("url("),cljs.core.str(webster.dir.rel_path.call(null,full_path)),cljs.core.str(")")].join('');
$body.addClass("with-background");
return $body.css("background-image",url);
});
webster.main.remove_background_image = (function remove_background_image(data,callback,bridge){
var $body = $("body");
var url = cljs.core.second.call(null,cljs.core.re_matches.call(null,/url\((.*)\)/,$body.css("background-image")));
if(cljs.core.truth_(url))
{bridge.callHandler("removingMedia",{"media-src":webster.dir.rel_path.call(null,url)});
} else
{}
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
var all_jcols_7282 = cljs.core.map.call(null,(function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
}),cljs.core.range.call(null,column_count));
var jcols_after_jcolumn_7283 = cljs.core.map.call(null,((function (all_jcols_7282){
return (function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
});})(all_jcols_7282))
,cljs.core.range.call(null,(index + 1),column_count));
var jcols_to_decrement_7284 = cljs.core.filter.call(null,((function (all_jcols_7282,jcols_after_jcolumn_7283){
return (function (jcol){
return (webster.dom.get_column_span.call(null,jcol) > 1);
});})(all_jcols_7282,jcols_after_jcolumn_7283))
,jcols_after_jcolumn_7283);
var jcols_to_inset_7285 = cljs.core.filter.call(null,((function (all_jcols_7282,jcols_after_jcolumn_7283,jcols_to_decrement_7284){
return (function (jcol){
return (webster.dom.get_column_offset.call(null,jcol) > 0);
});})(all_jcols_7282,jcols_after_jcolumn_7283,jcols_to_decrement_7284))
,jcols_after_jcolumn_7283);
var jcol_to_decrement_7286 = cljs.core.first.call(null,jcols_to_decrement_7284);
var jcol_to_inset_7287 = cljs.core.first.call(null,jcols_to_inset_7285);
var is_full_width_7288 = cljs.core._EQ_.call(null,12,cljs.core.reduce.call(null,cljs.core._PLUS_,cljs.core.map.call(null,webster.dom.get_column_width,all_jcols_7282)));
if(cljs.core.truth_(jcol_to_inset_7287))
{webster.dom.set_column_offset.call(null,jcol_to_inset_7287,(webster.dom.get_column_offset.call(null,jcol_to_inset_7287) - 1));
} else
{if(cljs.core.truth_((function (){var and__3822__auto__ = is_full_width_7288;
if(and__3822__auto__)
{return jcol_to_decrement_7286;
} else
{return and__3822__auto__;
}
})()))
{webster.dom.set_column_span.call(null,jcol_to_decrement_7286,(webster.dom.get_column_span.call(null,jcol_to_decrement_7286) - 1));
} else
{}
}
if(cljs.core.truth_((function (){var or__3824__auto__ = jcol_to_inset_7287;
if(cljs.core.truth_(or__3824__auto__))
{return or__3824__auto__;
} else
{var or__3824__auto____$1 = jcol_to_decrement_7286;
if(cljs.core.truth_(or__3824__auto____$1))
{return or__3824__auto____$1;
} else
{return !(is_full_width_7288);
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
webster.main.add_element_handler = (function add_element_handler(data,callback,bridge){
var el_name = (data["element-name"]);
var element = webster.elements.get_by_name.call(null,el_name);
var jnode = webster.listeners.get_selected.call(null);
var new_el = webster.dom.new_element_with_info.call(null,element);
var add_listener = ((function (el_name,element,jnode,new_el){
return (function (jel){
return jel.addEventListener("click",((function (el_name,element,jnode,new_el){
return (function (event){
return webster.listeners.container_listener.call(null,event,bridge);
});})(el_name,element,jnode,new_el))
);
});})(el_name,element,jnode,new_el))
;
jnode.append(new_el);
webster.listeners.default_listener.call(null,null,bridge);
new_el.find(".selectable").each((function (i,el){
return add_listener.call(null,el);
}));
add_listener.call(null,new_el.get(0));
return webster.listeners.select_node.call(null,new_el,bridge);
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
