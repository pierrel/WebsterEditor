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
/**
* @param {...*} var_args
*/
webster.dom.make_editable = (function() { 
var make_editable__delegate = function (node,focus){
node.attr("contenteditable","true");
if(cljs.core.truth_(focus))
{var r = rangy.createRange();
r.setStart(node.get(0),0);
r.collapse(true);
return rangy.getSelection().setSingleRange(r);
} else
{return null;
}
};
var make_editable = function (node,var_args){
var focus = null;
if (goog.isDef(var_args)) {
  focus = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return make_editable__delegate.call(this, node, focus);
};
make_editable.cljs$lang$maxFixedArity = 1;
make_editable.cljs$lang$applyTo = (function (arglist__2431){
var node = cljs.core.first(arglist__2431);
var focus = cljs.core.rest(arglist__2431);
return make_editable__delegate(node, focus);
});
make_editable.cljs$lang$arity$variadic = make_editable__delegate;
return make_editable;
})()
;
webster.dom.new_row = (function new_row(){
return $("<div class=\"row selectable\"></div>");
});
