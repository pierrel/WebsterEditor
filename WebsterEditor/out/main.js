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
return $(".selected").remove();
});
webster.main.edit_element_handler = (function edit_element_handler(data,callback){
var node = $(".selected");
var r = rangy.createRange();
node.attr("contenteditable","true");
r.setStart(node.get(0),0);
r.collapse(true);
return rangy.getSelection().setSingleRange(r);
});
webster.main.container_listener = (function container_listener(event,bridge){
var el = $(event.currentTarget);
if(cljs.core.not.call(null,el.hasClass("selected")))
{var pos = el.offset();
var width = el.width();
var height = el.height();
el.addClass("selected");
bridge.callHandler("containerSelectedHandler",{"top":pos.top,"left":pos.left,"width":width,"height":height,"tag":el.prop("tagName"),"classes":el.attr("class").split(" ")});
event.stopPropagation();
return event.preventDefault();
} else
{return null;
}
});
webster.main.default_listener = (function default_listener(event,bridge){
$(".selected").removeClass("selected");
$("[contenteditable=true]").removeAttr("contenteditable");
return bridge.callHandler("defaultSelectedHandler",{});
});
document.addEventListener("WebViewJavascriptBridgeReady",webster.main.on_bridge_ready,false);
