goog.provide('webster.dom');
goog.require('cljs.core');
/**
* Calls callback for each DOM node in node-list
*/
webster.dom.each_node = (function each_node(node_list,callback){
var G__2429 = cljs.core.seq.call(null,cljs.core.range.call(null,node_list.length));
while(true){
if(G__2429)
{var index = cljs.core.first.call(null,G__2429);
callback.call(null,node_list.item(index));
{
var G__2430 = cljs.core.next.call(null,G__2429);
G__2429 = G__2430;
continue;
}
} else
{return null;
}
break;
}
});
