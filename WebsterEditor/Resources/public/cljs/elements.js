goog.provide('webster.elements');
goog.require('cljs.core');
webster.elements.all = cljs.core.PersistentArrayMap.fromArray(["\uFDD0:editing",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","paragraph","\uFDD0:tag","\uFDD0:p"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","heading","\uFDD0:tag","\uFDD0:h1"], true)], true),"\uFDD0:structural",cljs.core.PersistentVector.fromArray([cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","container","\uFDD0:tag","\uFDD0:div","\uFDD0:class","container-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","row","\uFDD0:tag","\uFDD0:div","\uFDD0:class","row-fluid"], true),cljs.core.PersistentArrayMap.fromArray(["\uFDD0:name","column","\uFDD0:tag","\uFDD0:div","\uFDD0:class-prefix","span"], true)], true)], true);
webster.elements.possible_under = (function possible_under(node){
var category_els = webster.elements.all;
var acc = cljs.core.ObjMap.EMPTY;
while(true){
if(cljs.core.seq.call(null,category_els))
{{
var G__5084 = cljs.core.next.call(null,category_els);
var G__5085 = cljs.core.assoc.call(null,acc,cljs.core.first.call(null,cljs.core.first.call(null,category_els)),cljs.core.map.call(null,((function (category_els,acc){
return (function (p1__5083_SHARP_){
return (new cljs.core.Keyword("\uFDD0:name")).call(null,p1__5083_SHARP_);
});})(category_els,acc))
,cljs.core.second.call(null,cljs.core.first.call(null,category_els))));
category_els = G__5084;
acc = G__5085;
continue;
}
} else
{return acc;
}
break;
}
});
