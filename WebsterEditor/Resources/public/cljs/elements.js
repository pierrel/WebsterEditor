goog.provide('webster.elements');
goog.require('cljs.core');
webster.elements.all = cljs.core.PersistentArrayMap.fromArray(["\uFDD0:editing",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","paragraph","\uFDD0:tag","\uFDD0:p"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","heading","\uFDD0:tag","\uFDD0:h1"], true)], true),"\uFDD0:structural",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","container","\uFDD0:tag","\uFDD0:div","\uFDD0:class","container-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","row","\uFDD0:tag","\uFDD0:div","\uFDD0:class","row-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","column","\uFDD0:tag","\uFDD0:div","\uFDD0:class","span1"], true)], true)], true);
webster.elements.all_flat = cljs.core.apply.call(null,cljs.core.concat,cljs.core.map.call(null,(function (p1__7171_SHARP_){
return cljs.core.second.call(null,p1__7171_SHARP_);
}),webster.elements.all));
webster.elements.possible_under = (function possible_under(node){
var category_els = webster.elements.all;
var acc = cljs.core.ObjMap.EMPTY;
while(true){
if(cljs.core.seq.call(null,category_els))
{{
var G__7174 = cljs.core.next.call(null,category_els);
var G__7175 = cljs.core.assoc.call(null,acc,cljs.core.first.call(null,cljs.core.first.call(null,category_els)),cljs.core.map.call(null,((function (category_els,acc){
return (function (p1__7172_SHARP_){
return (new cljs.core.Keyword("\uFDD0:name")).call(null,p1__7172_SHARP_);
});})(category_els,acc))
,cljs.core.second.call(null,cljs.core.first.call(null,category_els))));
category_els = G__7174;
acc = G__7175;
continue;
}
} else
{return acc;
}
break;
}
});
webster.elements.get_by_name = (function get_by_name(name){
return cljs.core.first.call(null,cljs.core.filter.call(null,(function (p1__7173_SHARP_){
return cljs.core._EQ_.call(null,(new cljs.core.Keyword("\uFDD0:name")).call(null,p1__7173_SHARP_),name);
}),webster.elements.all_flat));
});
