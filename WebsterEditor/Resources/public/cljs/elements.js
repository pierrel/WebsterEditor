goog.provide('webster.elements');
goog.require('cljs.core');
goog.require('clojure.set');
goog.require('clojure.string');
webster.elements.all = cljs.core.PersistentArrayMap.fromArray(["\uFDD0:text",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","paragraph","\uFDD0:tag","\uFDD0:p","\uFDD0:class","text-editable"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","heading","\uFDD0:tag","\uFDD0:h1","\uFDD0:class","text-editable"], true)], true),"\uFDD0:structure",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","container","\uFDD0:tag","\uFDD0:div","\uFDD0:class","container-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","row","\uFDD0:tag","\uFDD0:div","\uFDD0:class","row-fluid","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["container",null], true)], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","column","\uFDD0:tag","\uFDD0:div","\uFDD0:class","span1","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["row",null], true)], true)], true),"\uFDD0:components",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","gallery","\uFDD0:tag","\uFDD0:ul","\uFDD0:class","thumbnails","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["row",null], true)], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","gallery image","\uFDD0:tag","\uFDD0:li","\uFDD0:class","span4 empty image-thumb","\uFDD0:contains","empty gallery image","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["gallery",null], true)], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","empty gallery image","\uFDD0:tag","\uFDD0:div","\uFDD0:class","empty-decorations","\uFDD0:contains-text","Add Image","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["gallery image",null], true)], true)], true)], true);
webster.elements.all_flat = cljs.core.apply.call(null,cljs.core.concat,cljs.core.map.call(null,(function (p1__6069_SHARP_){
return cljs.core.second.call(null,p1__6069_SHARP_);
}),webster.elements.all));
webster.elements.allowed_QMARK_ = (function allowed_QMARK_(element,parent_element){
if(cljs.core.contains_QMARK_.call(null,cljs.core.set.call(null,(new cljs.core.Keyword("\uFDD0:editing")).call(null,webster.elements.all)),parent_element))
{return false;
} else
{if(cljs.core.seq.call(null,(new cljs.core.Keyword("\uFDD0:only-under")).call(null,element)))
{return cljs.core.contains_QMARK_.call(null,(new cljs.core.Keyword("\uFDD0:only-under")).call(null,element),(new cljs.core.Keyword("\uFDD0:name")).call(null,parent_element));
} else
{if("\uFDD0:else")
{return true;
} else
{return null;
}
}
}
});
webster.elements.possible_under = (function possible_under(element){
var category_els = webster.elements.all;
var acc = cljs.core.ObjMap.EMPTY;
while(true){
if(cljs.core.seq.call(null,category_els))
{var category = cljs.core.first.call(null,cljs.core.first.call(null,category_els));
var elements = cljs.core.second.call(null,cljs.core.first.call(null,category_els));
var allowed_elements = cljs.core.map.call(null,((function (category_els,acc,category,elements){
return (function (p1__6070_SHARP_){
return (new cljs.core.Keyword("\uFDD0:name")).call(null,p1__6070_SHARP_);
});})(category_els,acc,category,elements))
,cljs.core.filter.call(null,((function (category_els,acc,category,elements){
return (function (p1__6071_SHARP_){
return webster.elements.allowed_QMARK_.call(null,p1__6071_SHARP_,element);
});})(category_els,acc,category,elements))
,elements));
{
var G__6073 = cljs.core.next.call(null,category_els);
var G__6074 = ((cljs.core.seq.call(null,allowed_elements))?cljs.core.assoc.call(null,acc,category,allowed_elements):acc);
category_els = G__6073;
acc = G__6074;
continue;
}
} else
{return acc;
}
break;
}
});
webster.elements.get_by_name = (function get_by_name(name){
return cljs.core.first.call(null,cljs.core.filter.call(null,(function (p1__6072_SHARP_){
return cljs.core._EQ_.call(null,(new cljs.core.Keyword("\uFDD0:name")).call(null,p1__6072_SHARP_),name);
}),webster.elements.all_flat));
});
webster.elements.node_to_element = (function node_to_element(node){
var type = node.attr("data-type");
if(cljs.core.seq.call(null,type))
{return webster.elements.get_by_name.call(null,type);
} else
{return null;
}
});
