goog.provide('webster.main');
goog.require('cljs.core');
goog.require('webster.listeners');
goog.require('webster.dom');
webster.main.on_bridge_ready = (function on_bridge_ready(event){
var bridge = event.bridge;
bridge.init("handler?");
webster.dom.each_node.call(null,document.getElementsByClassName("container-fluid"),(function (node){
return node.addEventListener("click",(function (event__$1){
return webster.listeners.container_listener.call(null,event__$1,bridge);
}),false);
}));
webster.dom.each_node.call(null,document.getElementsByTagName("h1"),(function (node){
return node.addEventListener("click",(function (event__$1){
return webster.listeners.container_listener.call(null,event__$1,bridge);
}),false);
}));
document.addEventListener("click",(function (event__$1){
return webster.listeners.default_listener.call(null,event__$1,bridge);
}),false);
bridge.registerHandler("removeElementHandler",webster.main.remove_element_handler);
return bridge.registerHandler("editElementHandler",webster.main.edit_element_handler);
});
webster.main.remove_element_handler = (function remove_element_handler(data,callback){
var jnode = $(".selected");
webster.listeners.make_unselected.call(null,jnode);
return jnode.remove();
});
webster.main.edit_element_handler = (function edit_element_handler(data,callback){
var node = $(".selected");
return webster.dom.make_editable.call(null,node,true);
});
document.addEventListener("WebViewJavascriptBridgeReady",webster.main.on_bridge_ready,false);
