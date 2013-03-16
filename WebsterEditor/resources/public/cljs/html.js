goog.provide('webster.html');
goog.require('cljs.core');
goog.require('clojure.string');
webster.html.sym_to_str = (function sym_to_str(sym){
return clojure.string.replace.call(null,[cljs.core.str(sym)].join(''),":","");
});
webster.html.attrs_to_str = (function attrs_to_str(attrs){
return clojure.string.join.call(null," ",cljs.core.map.call(null,(function (key){
var skey = webster.html.sym_to_str.call(null,key);
return cljs.core.format.call(null,"%s=\"%s\"",skey,attrs.call(null,key));
}),cljs.core.keys.call(null,attrs)));
});
webster.html.compile_form = (function compile_form(args){
if(cljs.core._EQ_.call(null,cljs.core.count.call(null,args),1))
{return compile_form.call(null,cljs.core.PersistentVector.fromArray([cljs.core.first.call(null,args),cljs.core.ObjMap.EMPTY,""], true));
} else
{if(cljs.core._EQ_.call(null,cljs.core.count.call(null,args),2))
{if(cljs.core.map_QMARK_.call(null,cljs.core.second.call(null,args)))
{return compile_form.call(null,cljs.core.PersistentVector.fromArray([cljs.core.first.call(null,args),cljs.core.second.call(null,args),""], true));
} else
{if("\uFDD0:else")
{return compile_form.call(null,cljs.core.PersistentVector.fromArray([cljs.core.first.call(null,args),cljs.core.ObjMap.EMPTY,cljs.core.last.call(null,args)], true));
} else
{return null;
}
}
} else
{if("\uFDD0:else")
{var tag = cljs.core.first.call(null,args);
var attrs = cljs.core.second.call(null,args);
var contents = cljs.core.drop.call(null,2,args);
var tag_str = webster.html.sym_to_str.call(null,tag);
var attrs_str = webster.html.attrs_to_str.call(null,attrs);
var contents_str = ((cljs.core._EQ_.call(null,1,cljs.core.count.call(null,contents)))?((cljs.core.string_QMARK_.call(null,cljs.core.first.call(null,contents)))?cljs.core.first.call(null,contents):compile_form.call(null,cljs.core.first.call(null,contents))):(("\uFDD0:else")?cljs.core.reduce.call(null,cljs.core.str,cljs.core.map.call(null,compile_form,contents)):null));
return cljs.core.format.call(null,"<%s%s>%s</%s>",tag_str,(((function (){var or__3824__auto__ = cljs.core.empty_QMARK_.call(null,attrs_str);
if(or__3824__auto__)
{return or__3824__auto__;
} else
{return (attrs_str == null);
}
})())?"":[cljs.core.str(" "),cljs.core.str(attrs_str)].join('')),contents_str,tag_str);
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
return cljs.core.reduce.call(null,cljs.core.str,cljs.core.map.call(null,webster.html.compile_form,forms));
};
var compile = function (var_args){
var forms = null;
if (arguments.length > 0) {
  forms = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return compile__delegate.call(this, forms);
};
compile.cljs$lang$maxFixedArity = 0;
compile.cljs$lang$applyTo = (function (arglist__2796){
var forms = cljs.core.seq(arglist__2796);;
return compile__delegate(forms);
});
compile.cljs$core$IFn$_invoke$arity$variadic = compile__delegate;
return compile;
})()
;
