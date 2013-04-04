goog.provide('webster.html');
goog.require('cljs.core');
goog.require('clojure.string');
webster.html.attrs_to_str = (function attrs_to_str(attrs){
return clojure.string.join.call(null," ",cljs.core.map.call(null,(function (p1__2594_SHARP_){
return cljs.core.format.call(null,"%s=\"%s\"",cljs.core.name.call(null,cljs.core.first.call(null,p1__2594_SHARP_)),cljs.core.second.call(null,p1__2594_SHARP_));
}),attrs));
});
/**
* @param {...*} var_args
*/
webster.html.normalize = (function() {
var normalize = null;
var normalize__1 = (function (tag){
return cljs.core.PersistentVector.fromArray([tag,cljs.core.ObjMap.EMPTY,null], true);
});
var normalize__2 = (function (tag,something){
if(cljs.core.map_QMARK_.call(null,something))
{return cljs.core.PersistentVector.fromArray([tag,something,null], true);
} else
{return cljs.core.PersistentVector.fromArray([tag,cljs.core.ObjMap.EMPTY,cljs.core.list.call(null,something)], true);
}
});
var normalize__3 = (function() { 
var G__2595__delegate = function (tag,attrs,contents){
if(cljs.core.map_QMARK_.call(null,attrs))
{return cljs.core.PersistentVector.fromArray([tag,attrs,contents], true);
} else
{return cljs.core.PersistentVector.fromArray([tag,cljs.core.ObjMap.EMPTY,cljs.core.reduce.call(null,cljs.core.conj,cljs.core.PersistentVector.fromArray([attrs], true),contents)], true);
}
};
var G__2595 = function (tag,attrs,var_args){
var contents = null;
if (arguments.length > 2) {
  contents = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__2595__delegate.call(this, tag, attrs, contents);
};
G__2595.cljs$lang$maxFixedArity = 2;
G__2595.cljs$lang$applyTo = (function (arglist__2596){
var tag = cljs.core.first(arglist__2596);
var attrs = cljs.core.first(cljs.core.next(arglist__2596));
var contents = cljs.core.rest(cljs.core.next(arglist__2596));
return G__2595__delegate(tag, attrs, contents);
});
G__2595.cljs$core$IFn$_invoke$arity$variadic = G__2595__delegate;
return G__2595;
})()
;
normalize = function(tag,attrs,var_args){
var contents = var_args;
switch(arguments.length){
case 1:
return normalize__1.call(this,tag);
case 2:
return normalize__2.call(this,tag,attrs);
default:
return normalize__3.cljs$core$IFn$_invoke$arity$variadic(tag,attrs, cljs.core.array_seq(arguments, 2));
}
throw(new Error('Invalid arity: ' + arguments.length));
};
normalize.cljs$lang$maxFixedArity = 2;
normalize.cljs$lang$applyTo = normalize__3.cljs$lang$applyTo;
normalize.cljs$core$IFn$_invoke$arity$1 = normalize__1;
normalize.cljs$core$IFn$_invoke$arity$2 = normalize__2;
normalize.cljs$core$IFn$_invoke$arity$variadic = normalize__3.cljs$core$IFn$_invoke$arity$variadic;
return normalize;
})()
;
webster.html.compile_form = (function compile_form(form){
if(cljs.core.string_QMARK_.call(null,form))
{return form;
} else
{if(cljs.core.empty_QMARK_.call(null,form))
{return "";
} else
{if("\uFDD0:else")
{var vec__2598 = cljs.core.apply.call(null,webster.html.normalize,form);
var tag = cljs.core.nth.call(null,vec__2598,0,null);
var attrs = cljs.core.nth.call(null,vec__2598,1,null);
var other_forms = cljs.core.nth.call(null,vec__2598,2,null);
return cljs.core.format.call(null,"<%s%s%s>%s</%s>",cljs.core.name.call(null,tag),((cljs.core.empty_QMARK_.call(null,attrs))?"":" "),webster.html.attrs_to_str.call(null,attrs),cljs.core.apply.call(null,webster.html.compile,other_forms),cljs.core.name.call(null,tag));
} else
{return null;
}
}
}
});
/**
* @param {...*} var_args
*/
webster.html.compile = (function() { 
var compile__delegate = function (forms){
return cljs.core.apply.call(null,cljs.core.str,cljs.core.map.call(null,webster.html.compile_form,forms));
};
var compile = function (var_args){
var forms = null;
if (arguments.length > 0) {
  forms = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return compile__delegate.call(this, forms);
};
compile.cljs$lang$maxFixedArity = 0;
compile.cljs$lang$applyTo = (function (arglist__2599){
var forms = cljs.core.seq(arglist__2599);;
return compile__delegate(forms);
});
compile.cljs$core$IFn$_invoke$arity$variadic = compile__delegate;
return compile;
})()
;
