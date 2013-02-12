goog.provide('webster.listeners');
goog.require('cljs.core');
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
webster.listeners.select_node = (function select_node(jnode,bridge){
var pos = jnode.offset();
var width = jnode.width();
var height = jnode.height();
var obj = {"top":pos.top,"left":pos.left,"width":width,"height":height,"tag":jnode.prop("tagName"),"classes":jnode.attr("class").split(" ")};
webster.listeners.make_selected.call(null,jnode);
return bridge.callHandler("containerSelectedHandler",obj);
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
