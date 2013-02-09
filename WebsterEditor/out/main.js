goog.provide('webster.main');
goog.require('cljs.core');
goog.require('webster.dom');
webster.main.on_bridge_ready = (function on_bridge_ready(event){
var bridge = event.bridge;
bridge.init("handler?");
webster.dom.each_node.call(null,document.getElementsByClassName("container-fluid"),(function (node){
return node.addEventListener("click",(function (event__$1){
return webster.main.container_listener.call(null,event__$1,bridge);
}),false);
}));
webster.dom.each_node.call(null,document.getElementsByTagName("h1"),(function (node){
return node.addEventListener("click",(function (event__$1){
return webster.main.container_listener.call(null,event__$1,bridge);
}),false);
}));
document.addEventListener("click",(function (event__$1){
return webster.main.default_listener.call(null,event__$1,bridge);
}),false);
bridge.registerHandler("removeElementHandler",webster.main.remove_element_handler);
return bridge.registerHandler("editElementHandler",webster.main.edit_element_handler);
});
webster.main.remove_element_handler = (function remove_element_handler(data,callback){
var jnode = $(".selected");
webster.main.make_unselected.call(null,jnode);
return jnode.remove();
});
webster.main.edit_element_handler = (function edit_element_handler(data,callback){
var node = $(".selected");
return webster.dom.make_editable.call(null,node,true);
});
webster.main.container_listener = (function container_listener(event,bridge){
var el = $(event.currentTarget);
if(cljs.core.truth_((function (){var and__3822__auto__ = cljs.core.not.call(null,el.hasClass("selected"));
if(and__3822__auto__)
{return webster.main.nothing_selected.call(null);
} else
{return and__3822__auto__;
}
})()))
{var pos = el.offset();
var width = el.width();
var height = el.height();
webster.main.make_selected.call(null,el);
bridge.callHandler("containerSelectedHandler",{"top":pos.top,"left":pos.left,"width":width,"height":height,"tag":el.prop("tagName"),"classes":el.attr("class").split(" ")});
event.stopPropagation();
return event.preventDefault();
} else
{return null;
}
});
webster.main.nothing_selected = (function nothing_selected(){
return cljs.core._EQ_.call(null,$(".selected").length,0);
});
webster.main.make_selected = (function make_selected(jnode){
var node = jnode.get(0);
jnode.addClass("selected");
if(cljs.core.truth_(node))
{return node.addEventListener("click",webster.main.selected_listener);
} else
{return null;
}
});
webster.main.make_unselected = (function make_unselected(jnode){
var node = jnode.get(0);
jnode.removeClass("selected");
if(cljs.core.truth_(node))
{return node.removeEventListener("click",webster.main.selected_listener);
} else
{return null;
}
});
webster.main.is_selected = (function is_selected(jnode){
return jnode.hasClass("selected");
});
webster.main.selected_listener = (function selected_listener(event,bridge){
if(cljs.core._EQ_.call(null,event.target,event.currentTarget))
{return event.stropPropagation();
} else
{return null;
}
});
webster.main.default_listener = (function default_listener(event,bridge){
webster.main.make_unselected.call(null,$(".selected"));
$("[contenteditable=true]").removeAttr("contenteditable");
return bridge.callHandler("defaultSelectedHandler",{});
});
document.addEventListener("WebViewJavascriptBridgeReady",webster.main.on_bridge_ready,false);
