goog.provide('webster.elements');
goog.require('cljs.core');
goog.require('clojure.set');
goog.require('clojure.string');
webster.elements.all = cljs.core.PersistentArrayMap.fromArray(["\uFDD0:editing",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","paragraph","\uFDD0:tag","\uFDD0:p"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","heading","\uFDD0:tag","\uFDD0:h1"], true)], true),"\uFDD0:structural",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","container","\uFDD0:tag","\uFDD0:div","\uFDD0:class","container-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","row","\uFDD0:tag","\uFDD0:div","\uFDD0:class","row-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","column","\uFDD0:tag","\uFDD0:div","\uFDD0:class","span1","\uFDD0:only-under",cljs.core.PersistentHashSet.fromArray(["row",null], true)], true)], true)], true);
webster.elements.all_flat = cljs.core.apply.call(null,cljs.core.concat,cljs.core.map.call(null,(function (p1__12598_SHARP_){
return cljs.core.second.call(null,p1__12598_SHARP_);
}),webster.elements.all));
webster.elements.allowed_QMARK_ = (function allowed_QMARK_(element,parent_element){
if(cljs.core.seq.call(null,(new cljs.core.Keyword("\uFDD0:only-under")).call(null,element)))
{return cljs.core.contains_QMARK_.call(null,(new cljs.core.Keyword("\uFDD0:only-under")).call(null,element),(new cljs.core.Keyword("\uFDD0:name")).call(null,parent_element));
} else
{return true;
}
});
webster.elements.possible_under = (function possible_under(element){
var category_els = webster.elements.all;
var acc = cljs.core.ObjMap.EMPTY;
while(true){
if(cljs.core.seq.call(null,category_els))
{var category = cljs.core.first.call(null,cljs.core.first.call(null,category_els));
var elements = cljs.core.second.call(null,cljs.core.first.call(null,category_els));
{
var G__12602 = cljs.core.next.call(null,category_els);
var G__12603 = cljs.core.assoc.call(null,acc,category,cljs.core.map.call(null,((function (category_els,acc,category,elements){
return (function (p1__12599_SHARP_){
return (new cljs.core.Keyword("\uFDD0:name")).call(null,p1__12599_SHARP_);
});})(category_els,acc,category,elements))
,cljs.core.filter.call(null,((function (category_els,acc,category,elements){
return (function (p1__12600_SHARP_){
return webster.elements.allowed_QMARK_.call(null,p1__12600_SHARP_,element);
});})(category_els,acc,category,elements))
,elements)));
category_els = G__12602;
acc = G__12603;
continue;
}
} else
{return acc;
}
break;
}
});
webster.elements.get_by_name = (function get_by_name(name){
return cljs.core.first.call(null,cljs.core.filter.call(null,(function (p1__12601_SHARP_){
return cljs.core._EQ_.call(null,(new cljs.core.Keyword("\uFDD0:name")).call(null,p1__12601_SHARP_),name);
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
