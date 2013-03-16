goog.provide('webster.main');
goog.require('cljs.core');
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
bridge.registerHandler("addRowUnderSelectedElement",(function (data,callback){
return webster.main.add_row_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("addGalleryUnderSelectedElement",(function (data,callback){
return webster.main.add_gallery_handler.call(null,data,callback,bridge);
}));
bridge.registerHandler("incrementColumn",webster.main.increment_column);
bridge.registerHandler("decrementColumn",webster.main.decrement_column);
bridge.registerHandler("incrementColumnOffset",webster.main.increment_column_offset);
return bridge.registerHandler("decrementColumnOffset",webster.main.decrement_column_offset);
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
var all_jcols_7103 = cljs.core.map.call(null,(function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
}),cljs.core.range.call(null,column_count));
var jcols_after_jcolumn_7104 = cljs.core.map.call(null,((function (all_jcols_7103){
return (function (i){
return webster.dom.get_jnode.call(null,all_columns,i);
});})(all_jcols_7103))
,cljs.core.range.call(null,(index + 1),column_count));
var jcols_to_decrement_7105 = cljs.core.filter.call(null,((function (all_jcols_7103,jcols_after_jcolumn_7104){
return (function (jcol){
return (webster.dom.get_column_span.call(null,jcol) > 1);
});})(all_jcols_7103,jcols_after_jcolumn_7104))
,jcols_after_jcolumn_7104);
var jcols_to_inset_7106 = cljs.core.filter.call(null,((function (all_jcols_7103,jcols_after_jcolumn_7104,jcols_to_decrement_7105){
return (function (jcol){
return (webster.dom.get_column_offset.call(null,jcol) > 0);
});})(all_jcols_7103,jcols_after_jcolumn_7104,jcols_to_decrement_7105))
,jcols_after_jcolumn_7104);
var jcol_to_decrement_7107 = cljs.core.first.call(null,jcols_to_decrement_7105);
var jcol_to_inset_7108 = cljs.core.first.call(null,jcols_to_inset_7106);
var is_full_width_7109 = cljs.core._EQ_.call(null,12,cljs.core.reduce.call(null,cljs.core._PLUS_,cljs.core.map.call(null,webster.dom.get_column_width,all_jcols_7103)));
if(cljs.core.truth_(jcol_to_inset_7108))
{webster.dom.set_column_offset.call(null,jcol_to_inset_7108,(webster.dom.get_column_offset.call(null,jcol_to_inset_7108) - 1));
} else
{if(cljs.core.truth_((function (){var and__3822__auto__ = is_full_width_7109;
if(and__3822__auto__)
{return jcol_to_decrement_7107;
} else
{return and__3822__auto__;
}
})()))
{webster.dom.set_column_span.call(null,jcol_to_decrement_7107,(webster.dom.get_column_span.call(null,jcol_to_decrement_7107) - 1));
} else
{}
}
if(cljs.core.truth_((function (){var or__3824__auto__ = jcol_to_inset_7108;
if(cljs.core.truth_(or__3824__auto__))
{return or__3824__auto__;
} else
{var or__3824__auto____$1 = jcol_to_decrement_7107;
if(cljs.core.truth_(or__3824__auto____$1))
{return or__3824__auto____$1;
} else
{return !(is_full_width_7109);
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
