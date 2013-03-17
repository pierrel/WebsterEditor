goog.provide('webster.listeners');
goog.require('cljs.core');
goog.require('webster.html');
goog.require('webster.dom');
webster.listeners.selected_listener = (function selected_listener(event,bridge){
if(cljs.core._EQ_.call(null,event.target,event.currentTarget))
{return event.stopPropagation();
} else
{return null;
}
});
webster.listeners.default_listener = (function default_listener(event,bridge){
webster.listeners.make_unselected.call(null,$(".selected"));
$("[contenteditable=true]").removeAttr("contenteditable");
return bridge.callHandler("defaultSelectedHandler",{});
});
webster.listeners.container_listener = (function container_listener(event,bridge){
var el = $(event.currentTarget);
if(cljs.core.truth_((function (){var and__3822__auto__ = cljs.core.not.call(null,el.hasClass("selected"));
if(and__3822__auto__)
{return webster.listeners.nothing_selected.call(null);
} else
{return and__3822__auto__;
}
})()))
{webster.listeners.select_node.call(null,el,bridge);
event.stopPropagation();
return event.preventDefault();
} else
{return null;
}
});
webster.listeners.thumbnail_listener = (function thumbnail_listener(event,bridge){
var $el = $(event.currentTarget);
return webster.listeners.select_node.call(null,$el,bridge,(function (data,callback){
var full_path = (data["resource-path"]);
var rel_path = cljs.core.second.call(null,cljs.core.re_matches.call(null,/.*Documents\/(.*)/,full_path));
var new_element = webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:a",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:href",rel_path,"\uFDD0:class","thumbnail","\uFDD0:data-toggle","lightbox"], true),cljs.core.PersistentVector.fromArray(["\uFDD0:img",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:src",rel_path], true)], true)], true));
var old_element = $el.find(".empty-decorations");
old_element.remove();
$el.removeClass("empty");
$el.append(new_element);
var $new_element_link_5460 = $el.find("a:last");
($new_element_link_5460[0]).addEventListener("click",(function (event__$1){
event__$1.preventDefault();
return true;
}));
return webster.listeners.add_empty_thumbnail.call(null,$el.closest(".thumbnails"),bridge).click();
}));
});
webster.listeners.add_empty_thumbnail = (function add_empty_thumbnail($gallery,bridge){
var $empty_thumb = $(webster.dom.empty_image_thumbnail.call(null));
$gallery.append($empty_thumb);
$empty_thumb.get(0).addEventListener("click",(function (event){
return webster.listeners.thumbnail_listener.call(null,event,bridge);
}));
return $empty_thumb;
});
/**
* @param {...*} var_args
*/
webster.listeners.select_node = (function() { 
var select_node__delegate = function (jnode,bridge,p__5461){
var vec__5463 = p__5461;
var callback = cljs.core.nth.call(null,vec__5463,0,null);
var row_info = webster.listeners.node_info.call(null,jnode);
webster.listeners.make_selected.call(null,jnode);
return bridge.callHandler("containerSelectedHandler",row_info,(cljs.core.truth_(callback)?callback:null));
};
var select_node = function (jnode,bridge,var_args){
var p__5461 = null;
if (arguments.length > 2) {
  p__5461 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return select_node__delegate.call(this, jnode, bridge, p__5461);
};
select_node.cljs$lang$maxFixedArity = 2;
select_node.cljs$lang$applyTo = (function (arglist__5464){
var jnode = cljs.core.first(arglist__5464);
var bridge = cljs.core.first(cljs.core.next(arglist__5464));
var p__5461 = cljs.core.rest(cljs.core.next(arglist__5464));
return select_node__delegate(jnode, bridge, p__5461);
});
select_node.cljs$core$IFn$_invoke$arity$variadic = select_node__delegate;
return select_node;
})()
;
webster.listeners.node_info = (function node_info(jnode){
var pos = jnode.offset();
var width = jnode.width();
var height = jnode.height();
var the_info = cljs.core.PersistentArrayMap.fromArray(["\uFDD0:top",pos.top,"\uFDD0:left",pos.left,"\uFDD0:width",width,"\uFDD0:height",height,"\uFDD0:tag",jnode.prop("tagName"),"\uFDD0:classes",jnode.attr("class").split(" ")], true);
return cljs.core.clj__GT_js.call(null,(cljs.core.truth_(webster.listeners.is_row_QMARK_.call(null,jnode))?cljs.core.conj.call(null,the_info,cljs.core.PersistentVector.fromArray(["\uFDD0:children",webster.dom.map_nodes.call(null,node_info,jnode.find("> div"))], true)):the_info));
});
webster.listeners.get_selected = (function get_selected(){
return $(".selected");
});
webster.listeners.nothing_selected = (function nothing_selected(){
return cljs.core._EQ_.call(null,$(".selected").length,0);
});
webster.listeners.make_selected = (function make_selected(jnode){
var node = jnode.get(0);
jnode.addClass("selected");
if(cljs.core.truth_(node))
{return node.addEventListener("click",webster.listeners.selected_listener);
} else
{return null;
}
});
webster.listeners.make_unselected = (function make_unselected(jnode){
var node = jnode.get(0);
jnode.removeClass("selected");
if(cljs.core.truth_(node))
{return node.removeEventListener("click",webster.listeners.selected_listener);
} else
{return null;
}
});
webster.listeners.is_selected = (function is_selected(jnode){
return jnode.hasClass("selected");
});
webster.listeners.is_row_QMARK_ = (function is_row_QMARK_(jnode){
return jnode.hasClass("row-fluid");
});
