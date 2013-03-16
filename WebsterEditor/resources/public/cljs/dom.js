goog.provide('webster.dom');
goog.require('cljs.core');
goog.require('webster.html');
/**
* Calls callback for each DOM node in node-list
*/
webster.dom.each_node = (function each_node(node_list,callback){
var G__2792 = cljs.core.seq.call(null,cljs.core.range.call(null,node_list.length));
while(true){
if(G__2792)
{var index = cljs.core.first.call(null,G__2792);
callback.call(null,node_list.item(index));
{
var G__2793 = cljs.core.next.call(null,G__2792);
G__2792 = G__2793;
continue;
}
} else
{return null;
}
break;
}
});
webster.dom.map_nodes = (function map_nodes(callback,node_list){
return cljs.core.map.call(null,(function (index){
return callback.call(null,$(node_list.get(index)));
}),cljs.core.range.call(null,node_list.length));
});
/**
* grabs the node at index in jnodes and returns the corresponding jnode
*/
webster.dom.get_jnode = (function get_jnode(jnodes,index){
return $(jnodes.get(index));
});
webster.dom.get_column_span = (function get_column_span(jnode){
var matches = cljs.core.re_find.call(null,/span(\d+)/,jnode.attr("class"));
if((cljs.core.count.call(null,matches) > 1))
{return parseInt(cljs.core.second.call(null,matches),10);
} else
{return 0;
}
});
webster.dom.set_column_span = (function set_column_span(jnode,count){
var old_count = webster.dom.get_column_span.call(null,jnode);
jnode.removeClass([cljs.core.str("span"),cljs.core.str(old_count)].join(''));
return jnode.addClass([cljs.core.str("span"),cljs.core.str(count)].join(''));
});
webster.dom.increment_column_span = (function increment_column_span(jnode){
return webster.dom.set_column_span.call(null,jnode,(webster.dom.get_column_span.call(null,jnode) + 1));
});
webster.dom.decrement_column_span = (function decrement_column_span(jnode){
return webster.dom.set_column_span.call(null,jnode,(webster.dom.get_column_span.call(null,jnode) - 1));
});
webster.dom.get_column_offset = (function get_column_offset(jnode){
var matches = cljs.core.re_find.call(null,/offset(\d+)/,jnode.attr("class"));
if((cljs.core.count.call(null,matches) > 1))
{return parseInt(cljs.core.second.call(null,matches),10);
} else
{return 0;
}
});
webster.dom.set_column_offset = (function set_column_offset(jnode,count){
var old_count = webster.dom.get_column_offset.call(null,jnode);
jnode.removeClass([cljs.core.str("offset"),cljs.core.str(old_count)].join(''));
return jnode.addClass([cljs.core.str("offset"),cljs.core.str(count)].join(''));
});
webster.dom.increment_column_offset = (function increment_column_offset(jnode){
return webster.dom.set_column_offset.call(null,jnode,(webster.dom.get_column_offset.call(null,jnode) + 1));
});
webster.dom.decrement_column_offset = (function decrement_column_offset(jnode){
return webster.dom.set_column_offset.call(null,jnode,(webster.dom.get_column_offset.call(null,jnode) - 1));
});
webster.dom.get_column_width = (function get_column_width(jnode){
return (webster.dom.get_column_span.call(null,jnode) + webster.dom.get_column_offset.call(null,jnode));
});
webster.dom.column_max = 12;
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
if (arguments.length > 1) {
  focus = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return make_editable__delegate.call(this, node, focus);
};
make_editable.cljs$lang$maxFixedArity = 1;
make_editable.cljs$lang$applyTo = (function (arglist__2794){
var node = cljs.core.first(arglist__2794);
var focus = cljs.core.rest(arglist__2794);
return make_editable__delegate(node, focus);
});
make_editable.cljs$core$IFn$_invoke$arity$variadic = make_editable__delegate;
return make_editable;
})()
;
webster.dom.new_row = (function new_row(){
return $(webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:div",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","row-fluid selectable"], true),cljs.core.PersistentVector.fromArray(["\uFDD0:div",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","span4 empty"], true)], true),cljs.core.PersistentVector.fromArray(["\uFDD0:div",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","span8 empty"], true)], true)], true)));
});
webster.dom.new_image_gallery = (function new_image_gallery(){
return $(webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:div",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","row-fluid selectable"], true),cljs.core.PersistentVector.fromArray(["\uFDD0:ul",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","thumbnails","\uFDD0:data-span","3"], true)], true)], true)));
});
webster.dom.empty_image_thumbnail = (function empty_image_thumbnail(span){
return webster.html.compile.call(null,cljs.core.PersistentVector.fromArray(["\uFDD0:li",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class",cljs.core.format.call(null,"span%s empty image-thumb",(function (){var or__3824__auto__ = span;
if(cljs.core.truth_(or__3824__auto__))
{return or__3824__auto__;
} else
{return 3;
}
})())], true),cljs.core.PersistentVector.fromArray(["\uFDD0:div",cljs.core.PersistentArrayMap.fromArray(["\uFDD0:class","empty-decorations"], true),"Add Image"], true)], true));
});
