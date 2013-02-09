goog.provide('webster.main');
goog.require('cljs.core');
goog.require('webster.listeners');
goog.require('webster.dom');
webster.main.container_classes = cljs.core.PersistentVector.fromArray(["container-fluid","row"], true);
webster.main.container_tags = cljs.core.PersistentVector.fromArray(["h1"], true);
webster.main.on_bridge_ready = (function on_bridge_ready(event){
var bridge = event.bridge;
bridge.init("handler?");
var G__2430_2432 = cljs.core.seq.call(null,webster.main.container_classes);
while(true){
if(G__2430_2432)
{var class_2433 = cljs.core.first.call(null,G__2430_2432);
webster.dom.each_node.call(null,document.getElementsByClassName(class_2433),((function (G__2430_2432,class_2433){
return (function (node){
return node.addEventListener("click",((function (G__2430_2432,class_2433){
return (function (event__$1){
return webster.listeners.container_listener.call(null,event__$1,bridge);
});})(G__2430_2432,class_2433))
,false);
});})(G__2430_2432,class_2433))
);
{
var G__2434 = cljs.core.next.call(null,G__2430_2432);
G__2430_2432 = G__2434;
continue;
}
} else
{}
break;
}
var G__2431_2435 = cljs.core.seq.call(null,webster.main.container_tags);
while(true){
if(G__2431_2435)
{var tag_2436 = cljs.core.first.call(null,G__2431_2435);
webster.dom.each_node.call(null,document.getElementsByTagName(tag_2436),((function (G__2431_2435,tag_2436){
return (function (node){
return node.addEventListener("click",((function (G__2431_2435,tag_2436){
return (function (event__$1){
return webster.listeners.container_listener.call(null,event__$1,bridge);
});})(G__2431_2435,tag_2436))
,false);
});})(G__2431_2435,tag_2436))
);
{
var G__2437 = cljs.core.next.call(null,G__2431_2435);
G__2431_2435 = G__2437;
continue;
}
} else
{}
break;
}
document.addEventListener("click",(function (event__$1){
return webster.listeners.default_listener.call(null,event__$1,bridge);
}),false);
bridge.registerHandler("removeElementHandler",webster.main.remove_element_handler);
bridge.registerHandler("editElementHandler",webster.main.edit_element_handler);
return bridge.registerHandler("addRowUnderSelectedElement",(function (data,callback){
return webster.main.add_row_handler.call(null,data,callback,bridge);
}));
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
webster.main.add_row_handler = (function add_row_handler(data,callback,bridge){
var jnode = webster.listeners.get_selected.call(null);
var new_row = webster.dom.new_row.call(null);
jnode.append(new_row);
webster.listeners.default_listener.call(null,null,bridge);
return new_row.get(0).addEventListener("click",(function (event){
return bridge;
}));
});
document.addEventListener("WebViewJavascriptBridgeReady",webster.main.on_bridge_ready,false);
