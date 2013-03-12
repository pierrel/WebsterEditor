var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  return goog.inHtmlDocument_() ? (goog.global.document.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e'), !0) : !1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "\x26amp;").replace(goog.string.ltRe_, "\x26lt;").replace(goog.string.gtRe_, "\x26gt;").replace(goog.string.quotRe_, "\x26quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("\x26") && (a = a.replace(goog.string.amperRe_, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.ltRe_, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.gtRe_, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "\x26quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"\x26";
      case "lt":
        return"\x3c";
      case "gt":
        return"\x3e";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", j = e[g] || "", k = RegExp("(\\d*)(\\D*)", "g"), l = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = k.exec(h) || ["", "", ""], m = l.exec(j) || ["", "", ""];
      if(0 == n[0].length && 0 == m[0].length) {
        break
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), p = 0 == m[1].length ? 0 : parseInt(m[1], 10), c = goog.string.compareElements_(c, p) || goog.string.compareElements_(0 == n[2].length, 0 == m[2].length) || goog.string.compareElements_(n[2], m[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof b) && goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.indexOf(b, c)
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return!goog.isString(b) || 1 != b.length ? -1 : a.lastIndexOf(b, c)
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var j = g[h];
      b.call(c, j, h, a) && (e[f++] = j)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && d.hasOwnProperty("callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var j = f + g >> 1, k;
    k = c ? b.call(e, a[j], j, a) : b(d, a[j]);
    0 < k ? f = j + 1 : (g = j, h = !k)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && !(a = a[d[c]], !goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.string.format = function(a, b) {
  var c = Array.prototype.slice.call(arguments), d = c.shift();
  if("undefined" == typeof d) {
    throw Error("[goog.string.format] Template required");
  }
  return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, h, j, k, l, n) {
    if("%" == k) {
      return"%"
    }
    var m = c.shift();
    if("undefined" == typeof m) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = m;
    return goog.string.format.demuxes_[k].apply(null, arguments)
  })
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_.s = function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + goog.string.repeat(" ", c - a.length) : goog.string.repeat(" ", c - a.length) + a
};
goog.string.format.demuxes_.f = function(a, b, c, d, e) {
  d = a.toString();
  isNaN(e) || "" == e || (d = a.toFixed(e));
  var f;
  f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (d = f + d);
  if(isNaN(c) || d.length >= c) {
    return d
  }
  d = isNaN(e) ? Math.abs(a).toString() : Math.abs(a).toFixed(e);
  a = c - d.length - f.length;
  0 <= b.indexOf("-", 0) ? d = f + d + goog.string.repeat(" ", a) : (b = 0 <= b.indexOf("0", 0) ? "0" : " ", d = f + goog.string.repeat(b, a) + d);
  return d
};
goog.string.format.demuxes_.d = function(a, b, c, d, e, f, g, h) {
  return goog.string.format.demuxes_.f(parseInt(a, 10), b, c, d, 0, f, g, h)
};
goog.string.format.demuxes_.i = goog.string.format.demuxes_.d;
goog.string.format.demuxes_.u = goog.string.format.demuxes_.d;
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
var cljs = {core:{}};
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function() {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core._STAR_1 = "undefined" != typeof cljs.core._STAR_1 ? cljs.core._STAR_1 : void 0;
cljs.core._STAR_2 = "undefined" != typeof cljs.core._STAR_2 ? cljs.core._STAR_2 : void 0;
cljs.core._STAR_3 = "undefined" != typeof cljs.core._STAR_3 ? cljs.core._STAR_3 : void 0;
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
cljs.core.nil_QMARK_ = function(a) {
  return null == a
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.type_satisfies_ = function(a, b) {
  return a[goog.typeOf(null == b ? null : b)] ? !0 : a._ ? !0 : !1
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.pr_str = "undefined" != typeof cljs.core.pr_str ? cljs.core.pr_str : void 0;
cljs.core.type = function(a) {
  return null == a ? null : a.constructor
};
cljs.core.missing_protocol = function(a, b) {
  var c = cljs.core.type.call(null, b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$lang$type : c) ? cljs.core.pr_str.call(null, c) : goog.typeOf(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""))
};
cljs.core.aclone = function(a) {
  return a.slice()
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var a = null, b = function(b, d) {
    return a.call(null, d)
  }, a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return Array(a);
      case 2:
        return b.call(this, a, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return Array(a)
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  return a
}();
cljs.core.apply = "undefined" != typeof cljs.core.apply ? cljs.core.apply : void 0;
cljs.core.aget = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.apply.call(null, a, a.call(null, b, c), f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 2:
        return a[b];
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a[b]
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.aset = function(a, b, c) {
  return a[b] = c
};
cljs.core.alength = function(a) {
  return a.length
};
cljs.core.reduce = "undefined" != typeof cljs.core.reduce ? cljs.core.reduce : void 0;
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b)
  }, c = function(a, b) {
    return cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a
    }, [], b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.Fn = {};
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    var b;
    b = a ? a.cljs$core$IFn$_invoke$arity$1 : a;
    if(b) {
      return a.cljs$core$IFn$_invoke$arity$1(a)
    }
    b = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!b && (b = cljs.core._invoke._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return b.call(null, a)
  }, c = function(a, b) {
    var c;
    c = a ? a.cljs$core$IFn$_invoke$arity$2 : a;
    if(c) {
      return a.cljs$core$IFn$_invoke$arity$2(a, b)
    }
    c = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._invoke._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return c.call(null, a, b)
  }, d = function(a, b, c) {
    var d;
    d = a ? a.cljs$core$IFn$_invoke$arity$3 : a;
    if(d) {
      return a.cljs$core$IFn$_invoke$arity$3(a, b, c)
    }
    d = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!d && (d = cljs.core._invoke._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return d.call(null, a, b, c)
  }, e = function(a, b, c, d) {
    var e;
    e = a ? a.cljs$core$IFn$_invoke$arity$4 : a;
    if(e) {
      return a.cljs$core$IFn$_invoke$arity$4(a, b, c, d)
    }
    e = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!e && (e = cljs.core._invoke._, !e)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return e.call(null, a, b, c, d)
  }, f = function(a, b, c, d, e) {
    var f;
    f = a ? a.cljs$core$IFn$_invoke$arity$5 : a;
    if(f) {
      return a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)
    }
    f = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!f && (f = cljs.core._invoke._, !f)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return f.call(null, a, b, c, d, e)
  }, g = function(a, b, c, d, e, f) {
    var g;
    g = a ? a.cljs$core$IFn$_invoke$arity$6 : a;
    if(g) {
      return a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f)
    }
    g = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._invoke._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return g.call(null, a, b, c, d, e, f)
  }, h = function(a, b, c, d, e, f, g) {
    var h;
    h = a ? a.cljs$core$IFn$_invoke$arity$7 : a;
    if(h) {
      return a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g)
    }
    h = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!h && (h = cljs.core._invoke._, !h)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return h.call(null, a, b, c, d, e, f, g)
  }, j = function(a, b, c, d, e, f, g, h) {
    var j;
    j = a ? a.cljs$core$IFn$_invoke$arity$8 : a;
    if(j) {
      return a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h)
    }
    j = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!j && (j = cljs.core._invoke._, !j)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return j.call(null, a, b, c, d, e, f, g, h)
  }, k = function(a, b, c, d, e, f, g, h, j) {
    var k;
    k = a ? a.cljs$core$IFn$_invoke$arity$9 : a;
    if(k) {
      return a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, j)
    }
    k = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!k && (k = cljs.core._invoke._, !k)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return k.call(null, a, b, c, d, e, f, g, h, j)
  }, l = function(a, b, c, d, e, f, g, h, j, k) {
    var l;
    l = a ? a.cljs$core$IFn$_invoke$arity$10 : a;
    if(l) {
      return a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, j, k)
    }
    l = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!l && (l = cljs.core._invoke._, !l)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return l.call(null, a, b, c, d, e, f, g, h, j, k)
  }, n = function(a, b, c, d, e, f, g, h, j, k, l) {
    var n;
    n = a ? a.cljs$core$IFn$_invoke$arity$11 : a;
    if(n) {
      return a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, j, k, l)
    }
    n = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!n && (n = cljs.core._invoke._, !n)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return n.call(null, a, b, c, d, e, f, g, h, j, k, l)
  }, m = function(a, b, c, d, e, f, g, h, j, k, l, n) {
    var m;
    m = a ? a.cljs$core$IFn$_invoke$arity$12 : a;
    if(m) {
      return a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, j, k, l, n)
    }
    m = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!m && (m = cljs.core._invoke._, !m)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return m.call(null, a, b, c, d, e, f, g, h, j, k, l, n)
  }, p = function(a, b, c, d, e, f, g, h, j, k, l, n, m) {
    var p;
    p = a ? a.cljs$core$IFn$_invoke$arity$13 : a;
    if(p) {
      return a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, j, k, l, n, m)
    }
    p = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!p && (p = cljs.core._invoke._, !p)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return p.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m)
  }, q = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p) {
    var q;
    q = a ? a.cljs$core$IFn$_invoke$arity$14 : a;
    if(q) {
      return a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, j, k, l, n, m, p)
    }
    q = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!q && (q = cljs.core._invoke._, !q)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return q.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p)
  }, s = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q) {
    var s;
    s = a ? a.cljs$core$IFn$_invoke$arity$15 : a;
    if(s) {
      return a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q)
    }
    s = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!s && (s = cljs.core._invoke._, !s)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return s.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q)
  }, r = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s) {
    var r;
    r = a ? a.cljs$core$IFn$_invoke$arity$16 : a;
    if(r) {
      return a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s)
    }
    r = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!r && (r = cljs.core._invoke._, !r)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return r.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s)
  }, t = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r) {
    var t;
    t = a ? a.cljs$core$IFn$_invoke$arity$17 : a;
    if(t) {
      return a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r)
    }
    t = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!t && (t = cljs.core._invoke._, !t)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return t.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r)
  }, u = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t) {
    var u;
    u = a ? a.cljs$core$IFn$_invoke$arity$18 : a;
    if(u) {
      return a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t)
    }
    u = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!u && (u = cljs.core._invoke._, !u)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return u.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t)
  }, v = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u) {
    var v;
    v = a ? a.cljs$core$IFn$_invoke$arity$19 : a;
    if(v) {
      return a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u)
    }
    v = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!v && (v = cljs.core._invoke._, !v)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return v.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u)
  }, y = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v) {
    var y;
    y = a ? a.cljs$core$IFn$_invoke$arity$20 : a;
    if(y) {
      return a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v)
    }
    y = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!y && (y = cljs.core._invoke._, !y)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return y.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v)
  }, F = function(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v, y) {
    var F;
    F = a ? a.cljs$core$IFn$_invoke$arity$21 : a;
    if(F) {
      return a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v, y)
    }
    F = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!F && (F = cljs.core._invoke._, !F)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return F.call(null, a, b, c, d, e, f, g, h, j, k, l, n, m, p, q, s, r, t, u, v, y)
  }, a = function(a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N, O, P, Q, R) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, w);
      case 3:
        return d.call(this, a, w, x);
      case 4:
        return e.call(this, a, w, x, z);
      case 5:
        return f.call(this, a, w, x, z, A);
      case 6:
        return g.call(this, a, w, x, z, A, B);
      case 7:
        return h.call(this, a, w, x, z, A, B, C);
      case 8:
        return j.call(this, a, w, x, z, A, B, C, D);
      case 9:
        return k.call(this, a, w, x, z, A, B, C, D, E);
      case 10:
        return l.call(this, a, w, x, z, A, B, C, D, E, G);
      case 11:
        return n.call(this, a, w, x, z, A, B, C, D, E, G, H);
      case 12:
        return m.call(this, a, w, x, z, A, B, C, D, E, G, H, I);
      case 13:
        return p.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J);
      case 14:
        return q.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K);
      case 15:
        return s.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L);
      case 16:
        return r.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M);
      case 17:
        return t.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N);
      case 18:
        return u.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N, O);
      case 19:
        return v.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N, O, P);
      case 20:
        return y.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N, O, P, Q);
      case 21:
        return F.call(this, a, w, x, z, A, B, C, D, E, G, H, I, J, K, L, M, N, O, P, Q, R)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = j;
  a.cljs$core$IFn$_invoke$arity$9 = k;
  a.cljs$core$IFn$_invoke$arity$10 = l;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = m;
  a.cljs$core$IFn$_invoke$arity$13 = p;
  a.cljs$core$IFn$_invoke$arity$14 = q;
  a.cljs$core$IFn$_invoke$arity$15 = s;
  a.cljs$core$IFn$_invoke$arity$16 = r;
  a.cljs$core$IFn$_invoke$arity$17 = t;
  a.cljs$core$IFn$_invoke$arity$18 = u;
  a.cljs$core$IFn$_invoke$arity$19 = v;
  a.cljs$core$IFn$_invoke$arity$20 = y;
  a.cljs$core$IFn$_invoke$arity$21 = F;
  return a
}();
cljs.core.ICounted = {};
cljs.core._count = function(a) {
  var b;
  b = a ? a.cljs$core$ICounted$_count$arity$1 : a;
  if(b) {
    return a.cljs$core$ICounted$_count$arity$1(a)
  }
  b = cljs.core._count[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._count._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
  }
  return b.call(null, a)
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function(a) {
  var b;
  b = a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a;
  if(b) {
    return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
  }
  b = cljs.core._empty[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._empty._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
  }
  return b.call(null, a)
};
cljs.core.ICollection = {};
cljs.core._conj = function(a, b) {
  var c;
  c = a ? a.cljs$core$ICollection$_conj$arity$2 : a;
  if(c) {
    return a.cljs$core$ICollection$_conj$arity$2(a, b)
  }
  c = cljs.core._conj[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
  }
  return c.call(null, a, b)
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    var c;
    c = a ? a.cljs$core$IIndexed$_nth$arity$2 : a;
    if(c) {
      return a.cljs$core$IIndexed$_nth$arity$2(a, b)
    }
    c = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._nth._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    var g;
    g = a ? a.cljs$core$IIndexed$_nth$arity$3 : a;
    if(g) {
      return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
    }
    g = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._nth._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ASeq = {};
cljs.core.ISeq = {};
cljs.core._first = function(a) {
  var b;
  b = a ? a.cljs$core$ISeq$_first$arity$1 : a;
  if(b) {
    return a.cljs$core$ISeq$_first$arity$1(a)
  }
  b = cljs.core._first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
  }
  return b.call(null, a)
};
cljs.core._rest = function(a) {
  var b;
  b = a ? a.cljs$core$ISeq$_rest$arity$1 : a;
  if(b) {
    return a.cljs$core$ISeq$_rest$arity$1(a)
  }
  b = cljs.core._rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
  }
  return b.call(null, a)
};
cljs.core.INext = {};
cljs.core._next = function(a) {
  var b;
  b = a ? a.cljs$core$INext$_next$arity$1 : a;
  if(b) {
    return a.cljs$core$INext$_next$arity$1(a)
  }
  b = cljs.core._next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INext.-next", a);
  }
  return b.call(null, a)
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    var c;
    c = a ? a.cljs$core$ILookup$_lookup$arity$2 : a;
    if(c) {
      return a.cljs$core$ILookup$_lookup$arity$2(a, b)
    }
    c = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._lookup._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    var g;
    g = a ? a.cljs$core$ILookup$_lookup$arity$3 : a;
    if(g) {
      return a.cljs$core$ILookup$_lookup$arity$3(a, b, c)
    }
    g = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._lookup._, !g)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function(a, b) {
  var c;
  c = a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a;
  if(c) {
    return a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b)
  }
  c = cljs.core._contains_key_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
  }
  return c.call(null, a, b)
};
cljs.core._assoc = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IAssociative$_assoc$arity$3 : a;
  if(d) {
    return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
  }
  d = cljs.core._assoc[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMap = {};
cljs.core._dissoc = function(a, b) {
  var c;
  c = a ? a.cljs$core$IMap$_dissoc$arity$2 : a;
  if(c) {
    return a.cljs$core$IMap$_dissoc$arity$2(a, b)
  }
  c = cljs.core._dissoc[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
  }
  return c.call(null, a, b)
};
cljs.core.IMapEntry = {};
cljs.core._key = function(a) {
  var b;
  b = a ? a.cljs$core$IMapEntry$_key$arity$1 : a;
  if(b) {
    return a.cljs$core$IMapEntry$_key$arity$1(a)
  }
  b = cljs.core._key[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", a);
  }
  return b.call(null, a)
};
cljs.core._val = function(a) {
  var b;
  b = a ? a.cljs$core$IMapEntry$_val$arity$1 : a;
  if(b) {
    return a.cljs$core$IMapEntry$_val$arity$1(a)
  }
  b = cljs.core._val[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._val._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", a);
  }
  return b.call(null, a)
};
cljs.core.ISet = {};
cljs.core._disjoin = function(a, b) {
  var c;
  c = a ? a.cljs$core$ISet$_disjoin$arity$2 : a;
  if(c) {
    return a.cljs$core$ISet$_disjoin$arity$2(a, b)
  }
  c = cljs.core._disjoin[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
  }
  return c.call(null, a, b)
};
cljs.core.IStack = {};
cljs.core._peek = function(a) {
  var b;
  b = a ? a.cljs$core$IStack$_peek$arity$1 : a;
  if(b) {
    return a.cljs$core$IStack$_peek$arity$1(a)
  }
  b = cljs.core._peek[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._peek._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
  }
  return b.call(null, a)
};
cljs.core._pop = function(a) {
  var b;
  b = a ? a.cljs$core$IStack$_pop$arity$1 : a;
  if(b) {
    return a.cljs$core$IStack$_pop$arity$1(a)
  }
  b = cljs.core._pop[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
  }
  return b.call(null, a)
};
cljs.core.IVector = {};
cljs.core._assoc_n = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IVector$_assoc_n$arity$3 : a;
  if(d) {
    return a.cljs$core$IVector$_assoc_n$arity$3(a, b, c)
  }
  d = cljs.core._assoc_n[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IDeref = {};
cljs.core._deref = function(a) {
  var b;
  b = a ? a.cljs$core$IDeref$_deref$arity$1 : a;
  if(b) {
    return a.cljs$core$IDeref$_deref$arity$1(a)
  }
  b = cljs.core._deref[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._deref._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
  }
  return b.call(null, a)
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a;
  if(d) {
    return a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c)
  }
  d = cljs.core._deref_with_timeout[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._deref_with_timeout._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMeta = {};
cljs.core._meta = function(a) {
  var b;
  b = a ? a.cljs$core$IMeta$_meta$arity$1 : a;
  if(b) {
    return a.cljs$core$IMeta$_meta$arity$1(a)
  }
  b = cljs.core._meta[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._meta._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
  }
  return b.call(null, a)
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function(a, b) {
  var c;
  c = a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a;
  if(c) {
    return a.cljs$core$IWithMeta$_with_meta$arity$2(a, b)
  }
  c = cljs.core._with_meta[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._with_meta._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
  }
  return c.call(null, a, b)
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    var c;
    c = a ? a.cljs$core$IReduce$_reduce$arity$2 : a;
    if(c) {
      return a.cljs$core$IReduce$_reduce$arity$2(a, b)
    }
    c = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._reduce._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    var g;
    g = a ? a.cljs$core$IReduce$_reduce$arity$3 : a;
    if(g) {
      return a.cljs$core$IReduce$_reduce$arity$3(a, b, c)
    }
    g = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._reduce._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IKVReduce = {};
cljs.core._kv_reduce = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IKVReduce$_kv_reduce$arity$3 : a;
  if(d) {
    return a.cljs$core$IKVReduce$_kv_reduce$arity$3(a, b, c)
  }
  d = cljs.core._kv_reduce[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._kv_reduce._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IEquiv = {};
cljs.core._equiv = function(a, b) {
  var c;
  c = a ? a.cljs$core$IEquiv$_equiv$arity$2 : a;
  if(c) {
    return a.cljs$core$IEquiv$_equiv$arity$2(a, b)
  }
  c = cljs.core._equiv[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._equiv._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
  }
  return c.call(null, a, b)
};
cljs.core.IHash = {};
cljs.core._hash = function(a) {
  var b;
  b = a ? a.cljs$core$IHash$_hash$arity$1 : a;
  if(b) {
    return a.cljs$core$IHash$_hash$arity$1(a)
  }
  b = cljs.core._hash[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._hash._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
  }
  return b.call(null, a)
};
cljs.core.ISeqable = {};
cljs.core._seq = function(a) {
  var b;
  b = a ? a.cljs$core$ISeqable$_seq$arity$1 : a;
  if(b) {
    return a.cljs$core$ISeqable$_seq$arity$1(a)
  }
  b = cljs.core._seq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._seq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
  }
  return b.call(null, a)
};
cljs.core.ISequential = {};
cljs.core.IList = {};
cljs.core.IRecord = {};
cljs.core.IReversible = {};
cljs.core._rseq = function(a) {
  var b;
  b = a ? a.cljs$core$IReversible$_rseq$arity$1 : a;
  if(b) {
    return a.cljs$core$IReversible$_rseq$arity$1(a)
  }
  b = cljs.core._rseq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rseq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", a);
  }
  return b.call(null, a)
};
cljs.core.ISorted = {};
cljs.core._sorted_seq = function(a, b) {
  var c;
  c = a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a;
  if(c) {
    return a.cljs$core$ISorted$_sorted_seq$arity$2(a, b)
  }
  c = cljs.core._sorted_seq[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._sorted_seq._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", a);
  }
  return c.call(null, a, b)
};
cljs.core._sorted_seq_from = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a;
  if(d) {
    return a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c)
  }
  d = cljs.core._sorted_seq_from[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._sorted_seq_from._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._entry_key = function(a, b) {
  var c;
  c = a ? a.cljs$core$ISorted$_entry_key$arity$2 : a;
  if(c) {
    return a.cljs$core$ISorted$_entry_key$arity$2(a, b)
  }
  c = cljs.core._entry_key[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._entry_key._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", a);
  }
  return c.call(null, a, b)
};
cljs.core._comparator = function(a) {
  var b;
  b = a ? a.cljs$core$ISorted$_comparator$arity$1 : a;
  if(b) {
    return a.cljs$core$ISorted$_comparator$arity$1(a)
  }
  b = cljs.core._comparator[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._comparator._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", a);
  }
  return b.call(null, a)
};
cljs.core.IWriter = {};
cljs.core._write = function(a, b) {
  var c;
  c = a ? a.cljs$core$IWriter$_write$arity$2 : a;
  if(c) {
    return a.cljs$core$IWriter$_write$arity$2(a, b)
  }
  c = cljs.core._write[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._write._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-write", a);
  }
  return c.call(null, a, b)
};
cljs.core._flush = function(a) {
  var b;
  b = a ? a.cljs$core$IWriter$_flush$arity$1 : a;
  if(b) {
    return a.cljs$core$IWriter$_flush$arity$1(a)
  }
  b = cljs.core._flush[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._flush._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-flush", a);
  }
  return b.call(null, a)
};
cljs.core.IPrintWithWriter = {};
cljs.core._pr_writer = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IPrintWithWriter$_pr_writer$arity$3 : a;
  if(d) {
    return a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, b, c)
  }
  d = cljs.core._pr_writer[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._pr_writer._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function(a) {
  var b;
  b = a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a;
  if(b) {
    return a.cljs$core$IPending$_realized_QMARK_$arity$1(a)
  }
  b = cljs.core._realized_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._realized_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
  }
  return b.call(null, a)
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a;
  if(d) {
    return a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c)
  }
  d = cljs.core._notify_watches[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._notify_watches._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._add_watch = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a;
  if(d) {
    return a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c)
  }
  d = cljs.core._add_watch[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_watch._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_watch = function(a, b) {
  var c;
  c = a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a;
  if(c) {
    return a.cljs$core$IWatchable$_remove_watch$arity$2(a, b)
  }
  c = cljs.core._remove_watch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_watch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
  }
  return c.call(null, a, b)
};
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function(a) {
  var b;
  b = a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a;
  if(b) {
    return a.cljs$core$IEditableCollection$_as_transient$arity$1(a)
  }
  b = cljs.core._as_transient[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._as_transient._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function(a, b) {
  var c;
  c = a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a;
  if(c) {
    return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b)
  }
  c = cljs.core._conj_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", a);
  }
  return c.call(null, a, b)
};
cljs.core._persistent_BANG_ = function(a) {
  var b;
  b = a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a;
  if(b) {
    return a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a)
  }
  b = cljs.core._persistent_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._persistent_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a;
  if(d) {
    return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c)
  }
  d = cljs.core._assoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = function(a, b) {
  var c;
  c = a ? a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 : a;
  if(c) {
    return a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(a, b)
  }
  c = cljs.core._dissoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", a);
  }
  return c.call(null, a, b)
};
cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 : a;
  if(d) {
    return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
  }
  d = cljs.core._assoc_n_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._pop_BANG_ = function(a) {
  var b;
  b = a ? a.cljs$core$ITransientVector$_pop_BANG_$arity$1 : a;
  if(b) {
    return a.cljs$core$ITransientVector$_pop_BANG_$arity$1(a)
  }
  b = cljs.core._pop_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = function(a, b) {
  var c;
  c = a ? a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 : a;
  if(c) {
    return a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(a, b)
  }
  c = cljs.core._disjoin_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", a);
  }
  return c.call(null, a, b)
};
cljs.core.IComparable = {};
cljs.core._compare = function(a, b) {
  var c;
  c = a ? a.cljs$core$IComparable$_compare$arity$2 : a;
  if(c) {
    return a.cljs$core$IComparable$_compare$arity$2(a, b)
  }
  c = cljs.core._compare[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._compare._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IComparable.-compare", a);
  }
  return c.call(null, a, b)
};
cljs.core.IChunk = {};
cljs.core._drop_first = function(a) {
  var b;
  b = a ? a.cljs$core$IChunk$_drop_first$arity$1 : a;
  if(b) {
    return a.cljs$core$IChunk$_drop_first$arity$1(a)
  }
  b = cljs.core._drop_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._drop_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedSeq = {};
cljs.core._chunked_first = function(a) {
  var b;
  b = a ? a.cljs$core$IChunkedSeq$_chunked_first$arity$1 : a;
  if(b) {
    return a.cljs$core$IChunkedSeq$_chunked_first$arity$1(a)
  }
  b = cljs.core._chunked_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", a);
  }
  return b.call(null, a)
};
cljs.core._chunked_rest = function(a) {
  var b;
  b = a ? a.cljs$core$IChunkedSeq$_chunked_rest$arity$1 : a;
  if(b) {
    return a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
  }
  b = cljs.core._chunked_rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedNext = {};
cljs.core._chunked_next = function(a) {
  var b;
  b = a ? a.cljs$core$IChunkedNext$_chunked_next$arity$1 : a;
  if(b) {
    return a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
  }
  b = cljs.core._chunked_next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", a);
  }
  return b.call(null, a)
};
cljs.core.INamed = {};
cljs.core._name = function(a) {
  var b;
  b = a ? a.cljs$core$INamed$_name$arity$1 : a;
  if(b) {
    return a.cljs$core$INamed$_name$arity$1(a)
  }
  b = cljs.core._name[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._name._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-name", a);
  }
  return b.call(null, a)
};
cljs.core._namespace = function(a) {
  var b;
  b = a ? a.cljs$core$INamed$_namespace$arity$1 : a;
  if(b) {
    return a.cljs$core$INamed$_namespace$arity$1(a)
  }
  b = cljs.core._namespace[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._namespace._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-namespace", a);
  }
  return b.call(null, a)
};
cljs.core.list = "undefined" != typeof cljs.core.list ? cljs.core.list : void 0;
cljs.core.instance_QMARK_ = "undefined" != typeof cljs.core.instance_QMARK_ ? cljs.core.instance_QMARK_ : void 0;
cljs.core.symbol_QMARK_ = "undefined" != typeof cljs.core.symbol_QMARK_ ? cljs.core.symbol_QMARK_ : void 0;
cljs.core.hash_combine = "undefined" != typeof cljs.core.hash_combine ? cljs.core.hash_combine : void 0;
cljs.core.hash = "undefined" != typeof cljs.core.hash ? cljs.core.hash : void 0;
cljs.core.Symbol = function(a, b, c, d, e) {
  this.ns = a;
  this.name = b;
  this.str = c;
  this._hash = d;
  this._meta = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321
};
cljs.core.Symbol.cljs$lang$type = !0;
cljs.core.Symbol.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Symbol")
};
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Symbol")
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b) {
  return cljs.core._write.call(null, b, this.str)
};
cljs.core.Symbol.prototype.cljs$core$INamed$ = !0;
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function() {
  return this.name
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function() {
  return this.ns
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function() {
  -1 === this._hash && (this._hash = cljs.core.hash_combine.call(null, cljs.core.hash.call(null, this.ns), cljs.core.hash.call(null, this.name)));
  return this._hash
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Symbol(this.ns, this.name, this.str, this._hash, b)
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this._meta
};
cljs.core.Symbol.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, c, this, null);
      case 3:
        return cljs.core._lookup.call(null, c, this, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Symbol.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.truth_(cljs.core.instance_QMARK_.call(null, cljs.core.Symbol, b)) ? this.str === b.str : !1
};
cljs.core.Symbol.prototype.toString = function() {
  return this.str
};
cljs.core.symbol = function() {
  var a = null, b = function(b) {
    return cljs.core.truth_(cljs.core.symbol_QMARK_.call(null, b)) ? b : a.call(null, null, b)
  }, c = function(a, b) {
    var c = null != a ? [cljs.core.str(a), cljs.core.str("/"), cljs.core.str(b)].join("") : b;
    return new cljs.core.Symbol(a, b, c, -1, null)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.seq = function(a) {
  if(null == a) {
    a = null
  }else {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 32) ? b : a.cljs$core$ASeq$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ASeq, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.ASeq, a);
    a = b ? a : cljs.core._seq.call(null, a)
  }
  return a
};
cljs.core.first = function(a) {
  if(null == a) {
    return null
  }
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a);
  if(b) {
    return cljs.core._first.call(null, a)
  }
  a = cljs.core.seq.call(null, a);
  return null == a ? null : cljs.core._first.call(null, a)
};
cljs.core.rest = function(a) {
  if(null != a) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a);
    if(b) {
      return cljs.core._rest.call(null, a)
    }
    a = cljs.core.seq.call(null, a);
    return null != a ? cljs.core._rest.call(null, a) : cljs.core.List.EMPTY
  }
  return cljs.core.List.EMPTY
};
cljs.core.next = function(a) {
  if(null == a) {
    a = null
  }else {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.INext, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.INext, a);
    a = b ? cljs.core._next.call(null, a) : cljs.core.seq.call(null, cljs.core.rest.call(null, a))
  }
  return a
};
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    var c = a === b;
    return c ? c : cljs.core._equiv.call(null, a, b)
  }, c = function(b, c, d) {
    for(;;) {
      if(cljs.core.truth_(a.call(null, b, c))) {
        if(cljs.core.next.call(null, d)) {
          b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, c, cljs.core.first.call(null, d))
        }
      }else {
        return!1
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a
};
cljs.core.hash_map = "undefined" != typeof cljs.core.hash_map ? cljs.core.hash_map : void 0;
cljs.core.list = "undefined" != typeof cljs.core.list ? cljs.core.list : void 0;
cljs.core.equiv_sequential = "undefined" != typeof cljs.core.equiv_sequential ? cljs.core.equiv_sequential : void 0;
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function() {
  return 0
};
cljs.core.ILookup["null"] = !0;
cljs.core._lookup["null"] = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return d
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.IAssociative["null"] = !0;
cljs.core._assoc["null"] = function(a, b, c) {
  return cljs.core.hash_map.call(null, b, c)
};
cljs.core.INext["null"] = !0;
cljs.core._next["null"] = function() {
  return null
};
cljs.core.IPrintWithWriter["null"] = !0;
cljs.core._pr_writer["null"] = function(a, b) {
  return cljs.core._write.call(null, b, "nil")
};
cljs.core.ICollection["null"] = !0;
cljs.core._conj["null"] = function(a, b) {
  return cljs.core.list.call(null, b)
};
cljs.core.IReduce["null"] = !0;
cljs.core._reduce["null"] = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return c.call(null);
      case 3:
        return d
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function() {
  return null
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function() {
  return 0
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function() {
  return null
};
cljs.core._pop["null"] = function() {
  return null
};
cljs.core.ISeq["null"] = !0;
cljs.core._first["null"] = function() {
  return null
};
cljs.core._rest["null"] = function() {
  return cljs.core.list.call(null)
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return null == b
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function() {
  return null
};
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function() {
  return null
};
cljs.core.IIndexed["null"] = !0;
cljs.core._nth["null"] = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return null;
      case 3:
        return d
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function() {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function() {
  return null
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.instance_QMARK_.call(null, Date, b);
  return c ? a.toString() === b.toString() : c
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return Math.floor(a) % 2147483647
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b
};
cljs.core.IHash["boolean"] = !0;
cljs.core._hash["boolean"] = function(a) {
  return!0 === a ? 1 : 0
};
cljs.core.with_meta = "undefined" != typeof cljs.core.with_meta ? cljs.core.with_meta : void 0;
cljs.core.IWithMeta["function"] = !0;
cljs.core._with_meta["function"] = function(a, b) {
  return cljs.core.with_meta.call(null, function() {
    if(void 0 === cljs.core.t2621) {
      cljs.core.t2621 = {};
      cljs.core.t2621 = function(a, b, c) {
        this.meta = a;
        this.f = b;
        this.meta2622 = c;
        this.cljs$lang$protocol_mask$partition1$ = 0;
        this.cljs$lang$protocol_mask$partition0$ = 393217
      };
      cljs.core.t2621.cljs$lang$type = !0;
      cljs.core.t2621.cljs$lang$ctorPrSeq = function() {
        return cljs.core.list.call(null, "cljs.core/t2621")
      };
      cljs.core.t2621.cljs$lang$ctorPrWriter = function(a, b) {
        return cljs.core._write.call(null, b, "cljs.core/t2621")
      };
      var c = cljs.core.t2621.prototype, d = function(a, b) {
        return cljs.core.apply.call(null, a.f, b)
      }, e = function(a, b) {
        a = this;
        var c = null;
        1 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
        return d.call(this, a, c)
      };
      e.cljs$lang$maxFixedArity = 1;
      e.cljs$lang$applyTo = function(a) {
        var b = cljs.core.first(a);
        a = cljs.core.rest(a);
        return d(b, a)
      };
      e.cljs$core$IFn$_invoke$arity$variadic = d;
      c.call = e;
      cljs.core.t2621.prototype.apply = function(a, b) {
        a = this;
        return a.call.apply(a, [a].concat(b.slice()))
      };
      cljs.core.t2621.prototype.cljs$core$Fn$ = !0;
      cljs.core.t2621.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
        return this.meta2622
      };
      cljs.core.t2621.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
        return new cljs.core.t2621(this.meta, this.f, b)
      }
    }
    return new cljs.core.t2621(b, a, null)
  }(), b)
};
cljs.core.IMeta["function"] = !0;
cljs.core._meta["function"] = function() {
  return null
};
cljs.core.Fn["function"] = !0;
cljs.core.IHash._ = !0;
cljs.core._hash._ = function(a) {
  return goog.getUid(a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.deref = "undefined" != typeof cljs.core.deref ? cljs.core.deref : void 0;
cljs.core.Reduced = function(a) {
  this.val = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Reduced.cljs$lang$type = !0;
cljs.core.Reduced.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Reduced")
};
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function() {
  return this.val
};
cljs.core.reduced = function(a) {
  return new cljs.core.Reduced(a)
};
cljs.core.reduced_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Reduced, a)
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core._count.call(null, a);
    if(0 === c) {
      return b.call(null)
    }
    for(var d = cljs.core._nth.call(null, a, 0), j = 1;;) {
      if(j < c) {
        d = b.call(null, d, cljs.core._nth.call(null, a, j));
        if(cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d)
        }
        j += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = cljs.core._count.call(null, a), j = 0;;) {
      if(j < d) {
        c = b.call(null, c, cljs.core._nth.call(null, a, j));
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        j += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var j = cljs.core._count.call(null, a);;) {
      if(d < j) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d));
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.array_reduce = function() {
  var a = null, b = function(a, b) {
    var c = a.length;
    if(0 === a.length) {
      return b.call(null)
    }
    for(var d = a[0], j = 1;;) {
      if(j < c) {
        d = b.call(null, d, a[j]);
        if(cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d)
        }
        j += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = a.length, j = 0;;) {
      if(j < d) {
        c = b.call(null, c, a[j]);
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        j += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var j = a.length;;) {
      if(d < j) {
        c = b.call(null, c, a[d]);
        if(cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.hash_coll = "undefined" != typeof cljs.core.hash_coll ? cljs.core.hash_coll : void 0;
cljs.core.cons = "undefined" != typeof cljs.core.cons ? cljs.core.cons : void 0;
cljs.core.pr_str = "undefined" != typeof cljs.core.pr_str ? cljs.core.pr_str : void 0;
cljs.core.RSeq = "undefined" != typeof cljs.core.RSeq ? cljs.core.RSeq : void 0;
cljs.core.counted_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 2) ? b : a.cljs$core$ICounted$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ICounted, a)
};
cljs.core.indexed_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16) ? b : a.cljs$core$IIndexed$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)
};
cljs.core.IndexedSeq = function(a, b) {
  this.arr = a;
  this.i = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 166199550
};
cljs.core.IndexedSeq.cljs$lang$type = !0;
cljs.core.IndexedSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function() {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : null
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  var b = a.cljs$core$ICounted$_count$arity$1(a);
  return 0 < b ? new cljs.core.RSeq(a, b - 1, null) : cljs.core.List.EMPTY
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.counted_QMARK_.call(null, this.arr) ? cljs.core.ci_reduce.call(null, this.arr, b, this.arr[this.i], this.i + 1) : cljs.core.ci_reduce.call(null, a, b, this.arr[this.i], 0)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.counted_QMARK_.call(null, this.arr) ? cljs.core.ci_reduce.call(null, this.arr, b, c, this.i) : cljs.core.ci_reduce.call(null, a, b, c, 0)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.arr.length - this.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.arr[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.arr.length ? this.arr[c] : null
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.arr.length ? this.arr[a] : c
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.List.EMPTY
};
cljs.core.prim_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0)
  }, c = function(a, b) {
    return b < a.length ? new cljs.core.IndexedSeq(a, b) : null
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.array_seq = function() {
  var a = null, b = function(a) {
    return cljs.core.prim_seq.call(null, a, 0)
  }, c = function(a, b) {
    return cljs.core.prim_seq.call(null, a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.IReduce.array = !0;
cljs.core._reduce.array = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c);
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ILookup.array = !0;
cljs.core._lookup.array = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a[c];
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.IIndexed.array = !0;
cljs.core._nth.array = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = c < a.length ? a[c] : null;
        return e;
      case 3:
        return e = c < a.length ? a[c] : d, e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ICounted.array = !0;
cljs.core._count.array = function(a) {
  return a.length
};
cljs.core.ISeqable.array = !0;
cljs.core._seq.array = function(a) {
  return cljs.core.array_seq.call(null, a, 0)
};
cljs.core.with_meta = "undefined" != typeof cljs.core.with_meta ? cljs.core.with_meta : void 0;
cljs.core.RSeq = function(a, b, c) {
  this.ci = a;
  this.i = b;
  this.meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.RSeq.cljs$lang$type = !0;
cljs.core.RSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/RSeq")
};
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/RSeq")
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, a)
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.RSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.i + 1
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core._nth.call(null, this.ci, this.i)
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : cljs.core.List.EMPTY
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.RSeq(this.ci, this.i, b)
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a))
};
cljs.core.last = function(a) {
  for(;;) {
    var b = cljs.core.next.call(null, a);
    if(null != b) {
      a = b
    }else {
      return cljs.core.first.call(null, a)
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b
};
cljs.core.conj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._conj.call(null, a, b)
  }, c = function(b, c, d) {
    for(;;) {
      if(cljs.core.truth_(d)) {
        b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
      }else {
        return a.call(null, b, c)
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty.call(null, a)
};
cljs.core.accumulating_seq_count = function(a) {
  a = cljs.core.seq.call(null, a);
  for(var b = 0;;) {
    if(cljs.core.counted_QMARK_.call(null, a)) {
      return b + cljs.core._count.call(null, a)
    }
    a = cljs.core.next.call(null, a);
    b += 1
  }
};
cljs.core.count = function(a) {
  return cljs.core.counted_QMARK_.call(null, a) ? cljs.core._count.call(null, a) : cljs.core.accumulating_seq_count.call(null, a)
};
cljs.core.linear_traversal_nth = function() {
  var a = null, b = function(a, b) {
    for(;;) {
      if(null == a) {
        throw Error("Index out of bounds");
      }
      if(0 === b) {
        if(cljs.core.seq.call(null, a)) {
          return cljs.core.first.call(null, a)
        }
        throw Error("Index out of bounds");
      }
      if(cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b)
      }
      if(cljs.core.seq.call(null, a)) {
        var c = cljs.core.next.call(null, a), g = b - 1;
        a = c;
        b = g
      }else {
        throw Error("Index out of bounds");
      }
    }
  }, c = function(a, b, c) {
    for(;;) {
      if(null == a) {
        return c
      }
      if(0 === b) {
        return cljs.core.seq.call(null, a) ? cljs.core.first.call(null, a) : c
      }
      if(cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b, c)
      }
      if(cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a), b -= 1
      }else {
        return c
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    var c;
    null == a ? c = null : (a ? (c = (c = a.cljs$lang$protocol_mask$partition0$ & 16) ? c : a.cljs$core$IIndexed$, c = c ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a), c = c ? cljs.core._nth.call(null, a, Math.floor(b)) : cljs.core.linear_traversal_nth.call(null, a, Math.floor(b)));
    return c
  }, c = function(a, b, c) {
    if(null != a) {
      var g;
      a ? (g = (g = a.cljs$lang$protocol_mask$partition0$ & 16) ? g : a.cljs$core$IIndexed$, g = g ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a)) : g = cljs.core.type_satisfies_.call(null, cljs.core.IIndexed, a);
      a = g ? cljs.core._nth.call(null, a, Math.floor(b), c) : cljs.core.linear_traversal_nth.call(null, a, Math.floor(b), c)
    }else {
      a = c
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    return cljs.core._lookup.call(null, a, b)
  }, c = function(a, b, c) {
    return cljs.core._lookup.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return cljs.core._assoc.call(null, a, b, c)
  }, c = function(b, c, d, h) {
    for(;;) {
      if(b = a.call(null, b, c, d), cljs.core.truth_(h)) {
        c = cljs.core.first.call(null, h), d = cljs.core.second.call(null, h), h = cljs.core.nnext.call(null, h)
      }else {
        return b
      }
    }
  }, d = function(a, b, d, h) {
    var j = null;
    3 < arguments.length && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return c.call(this, a, b, d, j)
  };
  d.cljs$lang$maxFixedArity = 3;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return c(b, d, h, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, c, g);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, g, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc.call(null, a, b)
  }, c = function(b, c, d) {
    for(;;) {
      if(b = a.call(null, b, c), cljs.core.truth_(d)) {
        c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
      }else {
        return b
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.with_meta = function(a, b) {
  return cljs.core._with_meta.call(null, a, b)
};
cljs.core.meta = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 131072) ? b : a.cljs$core$IMeta$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.IMeta, a);
  return b ? cljs.core._meta.call(null, a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek.call(null, a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop.call(null, a)
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin.call(null, a, b)
  }, c = function(b, c, d) {
    for(;;) {
      if(b = a.call(null, b, c), cljs.core.truth_(d)) {
        c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
      }else {
        return b
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.string_hash_cache = {};
cljs.core.string_hash_cache_count = 0;
cljs.core.add_to_string_hash_cache = function(a) {
  var b = goog.string.hashCode(a);
  cljs.core.string_hash_cache[a] = b;
  cljs.core.string_hash_cache_count += 1;
  return b
};
cljs.core.check_string_hash_cache = function(a) {
  255 < cljs.core.string_hash_cache_count && (cljs.core.string_hash_cache = {}, cljs.core.string_hash_cache_count = 0);
  var b = cljs.core.string_hash_cache[a];
  return null != b ? b : cljs.core.add_to_string_hash_cache.call(null, a)
};
cljs.core.hash = function() {
  var a = null, b = function(b) {
    return a.call(null, b, !0)
  }, c = function(a, b) {
    var c = goog.isString(a);
    return(c ? b : c) ? cljs.core.check_string_hash_cache.call(null, a) : cljs.core._hash.call(null, a)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.empty_QMARK_ = function(a) {
  var b = null == a;
  return b ? b : cljs.core.not.call(null, cljs.core.seq.call(null, a))
};
cljs.core.coll_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8) ? b : a.cljs$core$ICollection$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 4096) ? b : a.cljs$core$ISet$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 512) ? b : a.cljs$core$IAssociative$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16777216) ? b : a.cljs$core$ISequential$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISequential, a)
};
cljs.core.reduceable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 524288) ? b : a.cljs$core$IReduce$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IReduce, a)
};
cljs.core.map_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 1024) ? b : a.cljs$core$IMap$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16384) ? b : a.cljs$core$IVector$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IVector, a)
};
cljs.core.chunked_seq_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition1$ & 512) ? b : a.cljs$core$IChunkedSeq$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IChunkedSeq, a)
};
cljs.core.js_obj = function() {
  var a = null, b = function(a) {
    return cljs.core.apply.call(null, goog.object.create, a)
  }, c = function(a) {
    var c = null;
    0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return b.call(this, c)
  };
  c.cljs$lang$maxFixedArity = 0;
  c.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return b(a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a) {
    switch(arguments.length) {
      case 0:
        return{};
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return{}
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.array_copy = function(a, b, c, d, e) {
  for(;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for(d += e - 1;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1
  }
};
cljs.core.lookup_sentinel = {};
cljs.core.false_QMARK_ = function(a) {
  return!1 === a
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.seq_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISeq, a)
};
cljs.core.seqable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8388608) ? b : a.cljs$core$ISeqable$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.ISeqable, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.string_QMARK_ = function(a) {
  var b = goog.isString(a);
  return b ? "\ufdd0" !== a.charAt(0) : b
};
cljs.core.keyword_QMARK_ = function(a) {
  var b = goog.isString(a);
  return b ? "\ufdd0" === a.charAt(0) : b
};
cljs.core.symbol_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Symbol, a)
};
cljs.core.number_QMARK_ = function(a) {
  return goog.isNumber(a)
};
cljs.core.fn_QMARK_ = function(a) {
  var b = goog.isFunction(a);
  return b ? b : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$Fn$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.Fn, a) : cljs.core.type_satisfies_.call(null, cljs.core.Fn, a)
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_.call(null, a);
  return b ? b : a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 1) ? b : a.cljs$core$IFn$, b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IFn, a)) : cljs.core.type_satisfies_.call(null, cljs.core.IFn, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = cljs.core.number_QMARK_.call(null, a);
  return b && (b = !isNaN(a)) ? (b = Infinity !== a) ? parseFloat(a) === parseInt(a, 10) : b : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core._lookup.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0
};
cljs.core.find = function(a, b) {
  var c;
  if(c = null != a) {
    c = (c = cljs.core.associative_QMARK_.call(null, a)) ? cljs.core.contains_QMARK_.call(null, a, b) : c
  }
  return c ? cljs.core.PersistentVector.fromArray([b, cljs.core._lookup.call(null, a, b)], !0) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b)
  }, c = function(a, b, c) {
    if(cljs.core._EQ_.call(null, a, b)) {
      return!1
    }
    a = cljs.core.PersistentHashSet.fromArray([b, null, a, null], !0);
    for(b = c;;) {
      var d = cljs.core.first.call(null, b);
      c = cljs.core.next.call(null, b);
      if(cljs.core.truth_(b)) {
        if(cljs.core.contains_QMARK_.call(null, a, d)) {
          return!1
        }
        a = cljs.core.conj.call(null, a, d);
        b = c
      }else {
        return!0
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare = function(a, b) {
  if(a === b) {
    return 0
  }
  if(null == a) {
    return-1
  }
  if(null == b) {
    return 1
  }
  if(cljs.core.type.call(null, a) === cljs.core.type.call(null, b)) {
    var c;
    a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 2048) ? c : a.cljs$core$IComparable$, c = c ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IComparable, a)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IComparable, a);
    return c ? cljs.core._compare.call(null, a, b) : goog.array.defaultCompare(a, b)
  }
  throw Error("compare on non-nil objects of different types");
};
cljs.core.compare_indexed = function() {
  var a = null, b = function(b, c) {
    var f = cljs.core.count.call(null, b), g = cljs.core.count.call(null, c);
    return f < g ? -1 : f > g ? 1 : a.call(null, b, c, f, 0)
  }, c = function(a, b, c, g) {
    for(;;) {
      var h = cljs.core.compare.call(null, cljs.core.nth.call(null, a, g), cljs.core.nth.call(null, b, g)), j;
      j = (j = 0 === h) ? g + 1 < c : j;
      if(j) {
        g += 1
      }else {
        return h
      }
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.call(null, a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return cljs.core.number_QMARK_.call(null, d) ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.to_array = "undefined" != typeof cljs.core.to_array ? cljs.core.to_array : void 0;
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.compare, b)
  }, c = function(a, b) {
    if(cljs.core.seq.call(null, b)) {
      var c = cljs.core.to_array.call(null, b);
      goog.array.stableSort(c, cljs.core.fn__GT_comparator.call(null, a));
      return cljs.core.seq.call(null, c)
    }
    return cljs.core.List.EMPTY
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.compare, c)
  }, c = function(a, b, c) {
    return cljs.core.sort.call(null, function(c, f) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, c), a.call(null, f))
    }, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, c), cljs.core.next.call(null, c)) : a.call(null)
  }, c = function(a, b, c) {
    for(c = cljs.core.seq.call(null, c);;) {
      if(c) {
        b = a.call(null, b, cljs.core.first.call(null, c));
        if(cljs.core.reduced_QMARK_.call(null, b)) {
          return cljs.core.deref.call(null, b)
        }
        c = cljs.core.next.call(null, c)
      }else {
        return b
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.vec = "undefined" != typeof cljs.core.vec ? cljs.core.vec : void 0;
cljs.core.shuffle = function(a) {
  a = cljs.core.to_array.call(null, a);
  goog.array.shuffle(a);
  return cljs.core.vec.call(null, a)
};
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 524288) ? c : b.cljs$core$IReduce$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IReduce, b);
    return c ? cljs.core._reduce.call(null, b, a) : cljs.core.seq_reduce.call(null, a, b)
  }, c = function(a, b, c) {
    var g;
    c ? (g = (g = c.cljs$lang$protocol_mask$partition0$ & 524288) ? g : c.cljs$core$IReduce$, g = g ? !0 : c.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReduce, c)) : g = cljs.core.type_satisfies_.call(null, cljs.core.IReduce, c);
    return g ? cljs.core._reduce.call(null, c, a, b) : cljs.core.seq_reduce.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reduce_kv = function(a, b, c) {
  return cljs.core._kv_reduce.call(null, c, a, b)
};
cljs.core._PLUS_ = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b + c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b - c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b * c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function(b, c, d) {
    return cljs.core.reduce.call(null, a, a.call(null, b, c), d)
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / c;
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function(a, b, c) {
    for(;;) {
      if(a < b) {
        if(cljs.core.next.call(null, c)) {
          a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
        }else {
          return b < cljs.core.first.call(null, c)
        }
      }else {
        return!1
      }
    }
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a < b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function(a, b, c) {
    for(;;) {
      if(a <= b) {
        if(cljs.core.next.call(null, c)) {
          a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
        }else {
          return b <= cljs.core.first.call(null, c)
        }
      }else {
        return!1
      }
    }
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a <= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function(a, b, c) {
    for(;;) {
      if(a > b) {
        if(cljs.core.next.call(null, c)) {
          a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
        }else {
          return b > cljs.core.first.call(null, c)
        }
      }else {
        return!1
      }
    }
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a > b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function(a, b, c) {
    for(;;) {
      if(a >= b) {
        if(cljs.core.next.call(null, c)) {
          a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c)
        }else {
          return b >= cljs.core.first.call(null, c)
        }
      }else {
        return!1
      }
    }
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a >= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dec = function(a) {
  return a - 1
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b
  }, c = function(b, c, d) {
    return cljs.core.reduce.call(null, a, b > c ? b : c, d)
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b
  }, c = function(b, c, d) {
    return cljs.core.reduce.call(null, a, b < c ? b : c, d)
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.byte$ = function(a) {
  return a
};
cljs.core.char$ = function(a) {
  return a
};
cljs.core.short$ = function(a) {
  return a
};
cljs.core.float$ = function(a) {
  return a
};
cljs.core.double$ = function(a) {
  return a
};
cljs.core.unchecked_byte = function(a) {
  return a
};
cljs.core.unchecked_char = function(a) {
  return a
};
cljs.core.unchecked_short = function(a) {
  return a
};
cljs.core.unchecked_float = function(a) {
  return a
};
cljs.core.unchecked_double = function(a) {
  return a
};
cljs.core.unchecked_add = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b + c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_add_int = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b + c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_dec = function(a) {
  return a - 1
};
cljs.core.unchecked_dec_int = function(a) {
  return a - 1
};
cljs.core.unchecked_divide_int = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function(b, c, d) {
    return cljs.core.reduce.call(null, a, a.call(null, b, c), d)
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / c;
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_inc = function(a) {
  return a + 1
};
cljs.core.unchecked_inc_int = function(a) {
  return a + 1
};
cljs.core.unchecked_multiply = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b * c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_multiply_int = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b * c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_negate = function(a) {
  return-a
};
cljs.core.unchecked_negate_int = function(a) {
  return-a
};
cljs.core.mod = "undefined" != typeof cljs.core.mod ? cljs.core.mod : void 0;
cljs.core.unchecked_remainder_int = function(a, b) {
  return cljs.core.mod.call(null, a, b)
};
cljs.core.unchecked_substract = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b - c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_substract_int = function() {
  var a = null, b = function(b, c, f) {
    return cljs.core.reduce.call(null, a, b - c, f)
  }, c = function(a, c, f) {
    var g = null;
    2 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return b.call(this, a, c, g)
  };
  c.cljs$lang$maxFixedArity = 2;
  c.cljs$lang$applyTo = function(a) {
    var c = cljs.core.first(a), f = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return b(c, f, a)
  };
  c.cljs$core$IFn$_invoke$arity$variadic = b;
  a = function(a, b, f) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - b;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, b, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.call(null, a) : Math.ceil.call(null, a)
};
cljs.core.int$ = function(a) {
  return a | 0
};
cljs.core.unchecked_int = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.long$ = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.unchecked_long = function(a) {
  return cljs.core.fix.call(null, a)
};
cljs.core.booleans = function(a) {
  return a
};
cljs.core.bytes = function(a) {
  return a
};
cljs.core.chars = function(a) {
  return a
};
cljs.core.shorts = function(a) {
  return a
};
cljs.core.ints = function(a) {
  return a
};
cljs.core.floats = function(a) {
  return a
};
cljs.core.doubles = function(a) {
  return a
};
cljs.core.longs = function(a) {
  return a
};
cljs.core.js_mod = function(a, b) {
  return a % b
};
cljs.core.mod = function(a, b) {
  return(a % b + b) % b
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.call(null)
  }, c = function(b) {
    return b * a.call(null)
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b)
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b
};
cljs.core.bit_count = function(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv.call(null, a, b)
  }, c = function(b, c, d) {
    for(;;) {
      if(cljs.core.truth_(a.call(null, b, c))) {
        if(cljs.core.next.call(null, d)) {
          b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d)
        }else {
          return a.call(null, c, cljs.core.first.call(null, d))
        }
      }else {
        return!1
      }
    }
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq.call(null, a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return a ? 0 < c : a
    }())) {
      var e = c - 1, f = cljs.core.next.call(null, d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.str_STAR_ = function() {
  var a = null, b = function(a) {
    return null == a ? "" : a.toString()
  }, c = function(b, c) {
    return function(b, c) {
      for(;;) {
        if(cljs.core.truth_(c)) {
          var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c);
          b = d;
          c = e
        }else {
          return a.call(null, b)
        }
      }
    }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
  }, d = function(a, b) {
    var d = null;
    1 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return c.call(this, a, d)
  };
  d.cljs$lang$maxFixedArity = 1;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a);
    a = cljs.core.rest(a);
    return c(b, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return""
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.str = function() {
  var a = null, b = function(a) {
    return cljs.core.keyword_QMARK_.call(null, a) ? cljs.core.str_STAR_.call(null, ":", a.substring(2, a.length)) : null == a ? "" : a.toString()
  }, c = function(b, c) {
    return function(b, c) {
      for(;;) {
        if(cljs.core.truth_(c)) {
          var d = b.append(a.call(null, cljs.core.first.call(null, c))), e = cljs.core.next.call(null, c);
          b = d;
          c = e
        }else {
          return cljs.core.str_STAR_.call(null, b)
        }
      }
    }.call(null, new goog.string.StringBuffer(a.call(null, b)), c)
  }, d = function(a, b) {
    var d = null;
    1 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return c.call(this, a, d)
  };
  d.cljs$lang$maxFixedArity = 1;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a);
    a = cljs.core.rest(a);
    return c(b, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return""
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return a.substring(c)
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return a.substring(c, d)
  };
  return a
}();
cljs.core.map = "undefined" != typeof cljs.core.map ? cljs.core.map : void 0;
cljs.core.format = function() {
  var a = function(a, b) {
    var e = cljs.core.map.call(null, function(a) {
      var b;
      b = (b = cljs.core.keyword_QMARK_.call(null, a)) ? b : cljs.core.symbol_QMARK_.call(null, a);
      return b ? "" + cljs.core.str(a) : a
    }, b);
    return cljs.core.apply.call(null, goog.string.format, a, e)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    return cljs.core.keyword_QMARK_.call(null, a) ? a : cljs.core.symbol_QMARK_.call(null, a) ? cljs.core.str_STAR_.call(null, "\ufdd0", ":", cljs.core.subs.call(null, a, 2)) : cljs.core.str_STAR_.call(null, "\ufdd0", ":", a)
  }, c = function(b, c) {
    return a.call(null, cljs.core.str_STAR_.call(null, b, "/", c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, b) ? function() {
    for(var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if(null == c) {
        return null == d
      }
      if(null != d && cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
      }else {
        return!1
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.hash_combine.call(null, a, cljs.core.hash.call(null, c, !1))
  }, cljs.core.hash.call(null, cljs.core.first.call(null, a), !1), cljs.core.next.call(null, a))
};
cljs.core.key = "undefined" != typeof cljs.core.key ? cljs.core.key : void 0;
cljs.core.val = "undefined" != typeof cljs.core.val ? cljs.core.val : void 0;
cljs.core.hash_imap = function(a) {
  var b = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      var c = cljs.core.first.call(null, a), b = (b + (cljs.core.hash.call(null, cljs.core.key.call(null, c)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, c)))) % 4503599627370496;
      a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.hash_iset = function(a) {
  var b = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      var c = cljs.core.first.call(null, a), b = (b + cljs.core.hash.call(null, c)) % 4503599627370496;
      a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.name = "undefined" != typeof cljs.core.name ? cljs.core.name : void 0;
cljs.core.extend_object_BANG_ = function(a, b) {
  for(var c = cljs.core.seq.call(null, b);;) {
    if(c) {
      var d = cljs.core.first.call(null, c), e = cljs.core.nth.call(null, d, 0, null), d = cljs.core.nth.call(null, d, 1, null), e = cljs.core.name.call(null, e);
      a[e] = d;
      c = cljs.core.next.call(null, c)
    }else {
      break
    }
  }
  return a
};
cljs.core.List = function(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65413358
};
cljs.core.List.cljs$lang$type = !0;
cljs.core.List.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/List")
};
cljs.core.List.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/List")
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function() {
  return 1 === this.count ? null : this.rest
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, a, this.count + 1, null)
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return a.cljs$core$ISeq$_rest$arity$1(a)
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return 1 === this.count ? cljs.core.List.EMPTY : this.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count, this.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList = function(a) {
  this.meta = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65413326
};
cljs.core.EmptyList.cljs$lang$type = !0;
cljs.core.EmptyList.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/EmptyList")
};
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function() {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  throw Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return a
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 134217728) ? b : a.cljs$core$IReversible$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IReversible, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IReversible, a)
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq.call(null, a)
};
cljs.core.reverse = function(a) {
  return cljs.core.reversible_QMARK_.call(null, a) ? cljs.core.rseq.call(null, a) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    var b;
    if(cljs.core.instance_QMARK_.call(null, cljs.core.IndexedSeq, a)) {
      b = a.arr
    }else {
      a: {
        for(b = [];;) {
          if(null != a) {
            b.push(cljs.core._first.call(null, a)), a = cljs.core._next.call(null, a)
          }else {
            break a
          }
        }
        b = void 0
      }
    }
    a = b.length;
    for(var e = cljs.core.List.EMPTY;;) {
      if(0 < a) {
        var f = a - 1, e = cljs.core._conj.call(null, e, b[a - 1]);
        a = f
      }else {
        return e
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.Cons = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65405164
};
cljs.core.Cons.cljs$lang$type = !0;
cljs.core.Cons.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Cons")
};
cljs.core.Cons.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function() {
  return null == this.rest ? null : cljs.core._seq.call(null, this.rest)
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, a, this.__hash)
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return null == this.rest ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest, this.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.cons = function(a, b) {
  return function() {
    var a = null == b;
    return a ? a : b ? (a = (a = b.cljs$lang$protocol_mask$partition0$ & 64) ? a : b.cljs$core$ISeq$, a ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, b)) : cljs.core.type_satisfies_.call(null, cljs.core.ISeq, b)
  }() ? new cljs.core.Cons(null, a, b, null) : new cljs.core.Cons(null, a, cljs.core.seq.call(null, b), null)
};
cljs.core.list_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 33554432) ? b : a.cljs$core$IList$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IList, a)
  }
  return cljs.core.type_satisfies_.call(null, cljs.core.IList, a)
};
cljs.core.IReduce.string = !0;
cljs.core._reduce.string = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.ci_reduce.call(null, a, c);
      case 3:
        return cljs.core.ci_reduce.call(null, a, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ILookup.string = !0;
cljs.core._lookup.string = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._nth.call(null, a, c);
      case 3:
        return cljs.core._nth.call(null, a, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.IIndexed.string = !0;
cljs.core._nth.string = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = c < cljs.core._count.call(null, a) ? a.charAt(c) : null;
        return e;
      case 3:
        return e = c < cljs.core._count.call(null, a) ? a.charAt(c) : d, e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ICounted.string = !0;
cljs.core._count.string = function(a) {
  return a.length
};
cljs.core.ISeqable.string = !0;
cljs.core._seq.string = function(a) {
  return cljs.core.prim_seq.call(null, a, 0)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode(a)
};
cljs.core.Keyword = function(a) {
  this.k = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1
};
cljs.core.Keyword.cljs$lang$type = !0;
cljs.core.Keyword.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Keyword")
};
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Keyword")
};
cljs.core.Keyword.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = a;
        e = this;
        if(null == c) {
          e = null
        }else {
          var f = c.strobj;
          e = null == f ? cljs.core._lookup.call(null, c, e.k, null) : f[e.k]
        }
        return e;
      case 3:
        return e = null == c ? d : cljs.core._lookup.call(null, c, this.k, d), e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Keyword.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
String.prototype.cljs$core$IFn$ = !0;
String.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, c, this.toString(), null);
      case 3:
        return cljs.core._lookup.call(null, c, this.toString(), d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
String.prototype.apply = function(a, b) {
  return a.call.apply(a, [a].concat(b.slice()))
};
String.prototype.apply = function(a, b) {
  return 2 > cljs.core.count.call(null, b) ? cljs.core._lookup.call(null, b[0], a, null) : cljs.core._lookup.call(null, b[0], a, b[1])
};
cljs.core.lazy_seq_value = function(a) {
  var b = a.x;
  if(a.realized) {
    return b
  }
  a.x = b.call(null);
  a.realized = !0;
  return a.x
};
cljs.core.LazySeq = function(a, b, c, d) {
  this.meta = a;
  this.realized = b;
  this.x = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850700
};
cljs.core.LazySeq.cljs$lang$type = !0;
cljs.core.LazySeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/LazySeq")
};
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return cljs.core._seq.call(null, a.cljs$core$ISeq$_rest$arity$1(a))
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.lazy_seq_value.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.realized, this.x, this.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.ArrayChunk = "undefined" != typeof cljs.core.ArrayChunk ? cljs.core.ArrayChunk : void 0;
cljs.core.ChunkBuffer = function(a, b) {
  this.buf = a;
  this.end = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.ChunkBuffer.cljs$lang$type = !0;
cljs.core.ChunkBuffer.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.end
};
cljs.core.ChunkBuffer.prototype.add = function(a) {
  this.buf[this.end] = a;
  return this.end += 1
};
cljs.core.ChunkBuffer.prototype.chunk = function() {
  var a = new cljs.core.ArrayChunk(this.buf, 0, this.end);
  this.buf = null;
  return a
};
cljs.core.chunk_buffer = function(a) {
  return new cljs.core.ChunkBuffer(cljs.core.make_array.call(null, a), 0)
};
cljs.core.ArrayChunk = function(a, b, c) {
  this.arr = a;
  this.off = b;
  this.end = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306
};
cljs.core.ArrayChunk.cljs$lang$type = !0;
cljs.core.ArrayChunk.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.off], this.off + 1)
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.off)
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = !0;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function() {
  if(this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new cljs.core.ArrayChunk(this.arr, this.off + 1, this.end)
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return this.arr[this.off + b]
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = (a = 0 <= b) ? b < this.end - this.off : a;
  return a ? this.arr[this.off + b] : c
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.end - this.off
};
cljs.core.array_chunk = function() {
  var a = null, b = function(a) {
    return new cljs.core.ArrayChunk(a, 0, a.length)
  }, c = function(a, b) {
    return new cljs.core.ArrayChunk(a, b, a.length)
  }, d = function(a, b, c) {
    return new cljs.core.ArrayChunk(a, b, c)
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a
}();
cljs.core.ChunkedCons = function(a, b, c, d) {
  this.chunk = a;
  this.more = b;
  this.meta = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 31850604;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedCons.cljs$lang$type = !0;
cljs.core.ChunkedCons.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core._nth.call(null, this.chunk, 0)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return 1 < cljs.core._count.call(null, this.chunk) ? new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null) : null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function() {
  return null == this.more ? null : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ChunkedCons(this.chunk, this.more, b, this.__hash)
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function() {
  return this.chunk
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function() {
  return null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.chunk_cons = function(a, b) {
  return 0 === cljs.core._count.call(null, a) ? b : new cljs.core.ChunkedCons(a, b, null, null)
};
cljs.core.chunk_append = function(a, b) {
  return a.add(b)
};
cljs.core.chunk = function(a) {
  return a.chunk()
};
cljs.core.chunk_first = function(a) {
  return cljs.core._chunked_first.call(null, a)
};
cljs.core.chunk_rest = function(a) {
  return cljs.core._chunked_rest.call(null, a)
};
cljs.core.chunk_next = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 1024) ? b : a.cljs$core$IChunkedNext$, b = b ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.IChunkedNext, a);
  return b ? cljs.core._chunked_next.call(null, a) : cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, a))
};
cljs.core.to_array = function(a) {
  for(var b = [];;) {
    if(cljs.core.seq.call(null, a)) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return b
    }
  }
};
cljs.core.to_array_2d = function(a) {
  var b = cljs.core.make_array.call(null, cljs.core.count.call(null, a)), c = 0;
  for(a = cljs.core.seq.call(null, a);;) {
    if(a) {
      b[c] = cljs.core.to_array.call(null, cljs.core.first.call(null, a)), c += 1, a = cljs.core.next.call(null, a)
    }else {
      break
    }
  }
  return b
};
cljs.core.int_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("int-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var j = g + 1, k = cljs.core.next.call(null, h), g = j, h = k
        }else {
          return c
        }
      }
    }else {
      for(j = 0;;) {
        if(j < a) {
          c[j] = b, j += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("long-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var j = g + 1, k = cljs.core.next.call(null, h), g = j, h = k
        }else {
          return c
        }
      }
    }else {
      for(j = 0;;) {
        if(j < a) {
          c[j] = b, j += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("double-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var j = g + 1, k = cljs.core.next.call(null, h), g = j, h = k
        }else {
          return c
        }
      }
    }else {
      for(j = 0;;) {
        if(j < a) {
          c[j] = b, j += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    if(cljs.core.number_QMARK_.call(null, b)) {
      return a.call(null, b, null)
    }
    if(cljs.core.seq_QMARK_.call(null, b)) {
      return cljs.core.into_array.call(null, b)
    }
    throw Error("object-array called with something other than size or ISeq");
  }, c = function(a, b) {
    var c = cljs.core.make_array.call(null, a);
    if(cljs.core.seq_QMARK_.call(null, b)) {
      for(var g = 0, h = cljs.core.seq.call(null, b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first.call(null, h);
          var j = g + 1, k = cljs.core.next.call(null, h), g = j, h = k
        }else {
          return c
        }
      }
    }else {
      for(j = 0;;) {
        if(j < a) {
          c[j] = b, j += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.bounded_count = function(a, b) {
  if(cljs.core.counted_QMARK_.call(null, a)) {
    return cljs.core.count.call(null, a)
  }
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = 0 < d;
      return a ? cljs.core.seq.call(null, c) : a
    }())) {
      var f = cljs.core.next.call(null, c), g = d - 1, e = e + 1, c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return null == b ? null : null == cljs.core.next.call(null, b) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b)))
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, !1, function() {
      return null
    }, null)
  }, c = function(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return a
    }, null)
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, b);
      return d ? cljs.core.chunked_seq_QMARK_.call(null, d) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, d), a.call(null, cljs.core.chunk_rest.call(null, d), c)) : cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c
    }, null)
  }, e = function(b, c, d) {
    return function l(a, b) {
      return new cljs.core.LazySeq(null, !1, function() {
        var c = cljs.core.seq.call(null, a);
        return c ? cljs.core.chunked_seq_QMARK_.call(null, c) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, c), l.call(null, cljs.core.chunk_rest.call(null, c), b)) : cljs.core.cons.call(null, cljs.core.first.call(null, c), l.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? l.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null
      }, null)
    }.call(null, a.call(null, b, c), d)
  }, f = function(a, b, c) {
    var d = null;
    2 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return e.call(this, a, b, d)
  };
  f.cljs$lang$maxFixedArity = 2;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return e(b, c, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, e);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq.call(null, a)
  }, c = function(a, b) {
    return cljs.core.cons.call(null, a, b)
  }, d = function(a, b, c) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, c))
  }, e = function(a, b, c, d) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, d)))
  }, f = function(a, b, c, d, e) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, e)))))
  }, g = function(a, b, c, d, e) {
    var g = null;
    4 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
    return f.call(this, a, b, c, d, g)
  };
  g.cljs$lang$maxFixedArity = 4;
  g.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), e = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    return f(b, c, d, e, a)
  };
  g.cljs$core$IFn$_invoke$arity$variadic = f;
  a = function(a, f, k, l, n) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, k);
      case 4:
        return e.call(this, a, f, k, l);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, f, k, l, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient.call(null, a)
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_.call(null, a)
};
cljs.core.conj_BANG_ = function(a, b) {
  return cljs.core._conj_BANG_.call(null, a, b)
};
cljs.core.assoc_BANG_ = function(a, b, c) {
  return cljs.core._assoc_BANG_.call(null, a, b, c)
};
cljs.core.dissoc_BANG_ = function(a, b) {
  return cljs.core._dissoc_BANG_.call(null, a, b)
};
cljs.core.pop_BANG_ = function(a) {
  return cljs.core._pop_BANG_.call(null, a)
};
cljs.core.disj_BANG_ = function(a, b) {
  return cljs.core._disjoin_BANG_.call(null, a, b)
};
cljs.core.apply_to = function(a, b, c) {
  var d = cljs.core.seq.call(null, c);
  if(0 === b) {
    return a.call(null)
  }
  c = cljs.core._first.call(null, d);
  var e = cljs.core._rest.call(null, d);
  if(1 === b) {
    return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)
  }
  var d = cljs.core._first.call(null, e), f = cljs.core._rest.call(null, e);
  if(2 === b) {
    return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.call(null, c, d)
  }
  var e = cljs.core._first.call(null, f), g = cljs.core._rest.call(null, f);
  if(3 === b) {
    return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.call(null, c, d, e)
  }
  var f = cljs.core._first.call(null, g), h = cljs.core._rest.call(null, g);
  if(4 === b) {
    return a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.call(null, c, d, e, f)
  }
  g = cljs.core._first.call(null, h);
  h = cljs.core._rest.call(null, h);
  if(5 === b) {
    return a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.call(null, c, d, e, f, g)
  }
  a = cljs.core._first.call(null, h);
  var j = cljs.core._rest.call(null, h);
  if(6 === b) {
    return a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, a) : a.call(null, c, d, e, f, g, a)
  }
  var h = cljs.core._first.call(null, j), k = cljs.core._rest.call(null, j);
  if(7 === b) {
    return a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, a, h) : a.call(null, c, d, e, f, g, a, h)
  }
  var j = cljs.core._first.call(null, k), l = cljs.core._rest.call(null, k);
  if(8 === b) {
    return a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, a, h, j) : a.call(null, c, d, e, f, g, a, h, j)
  }
  var k = cljs.core._first.call(null, l), n = cljs.core._rest.call(null, l);
  if(9 === b) {
    return a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, a, h, j, k) : a.call(null, c, d, e, f, g, a, h, j, k)
  }
  var l = cljs.core._first.call(null, n), m = cljs.core._rest.call(null, n);
  if(10 === b) {
    return a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, a, h, j, k, l) : a.call(null, c, d, e, f, g, a, h, j, k, l)
  }
  var n = cljs.core._first.call(null, m), p = cljs.core._rest.call(null, m);
  if(11 === b) {
    return a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, a, h, j, k, l, n) : a.call(null, c, d, e, f, g, a, h, j, k, l, n)
  }
  var m = cljs.core._first.call(null, p), q = cljs.core._rest.call(null, p);
  if(12 === b) {
    return a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, a, h, j, k, l, n, m) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m)
  }
  var p = cljs.core._first.call(null, q), s = cljs.core._rest.call(null, q);
  if(13 === b) {
    return a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, a, h, j, k, l, n, m, p) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p)
  }
  var q = cljs.core._first.call(null, s), r = cljs.core._rest.call(null, s);
  if(14 === b) {
    return a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, a, h, j, k, l, n, m, p, q) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q)
  }
  var s = cljs.core._first.call(null, r), t = cljs.core._rest.call(null, r);
  if(15 === b) {
    return a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s)
  }
  var r = cljs.core._first.call(null, t), u = cljs.core._rest.call(null, t);
  if(16 === b) {
    return a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r)
  }
  var t = cljs.core._first.call(null, u), v = cljs.core._rest.call(null, u);
  if(17 === b) {
    return a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t)
  }
  var u = cljs.core._first.call(null, v), y = cljs.core._rest.call(null, v);
  if(18 === b) {
    return a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u)
  }
  v = cljs.core._first.call(null, y);
  y = cljs.core._rest.call(null, y);
  if(19 === b) {
    return a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u, v) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u, v)
  }
  var F = cljs.core._first.call(null, y);
  cljs.core._rest.call(null, y);
  if(20 === b) {
    return a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u, v, F) : a.call(null, c, d, e, f, g, a, h, j, k, l, n, m, p, q, s, r, t, u, v, F)
  }
  throw Error("Only up to 20 arguments supported on functions");
};
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array.call(null, b))
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.call(null, b, c);
    c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array.call(null, b))
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.call(null, b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.call(null, b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
  }, f = function(a, b, c, d, e, f) {
    b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, cljs.core.spread.call(null, f)))));
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b))
  }, g = function(a, b, c, d, e, g) {
    var p = null;
    5 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
    return f.call(this, a, b, c, d, e, p)
  };
  g.cljs$lang$maxFixedArity = 5;
  g.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), e = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
    return f(b, c, d, e, g, a)
  };
  g.cljs$core$IFn$_invoke$arity$variadic = f;
  a = function(a, f, k, l, n, m) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, k);
      case 4:
        return d.call(this, a, f, k, l);
      case 5:
        return e.call(this, a, f, k, l, n);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, f, k, l, n, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), e))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b));
    b = cljs.core.rest(cljs.core.next(b));
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b)
  }, c = function(a, b, c) {
    return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, c))
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function() {
    return!1
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.seq.call(null, a) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(null == cljs.core.seq.call(null, b)) {
      return!0
    }
    if(cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d
    }else {
      return!1
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return!cljs.core.every_QMARK_.call(null, a, b)
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.seq.call(null, b)) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if(cljs.core.truth_(c)) {
        return c
      }
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.integer_QMARK_.call(null, a)) {
    return 0 === (a & 1)
  }
  throw Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(a)].join(""));
};
cljs.core.odd_QMARK_ = function(a) {
  return!cljs.core.even_QMARK_.call(null, a)
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  var b = null, c = function(b, c, d) {
    return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, d))
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  b = function(b, c, g) {
    switch(arguments.length) {
      case 0:
        return cljs.core.not.call(null, a.call(null));
      case 1:
        return cljs.core.not.call(null, a.call(null, b));
      case 2:
        return cljs.core.not.call(null, a.call(null, b, c));
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(b, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = d.cljs$lang$applyTo;
  return b
};
cljs.core.constantly = function(a) {
  var b = function(b) {
    0 < arguments.length && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
    return a
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    cljs.core.seq(b);
    return a
  };
  b.cljs$core$IFn$_invoke$arity$variadic = function() {
    return a
  };
  return b
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity
  }, c = function(a, b) {
    var c = null, d = function(c, d, e, f) {
      return a.call(null, cljs.core.apply.call(null, b, c, d, e, f))
    }, e = function(a, b, c, e) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, a, b, c, f)
    };
    e.cljs$lang$maxFixedArity = 3;
    e.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return d(b, c, e, a)
    };
    e.cljs$core$IFn$_invoke$arity$variadic = d;
    c = function(c, d, f, j) {
      switch(arguments.length) {
        case 0:
          return a.call(null, b.call(null));
        case 1:
          return a.call(null, b.call(null, c));
        case 2:
          return a.call(null, b.call(null, c, d));
        case 3:
          return a.call(null, b.call(null, c, d, f));
        default:
          return e.cljs$core$IFn$_invoke$arity$variadic(c, d, f, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = e.cljs$lang$applyTo;
    return c
  }, d = function(a, b, c) {
    var d = null, e = function(d, e, f, k) {
      return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, e, f, k)))
    }, f = function(a, b, c, d) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return e.call(this, a, b, c, f)
    };
    f.cljs$lang$maxFixedArity = 3;
    f.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return e(b, c, d, a)
    };
    f.cljs$core$IFn$_invoke$arity$variadic = e;
    d = function(d, e, k, l) {
      switch(arguments.length) {
        case 0:
          return a.call(null, b.call(null, c.call(null)));
        case 1:
          return a.call(null, b.call(null, c.call(null, d)));
        case 2:
          return a.call(null, b.call(null, c.call(null, d, e)));
        case 3:
          return a.call(null, b.call(null, c.call(null, d, e, k)));
        default:
          return f.cljs$core$IFn$_invoke$arity$variadic(d, e, k, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = f.cljs$lang$applyTo;
    return d
  }, e = function(a, b, c, d) {
    var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d)), f = function(a) {
      a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a);
      for(var b = cljs.core.next.call(null, e);;) {
        if(b) {
          a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b)
        }else {
          return a
        }
      }
    };
    a = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return f.call(this, b)
    };
    a.cljs$lang$maxFixedArity = 0;
    a.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return f(a)
    };
    a.cljs$core$IFn$_invoke$arity$variadic = f;
    return a
  }, f = function(a, b, c, d) {
    var f = null;
    3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return e.call(this, a, b, c, f)
  };
  f.cljs$lang$maxFixedArity = 3;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return e(b, c, d, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, e);
      case 3:
        return d.call(this, a, e, j);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    var c = function(c) {
      return cljs.core.apply.call(null, a, b, c)
    }, d = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c(a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = c;
    return d
  }, c = function(a, b, c) {
    var d = function(d) {
      return cljs.core.apply.call(null, a, b, c, d)
    }, e = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return d.call(this, b)
    };
    e.cljs$lang$maxFixedArity = 0;
    e.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return d(a)
    };
    e.cljs$core$IFn$_invoke$arity$variadic = d;
    return e
  }, d = function(a, b, c, d) {
    var e = function(e) {
      return cljs.core.apply.call(null, a, b, c, d, e)
    }, f = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return e.call(this, b)
    };
    f.cljs$lang$maxFixedArity = 0;
    f.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return e(a)
    };
    f.cljs$core$IFn$_invoke$arity$variadic = e;
    return f
  }, e = function(a, b, c, d, e) {
    var f = function(f) {
      return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f))
    }, m = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return f.call(this, b)
    };
    m.cljs$lang$maxFixedArity = 0;
    m.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return f(a)
    };
    m.cljs$core$IFn$_invoke$arity$variadic = f;
    return m
  }, f = function(a, b, c, d, f) {
    var n = null;
    4 < arguments.length && (n = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
    return e.call(this, a, b, c, d, n)
  };
  f.cljs$lang$maxFixedArity = 4;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    return e(b, c, d, f, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, j);
      case 4:
        return d.call(this, a, e, j, k);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    var c = null, d = function(c, d, g, h) {
      return cljs.core.apply.call(null, a, null == c ? b : c, d, g, h)
    }, j = function(a, b, c, e) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, a, b, c, f)
    };
    j.cljs$lang$maxFixedArity = 3;
    j.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return d(b, c, e, a)
    };
    j.cljs$core$IFn$_invoke$arity$variadic = d;
    c = function(c, d, g, h) {
      switch(arguments.length) {
        case 1:
          return a.call(null, null == c ? b : c);
        case 2:
          return a.call(null, null == c ? b : c, d);
        case 3:
          return a.call(null, null == c ? b : c, d, g);
        default:
          return j.cljs$core$IFn$_invoke$arity$variadic(c, d, g, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = j.cljs$lang$applyTo;
    return c
  }, c = function(a, b, c) {
    var d = null, j = function(d, h, j, k) {
      return cljs.core.apply.call(null, a, null == d ? b : d, null == h ? c : h, j, k)
    }, k = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return j.call(this, a, b, c, e)
    };
    k.cljs$lang$maxFixedArity = 3;
    k.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return j(b, c, d, a)
    };
    k.cljs$core$IFn$_invoke$arity$variadic = j;
    d = function(d, h, j, p) {
      switch(arguments.length) {
        case 2:
          return a.call(null, null == d ? b : d, null == h ? c : h);
        case 3:
          return a.call(null, null == d ? b : d, null == h ? c : h, j);
        default:
          return k.cljs$core$IFn$_invoke$arity$variadic(d, h, j, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = k.cljs$lang$applyTo;
    return d
  }, d = function(a, b, c, d) {
    var j = null, k = function(j, k, l, q) {
      return cljs.core.apply.call(null, a, null == j ? b : j, null == k ? c : k, null == l ? d : l, q)
    }, l = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return k.call(this, a, b, c, e)
    };
    l.cljs$lang$maxFixedArity = 3;
    l.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return k(b, c, d, a)
    };
    l.cljs$core$IFn$_invoke$arity$variadic = k;
    j = function(j, k, p, q) {
      switch(arguments.length) {
        case 2:
          return a.call(null, null == j ? b : j, null == k ? c : k);
        case 3:
          return a.call(null, null == j ? b : j, null == k ? c : k, null == p ? d : p);
        default:
          return l.cljs$core$IFn$_invoke$arity$variadic(j, k, p, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    j.cljs$lang$maxFixedArity = 3;
    j.cljs$lang$applyTo = l.cljs$lang$applyTo;
    return j
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(g) {
        if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for(var h = cljs.core.chunk_first.call(null, g), j = cljs.core.count.call(null, h), k = cljs.core.chunk_buffer.call(null, j), l = 0;;) {
            if(l < j) {
              cljs.core.chunk_append.call(null, k, a.call(null, b + l, cljs.core._nth.call(null, h, l))), l += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), d.call(null, b + j, cljs.core.chunk_rest.call(null, g)))
        }
        return cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    }, null)
  }.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for(var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if(h < f) {
            var j = b.call(null, cljs.core._nth.call(null, e, h));
            null != j && cljs.core.chunk_append.call(null, g, j);
            h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), keep.call(null, b, cljs.core.chunk_rest.call(null, d)))
      }
      e = b.call(null, cljs.core.first.call(null, d));
      return null == e ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)))
    }
    return null
  }, null)
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      if(g) {
        if(cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for(var h = cljs.core.chunk_first.call(null, g), j = cljs.core.count.call(null, h), k = cljs.core.chunk_buffer.call(null, j), l = 0;;) {
            if(l < j) {
              var n = a.call(null, b + l, cljs.core._nth.call(null, h, l));
              null != n && cljs.core.chunk_append.call(null, k, n);
              l += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, k), d.call(null, b + j, cljs.core.chunk_rest.call(null, g)))
        }
        h = a.call(null, b, cljs.core.first.call(null, g));
        return null == h ? d.call(null, b + 1, cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, b + 1, cljs.core.rest.call(null, g)))
      }
      return null
    }, null)
  }.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    var b = null, c = function(b) {
      return cljs.core.boolean$.call(null, a.call(null, b))
    }, d = function(b, c) {
      return cljs.core.boolean$.call(null, function() {
        var d = a.call(null, b);
        return cljs.core.truth_(d) ? a.call(null, c) : d
      }())
    }, e = function(b, c, d) {
      return cljs.core.boolean$.call(null, function() {
        var e = a.call(null, b);
        return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e
      }())
    }, f = function(c, d, e, f) {
      return cljs.core.boolean$.call(null, function() {
        var j = b.call(null, c, d, e);
        return cljs.core.truth_(j) ? cljs.core.every_QMARK_.call(null, a, f) : j
      }())
    }, m = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return f.call(this, a, b, c, e)
    };
    m.cljs$lang$maxFixedArity = 3;
    m.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return f(b, c, d, a)
    };
    m.cljs$core$IFn$_invoke$arity$variadic = f;
    b = function(a, b, f, g) {
      switch(arguments.length) {
        case 0:
          return!0;
        case 1:
          return c.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return e.call(this, a, b, f);
        default:
          return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = m.cljs$lang$applyTo;
    b.cljs$core$IFn$_invoke$arity$0 = function() {
      return!0
    };
    b.cljs$core$IFn$_invoke$arity$1 = c;
    b.cljs$core$IFn$_invoke$arity$2 = d;
    b.cljs$core$IFn$_invoke$arity$3 = e;
    b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
    return b
  }, c = function(a, b) {
    var c = null, d = function(c) {
      return cljs.core.boolean$.call(null, function() {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? b.call(null, c) : d
      }())
    }, e = function(c, d) {
      return cljs.core.boolean$.call(null, function() {
        var e = a.call(null, c);
        return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e
      }())
    }, f = function(c, d, e) {
      return cljs.core.boolean$.call(null, function() {
        var f = a.call(null, c);
        return cljs.core.truth_(f) && (f = a.call(null, d), cljs.core.truth_(f) && (f = a.call(null, e), cljs.core.truth_(f) && (f = b.call(null, c), cljs.core.truth_(f)))) ? (f = b.call(null, d), cljs.core.truth_(f) ? b.call(null, e) : f) : f
      }())
    }, m = function(d, e, f, k) {
      return cljs.core.boolean$.call(null, function() {
        var l = c.call(null, d, e, f);
        return cljs.core.truth_(l) ? cljs.core.every_QMARK_.call(null, function(c) {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d
        }, k) : l
      }())
    }, p = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return m.call(this, a, b, c, e)
    };
    p.cljs$lang$maxFixedArity = 3;
    p.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return m(b, c, d, a)
    };
    p.cljs$core$IFn$_invoke$arity$variadic = m;
    c = function(a, b, c, g) {
      switch(arguments.length) {
        case 0:
          return!0;
        case 1:
          return d.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return f.call(this, a, b, c);
        default:
          return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = p.cljs$lang$applyTo;
    c.cljs$core$IFn$_invoke$arity$0 = function() {
      return!0
    };
    c.cljs$core$IFn$_invoke$arity$1 = d;
    c.cljs$core$IFn$_invoke$arity$2 = e;
    c.cljs$core$IFn$_invoke$arity$3 = f;
    c.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
    return c
  }, d = function(a, b, c) {
    var d = null, e = function(d) {
      return cljs.core.boolean$.call(null, function() {
        var e = a.call(null, d);
        return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
      }())
    }, f = function(d, e) {
      return cljs.core.boolean$.call(null, function() {
        var f = a.call(null, d);
        return cljs.core.truth_(f) && (f = b.call(null, d), cljs.core.truth_(f) && (f = c.call(null, d), cljs.core.truth_(f) && (f = a.call(null, e), cljs.core.truth_(f)))) ? (f = b.call(null, e), cljs.core.truth_(f) ? c.call(null, e) : f) : f
      }())
    }, m = function(d, e, f) {
      return cljs.core.boolean$.call(null, function() {
        var k = a.call(null, d);
        return cljs.core.truth_(k) && (k = b.call(null, d), cljs.core.truth_(k) && (k = c.call(null, d), cljs.core.truth_(k) && (k = a.call(null, e), cljs.core.truth_(k) && (k = b.call(null, e), cljs.core.truth_(k) && (k = c.call(null, e), cljs.core.truth_(k) && (k = a.call(null, f), cljs.core.truth_(k))))))) ? (k = b.call(null, f), cljs.core.truth_(k) ? c.call(null, f) : k) : k
      }())
    }, p = function(e, f, l, n) {
      return cljs.core.boolean$.call(null, function() {
        var m = d.call(null, e, f, l);
        return cljs.core.truth_(m) ? cljs.core.every_QMARK_.call(null, function(d) {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e
        }, n) : m
      }())
    }, q = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return p.call(this, a, b, c, e)
    };
    q.cljs$lang$maxFixedArity = 3;
    q.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return p(b, c, d, a)
    };
    q.cljs$core$IFn$_invoke$arity$variadic = p;
    d = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return!0;
        case 1:
          return e.call(this, a);
        case 2:
          return f.call(this, a, b);
        case 3:
          return m.call(this, a, b, c);
        default:
          return q.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = q.cljs$lang$applyTo;
    d.cljs$core$IFn$_invoke$arity$0 = function() {
      return!0
    };
    d.cljs$core$IFn$_invoke$arity$1 = e;
    d.cljs$core$IFn$_invoke$arity$2 = f;
    d.cljs$core$IFn$_invoke$arity$3 = m;
    d.cljs$core$IFn$_invoke$arity$variadic = q.cljs$core$IFn$_invoke$arity$variadic;
    return d
  }, e = function(a, b, c, d) {
    var e = cljs.core.list_STAR_.call(null, a, b, c, d), f = null, m = function(a) {
      return cljs.core.every_QMARK_.call(null, function(b) {
        return b.call(null, a)
      }, e)
    }, p = function(a, b) {
      return cljs.core.every_QMARK_.call(null, function(c) {
        var d = c.call(null, a);
        return cljs.core.truth_(d) ? c.call(null, b) : d
      }, e)
    }, q = function(a, b, c) {
      return cljs.core.every_QMARK_.call(null, function(d) {
        var e = d.call(null, a);
        return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e
      }, e)
    }, s = function(a, b, c, d) {
      return cljs.core.boolean$.call(null, function() {
        var g = f.call(null, a, b, c);
        return cljs.core.truth_(g) ? cljs.core.every_QMARK_.call(null, function(a) {
          return cljs.core.every_QMARK_.call(null, a, d)
        }, e) : g
      }())
    }, r = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return s.call(this, a, b, c, e)
    };
    r.cljs$lang$maxFixedArity = 3;
    r.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return s(b, c, d, a)
    };
    r.cljs$core$IFn$_invoke$arity$variadic = s;
    f = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return!0;
        case 1:
          return m.call(this, a);
        case 2:
          return p.call(this, a, b);
        case 3:
          return q.call(this, a, b, c);
        default:
          return r.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    f.cljs$lang$maxFixedArity = 3;
    f.cljs$lang$applyTo = r.cljs$lang$applyTo;
    f.cljs$core$IFn$_invoke$arity$0 = function() {
      return!0
    };
    f.cljs$core$IFn$_invoke$arity$1 = m;
    f.cljs$core$IFn$_invoke$arity$2 = p;
    f.cljs$core$IFn$_invoke$arity$3 = q;
    f.cljs$core$IFn$_invoke$arity$variadic = r.cljs$core$IFn$_invoke$arity$variadic;
    return f
  }, f = function(a, b, c, d) {
    var f = null;
    3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return e.call(this, a, b, c, f)
  };
  f.cljs$lang$maxFixedArity = 3;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return e(b, c, d, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
      case 3:
        return d.call(this, a, e, j);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    var b = null, c = function(b) {
      return a.call(null, b)
    }, d = function(b, c) {
      var d = a.call(null, b);
      return cljs.core.truth_(d) ? d : a.call(null, c)
    }, e = function(b, c, d) {
      b = a.call(null, b);
      if(cljs.core.truth_(b)) {
        return b
      }
      c = a.call(null, c);
      return cljs.core.truth_(c) ? c : a.call(null, d)
    }, f = function(c, d, e, f) {
      c = b.call(null, c, d, e);
      return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, f)
    }, m = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return f.call(this, a, b, c, e)
    };
    m.cljs$lang$maxFixedArity = 3;
    m.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return f(b, c, d, a)
    };
    m.cljs$core$IFn$_invoke$arity$variadic = f;
    b = function(a, b, f, g) {
      switch(arguments.length) {
        case 0:
          return null;
        case 1:
          return c.call(this, a);
        case 2:
          return d.call(this, a, b);
        case 3:
          return e.call(this, a, b, f);
        default:
          return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = m.cljs$lang$applyTo;
    b.cljs$core$IFn$_invoke$arity$0 = function() {
      return null
    };
    b.cljs$core$IFn$_invoke$arity$1 = c;
    b.cljs$core$IFn$_invoke$arity$2 = d;
    b.cljs$core$IFn$_invoke$arity$3 = e;
    b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
    return b
  }, c = function(a, b) {
    var c = null, d = function(c) {
      var d = a.call(null, c);
      return cljs.core.truth_(d) ? d : b.call(null, c)
    }, e = function(c, d) {
      var e = a.call(null, c);
      if(cljs.core.truth_(e)) {
        return e
      }
      e = a.call(null, d);
      if(cljs.core.truth_(e)) {
        return e
      }
      e = b.call(null, c);
      return cljs.core.truth_(e) ? e : b.call(null, d)
    }, f = function(c, d, e) {
      var f = a.call(null, c);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = a.call(null, d);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = a.call(null, e);
      if(cljs.core.truth_(f)) {
        return f
      }
      c = b.call(null, c);
      if(cljs.core.truth_(c)) {
        return c
      }
      d = b.call(null, d);
      return cljs.core.truth_(d) ? d : b.call(null, e)
    }, m = function(d, e, f, k) {
      d = c.call(null, d, e, f);
      return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? d : b.call(null, c)
      }, k)
    }, p = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return m.call(this, a, b, c, e)
    };
    p.cljs$lang$maxFixedArity = 3;
    p.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return m(b, c, d, a)
    };
    p.cljs$core$IFn$_invoke$arity$variadic = m;
    c = function(a, b, c, g) {
      switch(arguments.length) {
        case 0:
          return null;
        case 1:
          return d.call(this, a);
        case 2:
          return e.call(this, a, b);
        case 3:
          return f.call(this, a, b, c);
        default:
          return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = p.cljs$lang$applyTo;
    c.cljs$core$IFn$_invoke$arity$0 = function() {
      return null
    };
    c.cljs$core$IFn$_invoke$arity$1 = d;
    c.cljs$core$IFn$_invoke$arity$2 = e;
    c.cljs$core$IFn$_invoke$arity$3 = f;
    c.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
    return c
  }, d = function(a, b, c) {
    var d = null, e = function(d) {
      var e = a.call(null, d);
      if(cljs.core.truth_(e)) {
        return e
      }
      e = b.call(null, d);
      return cljs.core.truth_(e) ? e : c.call(null, d)
    }, f = function(d, e) {
      var f = a.call(null, d);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = b.call(null, d);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = c.call(null, d);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = a.call(null, e);
      if(cljs.core.truth_(f)) {
        return f
      }
      f = b.call(null, e);
      return cljs.core.truth_(f) ? f : c.call(null, e)
    }, m = function(d, e, f) {
      var k = a.call(null, d);
      if(cljs.core.truth_(k)) {
        return k
      }
      k = b.call(null, d);
      if(cljs.core.truth_(k)) {
        return k
      }
      d = c.call(null, d);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = a.call(null, e);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = b.call(null, e);
      if(cljs.core.truth_(d)) {
        return d
      }
      e = c.call(null, e);
      if(cljs.core.truth_(e)) {
        return e
      }
      e = a.call(null, f);
      if(cljs.core.truth_(e)) {
        return e
      }
      e = b.call(null, f);
      return cljs.core.truth_(e) ? e : c.call(null, f)
    }, p = function(e, f, l, m) {
      e = d.call(null, e, f, l);
      return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
        var e = a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.call(null, d);
        return cljs.core.truth_(e) ? e : c.call(null, d)
      }, m)
    }, q = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return p.call(this, a, b, c, e)
    };
    q.cljs$lang$maxFixedArity = 3;
    q.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return p(b, c, d, a)
    };
    q.cljs$core$IFn$_invoke$arity$variadic = p;
    d = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return null;
        case 1:
          return e.call(this, a);
        case 2:
          return f.call(this, a, b);
        case 3:
          return m.call(this, a, b, c);
        default:
          return q.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = q.cljs$lang$applyTo;
    d.cljs$core$IFn$_invoke$arity$0 = function() {
      return null
    };
    d.cljs$core$IFn$_invoke$arity$1 = e;
    d.cljs$core$IFn$_invoke$arity$2 = f;
    d.cljs$core$IFn$_invoke$arity$3 = m;
    d.cljs$core$IFn$_invoke$arity$variadic = q.cljs$core$IFn$_invoke$arity$variadic;
    return d
  }, e = function(a, b, c, d) {
    var e = cljs.core.list_STAR_.call(null, a, b, c, d), f = null, m = function(a) {
      return cljs.core.some.call(null, function(b) {
        return b.call(null, a)
      }, e)
    }, p = function(a, b) {
      return cljs.core.some.call(null, function(c) {
        var d = c.call(null, a);
        return cljs.core.truth_(d) ? d : c.call(null, b)
      }, e)
    }, q = function(a, b, c) {
      return cljs.core.some.call(null, function(d) {
        var e = d.call(null, a);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = d.call(null, b);
        return cljs.core.truth_(e) ? e : d.call(null, c)
      }, e)
    }, s = function(a, b, c, d) {
      a = f.call(null, a, b, c);
      return cljs.core.truth_(a) ? a : cljs.core.some.call(null, function(a) {
        return cljs.core.some.call(null, a, d)
      }, e)
    }, r = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return s.call(this, a, b, c, e)
    };
    r.cljs$lang$maxFixedArity = 3;
    r.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return s(b, c, d, a)
    };
    r.cljs$core$IFn$_invoke$arity$variadic = s;
    f = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return null;
        case 1:
          return m.call(this, a);
        case 2:
          return p.call(this, a, b);
        case 3:
          return q.call(this, a, b, c);
        default:
          return r.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    f.cljs$lang$maxFixedArity = 3;
    f.cljs$lang$applyTo = r.cljs$lang$applyTo;
    f.cljs$core$IFn$_invoke$arity$0 = function() {
      return null
    };
    f.cljs$core$IFn$_invoke$arity$1 = m;
    f.cljs$core$IFn$_invoke$arity$2 = p;
    f.cljs$core$IFn$_invoke$arity$3 = q;
    f.cljs$core$IFn$_invoke$arity$variadic = r.cljs$core$IFn$_invoke$arity$variadic;
    return f
  }, f = function(a, b, c, d) {
    var f = null;
    3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return e.call(this, a, b, c, f)
  };
  f.cljs$lang$maxFixedArity = 3;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return e(b, c, d, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
      case 3:
        return d.call(this, a, e, j);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, c);
      if(d) {
        if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
          for(var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), n = cljs.core.chunk_buffer.call(null, f), m = 0;;) {
            if(m < f) {
              cljs.core.chunk_append.call(null, n, b.call(null, cljs.core._nth.call(null, e, m))), m += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, n), a.call(null, b, cljs.core.chunk_rest.call(null, d)))
        }
        return cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d)))
      }
      return null
    }, null)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var e = cljs.core.seq.call(null, c), f = cljs.core.seq.call(null, d);
      return(e ? f : e) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, f)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, f))) : null
    }, null)
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, c), n = cljs.core.seq.call(null, d), m = cljs.core.seq.call(null, e);
      return(f ? n ? m : n : f) ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, f), cljs.core.first.call(null, n), cljs.core.first.call(null, m)), a.call(null, b, cljs.core.rest.call(null, f), cljs.core.rest.call(null, n), cljs.core.rest.call(null, m))) : null
    }, null)
  }, e = function(b, c, d, e, f) {
    return a.call(null, function(a) {
      return cljs.core.apply.call(null, b, a)
    }, function m(b) {
      return new cljs.core.LazySeq(null, !1, function() {
        var c = a.call(null, cljs.core.seq, b);
        return cljs.core.every_QMARK_.call(null, cljs.core.identity, c) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), m.call(null, a.call(null, cljs.core.rest, c))) : null
      }, null)
    }.call(null, cljs.core.conj.call(null, f, e, d, c)))
  }, f = function(a, b, c, d, f) {
    var n = null;
    4 < arguments.length && (n = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
    return e.call(this, a, b, c, d, n)
  };
  f.cljs$lang$maxFixedArity = 4;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    return e(b, c, d, f, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, j);
      case 4:
        return d.call(this, a, e, j, k);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    if(0 < b) {
      var d = cljs.core.seq.call(null, c);
      return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, b - 1, cljs.core.rest.call(null, d))) : null
    }
    return null
  }, null)
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = 0 < a;
        return b ? c : b
      }())) {
        var g = a - 1, h = cljs.core.rest.call(null, c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  }, null)
};
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b)
  }, c = function(a, b) {
    return cljs.core.map.call(null, function(a) {
      return a
    }, b, cljs.core.drop.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if(d) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq.call(null, b);
      if(cljs.core.truth_(function() {
        var b = c;
        return b ? a.call(null, cljs.core.first.call(null, c)) : b
      }())) {
        var g = a, h = cljs.core.rest.call(null, c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c.call(null, a, b)
  }, null)
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, !1, function() {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null
  }, null)
};
cljs.core.split_at = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)], !0)
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b, a.call(null, b))
    }, null)
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b))
    }, null)
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
    return iterate.call(null, b, b.call(null, c))
  }, null))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq.call(null, b), h = cljs.core.seq.call(null, c);
      return(d ? h : d) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), cljs.core.cons.call(null, cljs.core.first.call(null, h), a.call(null, cljs.core.rest.call(null, d), cljs.core.rest.call(null, h)))) : null
    }, null)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
      return cljs.core.every_QMARK_.call(null, cljs.core.identity, h) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, h), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, h))) : null
    }, null)
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, a);
      return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.seq.call(null, e) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null
    }, null)
  }.call(null, null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function(a, b) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, b))
  }, c = function(a, b, c) {
    return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, c))
  }, d = function(a, b, d) {
    var h = null;
    2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return c.call(this, a, b, h)
  };
  d.cljs$lang$maxFixedArity = 2;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a));
    a = cljs.core.rest(cljs.core.next(a));
    return c(b, d, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, c);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for(var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if(h < f) {
            cljs.core.truth_(b.call(null, cljs.core._nth.call(null, e, h))) && cljs.core.chunk_append.call(null, g, cljs.core._nth.call(null, e, h)), h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), filter.call(null, b, cljs.core.chunk_rest.call(null, d)))
      }
      e = cljs.core.first.call(null, d);
      d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d)
    }
    return null
  }, null)
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null)
    }, null)
  }.call(null, c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return!cljs.core.sequential_QMARK_.call(null, a)
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  var c;
  a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 4) ? c : a.cljs$core$IEditableCollection$, c = c ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, a)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IEditableCollection, a);
  return c ? cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, a), b)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.mapv = function() {
  var a = null, b = function(a, b) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, c) {
      return cljs.core.conj_BANG_.call(null, b, a.call(null, c))
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b))
  }, c = function(a, b, c) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c))
  }, d = function(a, b, c, d) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c, d))
  }, e = function(a, b, c, d, e) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, a, b, c, d, e))
  }, f = function(a, b, c, d, f) {
    var n = null;
    4 < arguments.length && (n = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
    return e.call(this, a, b, c, d, n)
  };
  f.cljs$lang$maxFixedArity = 4;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), f = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(a))));
    return e(b, c, d, f, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, j);
      case 4:
        return d.call(this, a, e, j, k);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filterv = function(a, b) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, d) {
    return cljs.core.truth_(a.call(null, d)) ? cljs.core.conj_BANG_.call(null, b, d) : b
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b))
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq.call(null, d);
      if(h) {
        var j = cljs.core.take.call(null, b, h);
        return b === cljs.core.count.call(null, j) ? cljs.core.cons.call(null, j, a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null
      }
      return null
    }, null)
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, !1, function() {
      var j = cljs.core.seq.call(null, h);
      if(j) {
        var k = cljs.core.take.call(null, b, j);
        return b === cljs.core.count.call(null, k) ? cljs.core.cons.call(null, k, a.call(null, b, c, d, cljs.core.drop.call(null, c, j))) : cljs.core.list.call(null, cljs.core.take.call(null, b, cljs.core.concat.call(null, k, d)))
      }
      return null
    }, null)
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.get_in = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null)
  }, c = function(a, b, c) {
    var g = cljs.core.lookup_sentinel;
    for(b = cljs.core.seq.call(null, b);;) {
      if(b) {
        var h;
        if(h = a) {
          var j = void 0;
          j = (j = h.cljs$lang$protocol_mask$partition0$ & 256) ? j : h.cljs$core$ILookup$;
          h = j ? !0 : h.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.ILookup, h)
        }else {
          h = cljs.core.type_satisfies_.call(null, cljs.core.ILookup, h)
        }
        if(h) {
          a = cljs.core._lookup.call(null, a, cljs.core.first.call(null, b), g);
          if(g === a) {
            return c
          }
          b = cljs.core.next.call(null, b)
        }else {
          return c
        }
      }else {
        return a
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null);
  c = cljs.core.nthnext.call(null, c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core._lookup.call(null, b, e, null), c, d)) : cljs.core.assoc.call(null, b, e, d)
};
cljs.core.update_in = function() {
  var a = null, b = function(b, c, d) {
    var e = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core._lookup.call(null, b, e, null), c, d)) : cljs.core.assoc.call(null, b, e, d.call(null, cljs.core._lookup.call(null, b, e, null)))
  }, c = function(b, c, d, e) {
    var f = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, f, a.call(null, cljs.core._lookup.call(null, b, f, null), c, d, e)) : cljs.core.assoc.call(null, b, f, d.call(null, cljs.core._lookup.call(null, b, f, null), e))
  }, d = function(b, c, d, e, f) {
    var g = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, g, a.call(null, cljs.core._lookup.call(null, b, g, null), c, d, e, f)) : cljs.core.assoc.call(null, b, g, d.call(null, cljs.core._lookup.call(null, b, g, null), e, f))
  }, e = function(b, c, d, e, f, g) {
    var p = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, p, a.call(null, cljs.core._lookup.call(null, b, p, null), c, d, e, f, g)) : cljs.core.assoc.call(null, b, p, d.call(null, cljs.core._lookup.call(null, b, p, null), e, f, g))
  }, f = function(b, c, d, e, f, g, p) {
    var q = cljs.core.nth.call(null, c, 0, null);
    c = cljs.core.nthnext.call(null, c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, a, cljs.core._lookup.call(null, b, q, null), c, d, e, f, g, p)) : cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, d, cljs.core._lookup.call(null, b, q, null), e, f, g, p))
  }, g = function(a, b, c, d, e, g, p) {
    var q = null;
    6 < arguments.length && (q = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
    return f.call(this, a, b, c, d, e, g, q)
  };
  g.cljs$lang$maxFixedArity = 6;
  g.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), e = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))), p = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a))))));
    return f(b, c, d, e, g, p, a)
  };
  g.cljs$core$IFn$_invoke$arity$variadic = f;
  a = function(a, f, k, l, n, m, p) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, k);
      case 4:
        return c.call(this, a, f, k, l);
      case 5:
        return d.call(this, a, f, k, l, n);
      case 6:
        return e.call(this, a, f, k, l, n, m);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, f, k, l, n, m, cljs.core.array_seq(arguments, 6))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  a.cljs$core$IFn$_invoke$arity$6 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.VectorNode = function(a, b) {
  this.edit = a;
  this.arr = b
};
cljs.core.VectorNode.cljs$lang$type = !0;
cljs.core.VectorNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/VectorNode")
};
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/VectorNode")
};
cljs.core.pv_fresh_node = function(a) {
  return new cljs.core.VectorNode(a, cljs.core.make_array.call(null, 32))
};
cljs.core.pv_aget = function(a, b) {
  return a.arr[b]
};
cljs.core.pv_aset = function(a, b, c) {
  return a.arr[b] = c
};
cljs.core.pv_clone_node = function(a) {
  return new cljs.core.VectorNode(a.edit, a.arr.slice())
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >>> 5 << 5
};
cljs.core.new_path = function(a, b, c) {
  for(;;) {
    if(0 === b) {
      return c
    }
    var d = cljs.core.pv_fresh_node.call(null, a);
    cljs.core.pv_aset.call(null, d, 0, c);
    c = d;
    b -= 5
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.pv_clone_node.call(null, d), g = b.cnt - 1 >>> c & 31;
  5 === c ? cljs.core.pv_aset.call(null, f, g, e) : (d = cljs.core.pv_aget.call(null, d, g), b = null != d ? push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, null, c - 5, e), cljs.core.pv_aset.call(null, f, g, b));
  return f
};
cljs.core.array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off.call(null, a)) {
      return a.tail
    }
    c = a.root;
    for(var d = a.shift;;) {
      if(0 < d) {
        c = cljs.core.pv_aget.call(null, c, b >>> d & 31), d -= 5
      }else {
        return c.arr
      }
    }
  }else {
    throw Error([cljs.core.str("No item "), cljs.core.str(b), cljs.core.str(" in vector of length "), cljs.core.str(a.cnt)].join(""));
  }
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.pv_clone_node.call(null, d);
  if(0 === c) {
    cljs.core.pv_aset.call(null, g, e & 31, f)
  }else {
    var h = e >>> c & 31;
    cljs.core.pv_aset.call(null, g, h, do_assoc.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, h), e, f))
  }
  return g
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    d = cljs.core.pv_clone_node.call(null, d);
    cljs.core.pv_aset.call(null, d, e, b);
    return d
  }
  if(0 === e) {
    return null
  }
  d = cljs.core.pv_clone_node.call(null, d);
  cljs.core.pv_aset.call(null, d, e, null);
  return d
};
cljs.core.tv_editable_root = "undefined" != typeof cljs.core.tv_editable_root ? cljs.core.tv_editable_root : void 0;
cljs.core.tv_editable_tail = "undefined" != typeof cljs.core.tv_editable_tail ? cljs.core.tv_editable_tail : void 0;
cljs.core.TransientVector = "undefined" != typeof cljs.core.TransientVector ? cljs.core.TransientVector : void 0;
cljs.core.deref = "undefined" != typeof cljs.core.deref ? cljs.core.deref : void 0;
cljs.core.pr_sequential_writer = "undefined" != typeof cljs.core.pr_sequential_writer ? cljs.core.pr_sequential_writer : void 0;
cljs.core.pr_writer = "undefined" != typeof cljs.core.pr_writer ? cljs.core.pr_writer : void 0;
cljs.core.chunked_seq = "undefined" != typeof cljs.core.chunked_seq ? cljs.core.chunked_seq : void 0;
cljs.core.PersistentVector = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 167668511
};
cljs.core.PersistentVector.cljs$lang$type = !0;
cljs.core.PersistentVector.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function() {
  return new cljs.core.TransientVector(this.cnt, this.shift, cljs.core.tv_editable_root.call(null, this.root), cljs.core.tv_editable_tail.call(null, this.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  if(d) {
    return cljs.core.tail_off.call(null, a) <= b ? (a = this.tail.slice(), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a, null)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc.call(null, a, this.shift, this.root, b, c), this.tail, null)
  }
  if(b === this.cnt) {
    return a.cljs$core$ICollection$_conj$arity$2(a, c)
  }
  throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this.cnt), cljs.core.str("]")].join(""));
};
cljs.core.PersistentVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  c = [0, c];
  for(var d = 0;;) {
    if(d < this.cnt) {
      var e = cljs.core.array_for.call(null, a, d), f = e.length;
      a: {
        for(var g = 0, h = c[1];;) {
          if(g < f) {
            if(h = b.call(null, h, g + d, e[g]), cljs.core.reduced_QMARK_.call(null, h)) {
              e = h;
              break a
            }else {
              g += 1
            }
          }else {
            c[0] = f;
            e = c[1] = h;
            break a
          }
        }
        e = void 0
      }
      if(cljs.core.reduced_QMARK_.call(null, e)) {
        return cljs.core.deref.call(null, e)
      }
      d += c[0]
    }else {
      return c[1]
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if(32 > this.cnt - cljs.core.tail_off.call(null, a)) {
    var c = this.tail.slice();
    c.push(b);
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, c, null)
  }
  var d = this.cnt >>> 5 > 1 << this.shift, c = d ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.pv_fresh_node.call(null, null), cljs.core.pv_aset.call(null, d, 0, this.root), cljs.core.pv_aset.call(null, d, 1, cljs.core.new_path.call(null, null, this.shift, new cljs.core.VectorNode(null, this.tail)))) : d = cljs.core.push_tail.call(null, a, this.shift, this.root, new cljs.core.VectorNode(null, this.tail));
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b], null)
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? new cljs.core.RSeq(a, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 === this.cnt ? null : 32 > this.cnt ? cljs.core.array_seq.call(null, this.tail) : cljs.core.chunked_seq.call(null, a, 0, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? a.cljs$core$IIndexed$_nth$arity$2(a, this.cnt - 1) : null
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if(1 === this.cnt) {
    return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
  }
  if(1 < this.cnt - cljs.core.tail_off.call(null, a)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1), null)
  }
  var b = cljs.core.array_for.call(null, a, this.cnt - 2);
  a = cljs.core.pop_tail.call(null, a, this.shift, this.root);
  a = null == a ? cljs.core.PersistentVector.EMPTY_NODE : a;
  var c = this.cnt - 1, d;
  d = (d = 5 < this.shift) ? null == cljs.core.pv_aget.call(null, a, 1) : d;
  return d ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, cljs.core.pv_aget.call(null, a, 0), b, null) : new cljs.core.PersistentVector(this.meta, c, this.shift, a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail, this.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for.call(null, a, b)[b & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.PersistentVector.EMPTY_NODE = cljs.core.pv_fresh_node.call(null, null);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(a, b) {
  var c = a.length, d = b ? a : a.slice();
  if(32 > c) {
    return new cljs.core.PersistentVector(null, c, 5, cljs.core.PersistentVector.EMPTY_NODE, d, null)
  }
  for(var e = d.slice(0, 32), f = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, e, null), e = 32, g = cljs.core._as_transient.call(null, f);;) {
    if(e < c) {
      f = e + 1, g = cljs.core.conj_BANG_.call(null, g, d[e]), e = f
    }else {
      return cljs.core.persistent_BANG_.call(null, g)
    }
  }
};
cljs.core.vec = function(a) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), a))
};
cljs.core.vector = function() {
  var a = function(a) {
    return cljs.core.vec.call(null, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.ChunkedSeq = function(a, b, c, d, e, f) {
  this.vec = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 31719660;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedSeq.cljs$lang$type = !0;
cljs.core.ChunkedSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? null : a) : a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.node[this.off]
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? cljs.core.List.EMPTY : a) : a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function() {
  var a = this.node.length, a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? null : a
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function() {
  return cljs.core.array_chunk.call(null, this.node, this.off)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function() {
  var a = this.node.length, a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? cljs.core.List.EMPTY : a
};
cljs.core.chunked_seq = function() {
  var a = null, b = function(a, b, c) {
    return new cljs.core.ChunkedSeq(a, cljs.core.array_for.call(null, a, b), b, c, null, null)
  }, c = function(a, b, c, d) {
    return new cljs.core.ChunkedSeq(a, b, c, d, null, null)
  }, d = function(a, b, c, d, j) {
    return new cljs.core.ChunkedSeq(a, b, c, d, j, null)
  }, a = function(a, f, g, h, j) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, g);
      case 4:
        return c.call(this, a, f, g, h);
      case 5:
        return d.call(this, a, f, g, h, j)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a
}();
cljs.core.build_subvec = "undefined" != typeof cljs.core.build_subvec ? cljs.core.build_subvec : void 0;
cljs.core.Subvec = function(a, b, c, d, e) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32400159
};
cljs.core.Subvec.cljs$lang$type = !0;
cljs.core.Subvec.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Subvec")
};
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = this.start + b;
  return cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc.call(null, this.v, a, c), this.start, this.end > a + 1 ? this.end : a + 1, null)
};
cljs.core.Subvec.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Subvec.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  return function c(d) {
    return d === a.end ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, a.v, d), new cljs.core.LazySeq(null, !1, function() {
      return c.call(null, d + 1)
    }, null))
  }.call(null, a.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.end - this.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return cljs.core._nth.call(null, this.v, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  if(this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  return cljs.core.build_subvec.call(null, this.meta, this.v, this.start, this.end - 1, null)
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, b, this.v, this.start, this.end, this.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this.v, this.start + b)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this.v, this.start + b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.build_subvec = function(a, b, c, d, e) {
  var f = cljs.core.count.call(null, b);
  if(function() {
    var a = 0 > c;
    return a || (a = 0 > d) ? a : (a = c > f) ? a : d > f
  }()) {
    throw Error("Index out of bounds");
  }
  return new cljs.core.Subvec(a, b, c, d, e)
};
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.count.call(null, b))
  }, c = function(a, b, c) {
    return cljs.core.build_subvec.call(null, null, a, b, c, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.tv_ensure_editable = function(a, b) {
  return a === b.edit ? b : new cljs.core.VectorNode(a, b.arr.slice())
};
cljs.core.tv_editable_root = function(a) {
  return new cljs.core.VectorNode({}, a.arr.slice())
};
cljs.core.tv_editable_tail = function(a) {
  var b = cljs.core.make_array.call(null, 32);
  cljs.core.array_copy.call(null, a, 0, b, 0, a.length);
  return b
};
cljs.core.tv_push_tail = function tv_push_tail(b, c, d, e) {
  var f = cljs.core.tv_ensure_editable.call(null, b.root.edit, d), g = b.cnt - 1 >>> c & 31;
  cljs.core.pv_aset.call(null, f, g, 5 === c ? e : function() {
    var d = cljs.core.pv_aget.call(null, f, g);
    return null != d ? tv_push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, b.root.edit, c - 5, e)
  }());
  return f
};
cljs.core.tv_pop_tail = function tv_pop_tail(b, c, d) {
  d = cljs.core.tv_ensure_editable.call(null, b.root.edit, d);
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = tv_pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    cljs.core.pv_aset.call(null, d, e, b);
    return d
  }
  if(0 === e) {
    return null
  }
  cljs.core.pv_aset.call(null, d, e, null);
  return d
};
cljs.core.editable_array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off.call(null, a)) {
      return a.tail
    }
    for(var d = c = a.root, e = a.shift;;) {
      if(0 < e) {
        d = cljs.core.tv_ensure_editable.call(null, c.edit, cljs.core.pv_aget.call(null, d, b >>> e & 31)), e -= 5
      }else {
        return d.arr
      }
    }
  }else {
    throw Error([cljs.core.str("No item "), cljs.core.str(b), cljs.core.str(" in transient vector of length "), cljs.core.str(a.cnt)].join(""));
  }
};
cljs.core.TransientVector = function(a, b, c, d) {
  this.cnt = a;
  this.shift = b;
  this.root = c;
  this.tail = d;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88
};
cljs.core.TransientVector.cljs$lang$type = !0;
cljs.core.TransientVector.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/TransientVector")
};
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/TransientVector")
};
cljs.core.TransientVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(this.root.edit) {
    return cljs.core.array_for.call(null, a, b)[b & 31]
  }
  throw Error("nth after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  if(this.root.edit) {
    return this.cnt
  }
  throw Error("count after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if(d.root.edit) {
    var e;
    e = (e = 0 <= b) ? b < d.cnt : e;
    if(e) {
      return cljs.core.tail_off.call(null, a) <= b ? d.tail[b & 31] = c : (e = function g(a, e) {
        var k = cljs.core.tv_ensure_editable.call(null, d.root.edit, e);
        if(0 === a) {
          cljs.core.pv_aset.call(null, k, b & 31, c)
        }else {
          var l = b >>> a & 31;
          cljs.core.pv_aset.call(null, k, l, g.call(null, a - 5, cljs.core.pv_aget.call(null, k, l)))
        }
        return k
      }.call(null, d.shift, d.root), d.root = e), a
    }
    if(b === d.cnt) {
      return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, c)
    }
    throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(d.cnt)].join(""));
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(a) {
  if(this.root.edit) {
    if(0 === this.cnt) {
      throw Error("Can't pop empty vector");
    }
    if(1 === this.cnt) {
      this.cnt = 0
    }else {
      if(0 < (this.cnt - 1 & 31)) {
        this.cnt -= 1
      }else {
        var b = cljs.core.editable_array_for.call(null, a, this.cnt - 2), c;
        c = cljs.core.tv_pop_tail.call(null, a, this.shift, this.root);
        c = null != c ? c : new cljs.core.VectorNode(this.root.edit, cljs.core.make_array.call(null, 32));
        var d;
        d = (d = 5 < this.shift) ? null == cljs.core.pv_aget.call(null, c, 1) : d;
        d ? (this.root = cljs.core.tv_ensure_editable.call(null, this.root.edit, cljs.core.pv_aget.call(null, c, 0)), this.shift -= 5) : this.root = c;
        this.cnt -= 1;
        this.tail = b
      }
    }
    return a
  }
  throw Error("pop! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(this.root.edit) {
    if(32 > this.cnt - cljs.core.tail_off.call(null, a)) {
      this.tail[this.cnt & 31] = b
    }else {
      var c = new cljs.core.VectorNode(this.root.edit, this.tail), d = cljs.core.make_array.call(null, 32);
      d[0] = b;
      this.tail = d;
      if(this.cnt >>> 5 > 1 << this.shift) {
        var d = cljs.core.make_array.call(null, 32), e = this.shift + 5;
        d[0] = this.root;
        d[1] = cljs.core.new_path.call(null, this.root.edit, this.shift, c);
        this.root = new cljs.core.VectorNode(this.root.edit, d);
        this.shift = e
      }else {
        this.root = cljs.core.tv_push_tail.call(null, a, this.shift, this.root, c)
      }
    }
    this.cnt += 1;
    return a
  }
  throw Error("conj! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if(this.root.edit) {
    this.root.edit = null;
    a = this.cnt - cljs.core.tail_off.call(null, a);
    var b = cljs.core.make_array.call(null, a);
    cljs.core.array_copy.call(null, this.tail, 0, b, 0, a);
    return new cljs.core.PersistentVector(null, this.cnt, this.shift, this.root, b, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.PersistentQueueSeq = function(a, b, c, d) {
  this.meta = a;
  this.front = b;
  this.rear = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.PersistentQueueSeq.cljs$lang$type = !0;
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  var b = cljs.core.next.call(null, this.front);
  return b ? new cljs.core.PersistentQueueSeq(this.meta, b, this.rear, null) : null == this.rear ? a.cljs$core$IEmptyableCollection$_empty$arity$1(a) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null, null)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.PersistentQueue = function(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31858766
};
cljs.core.PersistentQueue.cljs$lang$type = !0;
cljs.core.PersistentQueue.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.EMPTY
  }(), b), null) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.PersistentVector.EMPTY, null)
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this, b = cljs.core.seq.call(null, a.rear);
  return cljs.core.truth_(function() {
    var c = a.front;
    return cljs.core.truth_(c) ? c : b
  }()) ? new cljs.core.PersistentQueueSeq(null, a.front, cljs.core.seq.call(null, b), null) : null
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return cljs.core._first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear, null) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.PersistentVector.EMPTY, null) : a
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.first.call(null, this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, a))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152
};
cljs.core.NeverEquiv.cljs$lang$type = !0;
cljs.core.NeverEquiv.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function() {
  return!1
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, b) ? cljs.core.count.call(null, a) === cljs.core.count.call(null, b) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core._lookup.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(e < d) {
      if(b === c[e]) {
        return e
      }
      e += a
    }else {
      return null
    }
  }
};
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return c < d ? -1 : c > d ? 1 : 0
};
cljs.core.obj_map__GT_hash_map = function(a, b, c) {
  var d = a.keys, e = d.length, f = a.strobj;
  a = cljs.core.meta.call(null, a);
  for(var g = 0, h = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if(g < e) {
      var j = d[g], g = g + 1, h = cljs.core.assoc_BANG_.call(null, h, j, f[j])
    }else {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, h, b, c)), a)
    }
  }
};
cljs.core.obj_clone = function(a, b) {
  for(var c = {}, d = b.length, e = 0;;) {
    if(e < d) {
      var f = b[e];
      c[f] = a[f];
      e += 1
    }else {
      break
    }
  }
  return c
};
cljs.core.ObjMap = function(a, b, c, d, e) {
  this.meta = a;
  this.keys = b;
  this.strobj = c;
  this.update_count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.ObjMap.cljs$lang$type = !0;
cljs.core.ObjMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ObjMap")
};
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.hash_map.call(null), a))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = (a = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : a;
  return a ? this.strobj[b] : c
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(goog.isString(b)) {
    var d;
    d = (d = this.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD) ? d : this.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD;
    if(d) {
      return cljs.core.obj_map__GT_hash_map.call(null, a, b, c)
    }
    if(null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
      return a = cljs.core.obj_clone.call(null, this.strobj, this.keys), a[b] = c, new cljs.core.ObjMap(this.meta, this.keys, a, this.update_count + 1, null)
    }
    a = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    d = this.keys.slice();
    a[b] = c;
    d.push(b);
    return new cljs.core.ObjMap(this.meta, d, a, this.update_count + 1, null)
  }
  return cljs.core.obj_map__GT_hash_map.call(null, a, b, c)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : c;
  return c ? !0 : !1
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ObjMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  for(a = this.keys.sort(cljs.core.obj_map_compare_keys);;) {
    if(cljs.core.seq.call(null, a)) {
      var d = cljs.core.first.call(null, a);
      c = b.call(null, c, d, this.strobj[d]);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      a = cljs.core.rest.call(null, a)
    }else {
      return c
    }
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  return 0 < a.keys.length ? cljs.core.map.call(null, function(b) {
    return cljs.core.vector.call(null, b, a.strobj[b])
  }, a.keys.sort(cljs.core.obj_map_compare_keys)) : null
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj, this.update_count, this.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array.call(null, 1, b, this.keys) : c;
  if(c) {
    c = this.keys.slice();
    var d = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    c.splice(cljs.core.scan_array.call(null, 1, b, c), 1);
    cljs.core.js_delete.call(null, d, b);
    return new cljs.core.ObjMap(this.meta, c, d, this.update_count + 1, null)
  }
  return a
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], {}, 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b, 0, null)
};
cljs.core.HashMap = function(a, b, c, d) {
  this.meta = a;
  this.count = b;
  this.hashobj = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 15075087
};
cljs.core.HashMap.cljs$lang$type = !0;
cljs.core.HashMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/HashMap")
};
cljs.core.HashMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/HashMap")
};
cljs.core.HashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.hashobj[cljs.core.hash.call(null, b)];
  b = cljs.core.truth_(a) ? cljs.core.scan_array.call(null, 2, b, a) : null;
  return cljs.core.truth_(b) ? a[b + 1] : c
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.hash.call(null, b);
  var d = this.hashobj[a];
  if(cljs.core.truth_(d)) {
    var d = d.slice(), e = goog.object.clone(this.hashobj);
    e[a] = d;
    a = cljs.core.scan_array.call(null, 2, b, d);
    if(cljs.core.truth_(a)) {
      return d[a + 1] = c, new cljs.core.HashMap(this.meta, this.count, e, null)
    }
    d.push(b, c);
    return new cljs.core.HashMap(this.meta, this.count + 1, e, null)
  }
  e = goog.object.clone(this.hashobj);
  e[a] = [b, c];
  return new cljs.core.HashMap(this.meta, this.count + 1, e, null)
};
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  var c = this.hashobj[cljs.core.hash.call(null, b)], c = cljs.core.truth_(c) ? cljs.core.scan_array.call(null, 2, b, c) : null;
  return cljs.core.truth_(c) ? !0 : !1
};
cljs.core.HashMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.HashMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.HashMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  if(0 < a.count) {
    var b = cljs.core.js_keys.call(null, a.hashobj).sort();
    return cljs.core.mapcat.call(null, function(b) {
      return cljs.core.map.call(null, cljs.core.vec, cljs.core.partition.call(null, 2, a.hashobj[b]))
    }, b)
  }
  return null
};
cljs.core.HashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.count
};
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.HashMap(b, this.count, this.hashobj, this.__hash)
};
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.HashMap.EMPTY, this.meta)
};
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = cljs.core.hash.call(null, b), d = this.hashobj[c], e = cljs.core.truth_(d) ? cljs.core.scan_array.call(null, 2, b, d) : null;
  if(cljs.core.not.call(null, e)) {
    return a
  }
  var f = goog.object.clone(this.hashobj);
  3 > d.length ? cljs.core.js_delete.call(null, f, c) : (d = d.slice(), d.splice(e, 2), f[c] = d);
  return new cljs.core.HashMap(this.meta, this.count - 1, f, null)
};
cljs.core.HashMap.EMPTY = new cljs.core.HashMap(null, 0, {}, 0);
cljs.core.HashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.HashMap.EMPTY;;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc.call(null, e, a[d], b[d]), d = f
    }else {
      return e
    }
  }
};
cljs.core.equiv_nil = function(a, b) {
  return null == b
};
cljs.core.equiv_pred = function(a) {
  return goog.isString(a) ? cljs.core.identical_QMARK_ : null == a ? cljs.core.equiv_nil : cljs.core.number_QMARK_.call(null, a) ? cljs.core.identical_QMARK_ : cljs.core._EQ_
};
cljs.core.array_map_index_of = function(a, b) {
  for(var c = a.arr, d = c.length, e = cljs.core.equiv_pred.call(null, b), f = 0;;) {
    if(d <= f) {
      return-1
    }
    if(e.call(null, b, c[f])) {
      return f
    }
    f += 2
  }
};
cljs.core.array_map_extend_kv = function(a, b, c) {
  a = a.arr;
  for(var d = a.length, e = cljs.core.make_array.call(null, d + 2), f = 0;;) {
    if(f < d) {
      e[f] = a[f], f += 1
    }else {
      break
    }
  }
  e[d] = b;
  e[d + 1] = c;
  return e
};
cljs.core.TransientArrayMap = "undefined" != typeof cljs.core.TransientArrayMap ? cljs.core.TransientArrayMap : void 0;
cljs.core.PersistentArrayMap = function(a, b, c, d) {
  this.meta = a;
  this.cnt = b;
  this.arr = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentArrayMap.cljs$lang$type = !0;
cljs.core.PersistentArrayMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function() {
  return new cljs.core.TransientArrayMap({}, this.arr.length, this.arr.slice())
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, a, b);
  return-1 === a ? c : this.arr[a + 1]
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = cljs.core.array_map_index_of.call(null, a, b);
  if(-1 === d) {
    return this.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? new cljs.core.PersistentArrayMap(this.meta, this.cnt + 1, cljs.core.array_map_extend_kv.call(null, a, b, c), null) : cljs.core._with_meta.call(null, cljs.core._assoc.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, a), b, c), this.meta)
  }
  if(c === this.arr[d + 1]) {
    return a
  }
  a = cljs.core.PersistentArrayMap;
  b = this.meta;
  var e = this.cnt, f = this.arr.slice();
  f[d + 1] = c;
  return new a(b, e, f, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return-1 !== cljs.core.array_map_index_of.call(null, a, b)
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentArrayMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.arr.length;
  for(var d = 0;;) {
    if(d < a) {
      c = b.call(null, c, this.arr[d], this.arr[d + 1]);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      d += 2
    }else {
      return c
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  var a = this;
  if(0 < a.cnt) {
    var b = a.arr.length;
    return function d(e) {
      return new cljs.core.LazySeq(null, !1, function() {
        return e < b ? cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([a.arr[e], a.arr[e + 1]], !0), d.call(null, e + 2)) : null
      }, null)
    }.call(null, 0)
  }
  return null
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMap(b, this.cnt, this.arr, this.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(0 <= cljs.core.array_map_index_of.call(null, a, b)) {
    var c = this.arr.length, d = c - 2;
    if(0 === d) {
      return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
    }
    for(var d = cljs.core.make_array.call(null, d), e = 0, f = 0;;) {
      if(e >= c) {
        return new cljs.core.PersistentArrayMap(this.meta, this.cnt - 1, d, null)
      }
      cljs.core._EQ_.call(null, b, this.arr[e]) || (d[f] = this.arr[e], d[f + 1] = this.arr[e + 1], f += 2);
      e += 2
    }
  }else {
    return a
  }
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(a, b) {
  var c = b ? a : a.slice();
  return new cljs.core.PersistentArrayMap(null, c.length / 2, c, null)
};
cljs.core.array__GT_transient_hash_map = "undefined" != typeof cljs.core.array__GT_transient_hash_map ? cljs.core.array__GT_transient_hash_map : void 0;
cljs.core.TransientArrayMap = function(a, b, c) {
  this.editable_QMARK_ = a;
  this.len = b;
  this.arr = c;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientArrayMap.cljs$lang$type = !0;
cljs.core.TransientArrayMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c = cljs.core.array_map_index_of.call(null, a, b);
    0 <= c && (this.arr[c] = this.arr[this.len - 2], this.arr[c + 1] = this.arr[this.len - 1], c = this.arr, c.pop(), c.pop(), this.len -= 2);
    return a
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var d = cljs.core.array_map_index_of.call(null, a, b);
    if(-1 === d) {
      return this.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (this.len += 2, this.arr.push(b), this.arr.push(c), a) : cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this.len, this.arr), b, c)
    }
    c !== this.arr[d + 1] && (this.arr[d + 1] = c);
    return a
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 2048) ? c : b.cljs$core$IMapEntry$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, b);
    if(c) {
      return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, cljs.core.key.call(null, b), cljs.core.val.call(null, b))
    }
    c = cljs.core.seq.call(null, b);
    for(var d = a;;) {
      var e = cljs.core.first.call(null, c);
      if(cljs.core.truth_(e)) {
        c = cljs.core.next.call(null, c), d = d.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(d, cljs.core.key.call(null, e), cljs.core.val.call(null, e))
      }else {
        return d
      }
    }
  }else {
    throw Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function() {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return this.editable_QMARK_ = !1, new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this.len, 2), this.arr, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return a = cljs.core.array_map_index_of.call(null, a, b), -1 === a ? c : this.arr[a + 1]
  }
  throw Error("lookup after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return cljs.core.quot.call(null, this.len, 2)
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap = "undefined" != typeof cljs.core.TransientHashMap ? cljs.core.TransientHashMap : void 0;
cljs.core.array__GT_transient_hash_map = function(a, b) {
  for(var c = cljs.core.transient$.call(null, cljs.core.ObjMap.EMPTY), d = 0;;) {
    if(d < a) {
      c = cljs.core.assoc_BANG_.call(null, c, b[d], b[d + 1]), d += 2
    }else {
      return c
    }
  }
};
cljs.core.Box = function(a) {
  this.val = a
};
cljs.core.Box.cljs$lang$type = !0;
cljs.core.Box.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Box")
};
cljs.core.Box.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Box")
};
cljs.core.create_inode_seq = "undefined" != typeof cljs.core.create_inode_seq ? cljs.core.create_inode_seq : void 0;
cljs.core.create_array_node_seq = "undefined" != typeof cljs.core.create_array_node_seq ? cljs.core.create_array_node_seq : void 0;
cljs.core.reset_BANG_ = "undefined" != typeof cljs.core.reset_BANG_ ? cljs.core.reset_BANG_ : void 0;
cljs.core.create_node = "undefined" != typeof cljs.core.create_node ? cljs.core.create_node : void 0;
cljs.core.atom = "undefined" != typeof cljs.core.atom ? cljs.core.atom : void 0;
cljs.core.deref = "undefined" != typeof cljs.core.deref ? cljs.core.deref : void 0;
cljs.core.key_test = function(a, b) {
  return goog.isString(a) ? a === b : cljs.core._EQ_.call(null, a, b)
};
cljs.core.mask = function(a, b) {
  return a >>> b & 31
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = a.slice();
    a[b] = c;
    return a
  }, c = function(a, b, c, g, h) {
    a = a.slice();
    a[b] = c;
    a[g] = h;
    return a
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.remove_pair = function(a, b) {
  var c = cljs.core.make_array.call(null, a.length - 2);
  cljs.core.array_copy.call(null, a, 0, c, 0, 2 * b);
  cljs.core.array_copy.call(null, a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count.call(null, a & b - 1)
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31)
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a
  }, c = function(a, b, c, g, h, j) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = j;
    return a
  }, a = function(a, e, f, g, h, j) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, j)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$4 = b;
  a.cljs$core$IFn$_invoke$arity$6 = c;
  return a
}();
cljs.core.inode_kv_reduce = function(a, b, c) {
  for(var d = a.length, e = 0;;) {
    if(e < d) {
      var f = a[e];
      null != f ? c = b.call(null, c, f, a[e + 1]) : (f = a[e + 1], c = null != f ? f.kv_reduce(b, c) : c);
      if(cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c)
      }
      e += 2
    }else {
      return c
    }
  }
};
cljs.core.ArrayNode = "undefined" != typeof cljs.core.ArrayNode ? cljs.core.ArrayNode : void 0;
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c
};
cljs.core.BitmapIndexedNode.cljs$lang$type = !0;
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if(this.bitmap === b) {
    return null
  }
  a = this.ensure_editable(a);
  var d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy.call(null, d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, g);
  if(0 === (this.bitmap & g)) {
    var j = cljs.core.bit_count.call(null, this.bitmap);
    if(2 * j < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f.val = !0, cljs.core.array_copy_downward.call(null, b, 2 * h, b, 2 * (h + 1), 2 * (j - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a
    }
    if(16 <= j) {
      h = cljs.core.make_array.call(null, 32);
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for(e = d = 0;;) {
        if(32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.call(null, this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(a, j + 1, h)
    }
    b = cljs.core.make_array.call(null, 2 * (j + 4));
    cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * h);
    b[2 * h] = d;
    b[2 * h + 1] = e;
    cljs.core.array_copy.call(null, this.arr, 2 * h, b, 2 * (h + 1), 2 * (j - h));
    f.val = !0;
    a = this.ensure_editable(a);
    a.arr = b;
    a.bitmap |= g;
    return a
  }
  j = this.arr[2 * h];
  g = this.arr[2 * h + 1];
  if(null == j) {
    return j = g.inode_assoc_BANG_(a, b + 5, c, d, e, f), j === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, j)
  }
  if(cljs.core.key_test.call(null, d, j)) {
    return e === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, e)
  }
  f.val = !0;
  return cljs.core.edit_and_set.call(null, this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.call(null, a, b + 5, j, g, c, d, e))
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if(0 === (this.bitmap & f)) {
    return this
  }
  var g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f), h = this.arr[2 * g], j = this.arr[2 * g + 1];
  return null == h ? (b = j.inode_without_BANG_(a, b + 5, c, d, e), b === j ? this : null != b ? cljs.core.edit_and_set.call(null, this, a, 2 * g + 1, b) : this.bitmap === f ? null : this.edit_and_remove_pair(a, f, g)) : cljs.core.key_test.call(null, d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : this
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = cljs.core.bit_count.call(null, this.bitmap), c = cljs.core.make_array.call(null, 0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy.call(null, this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c)
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_find(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? cljs.core.PersistentVector.fromArray([e, f], !0) : d
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & d)) {
    return this
  }
  var e = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e))) : cljs.core.key_test.call(null, c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e)) : this
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f);
  if(0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count.call(null, this.bitmap);
    if(16 <= h) {
      g = cljs.core.make_array.call(null, 32);
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for(d = c = 0;;) {
        if(32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.call(null, this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g)
    }
    a = cljs.core.make_array.call(null, 2 * (h + 1));
    cljs.core.array_copy.call(null, this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    cljs.core.array_copy.call(null, this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    e.val = !0;
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a)
  }
  h = this.arr[2 * g];
  f = this.arr[2 * g + 1];
  if(null == h) {
    return h = f.inode_assoc(a + 5, b, c, d, e), h === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, h))
  }
  if(cljs.core.key_test.call(null, c, h)) {
    return d === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, d))
  }
  e.val = !0;
  return new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.call(null, a + 5, h, f, b, c, d)))
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_lookup(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? f : d
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, cljs.core.make_array.call(null, 0));
cljs.core.pack_array_node = function(a, b, c) {
  var d = a.arr;
  a = 2 * (a.cnt - 1);
  for(var e = cljs.core.make_array.call(null, a), f = 0, g = 1, h = 0;;) {
    if(f < a) {
      var j;
      j = (j = f !== c) ? null != d[f] : j;
      j && (e[g] = d[f], g += 2, h |= 1 << f);
      f += 1
    }else {
      return new cljs.core.BitmapIndexedNode(b, h, e)
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c
};
cljs.core.ArrayNode.cljs$lang$type = !0;
cljs.core.ArrayNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if(null == h) {
    return a = cljs.core.edit_and_set.call(null, this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.call(null, this, a, g, b)
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.call(null, this.arr)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if(null == g) {
    return this
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if(b === g) {
    return this
  }
  if(null == b) {
    if(8 >= this.cnt) {
      return cljs.core.pack_array_node.call(null, this, a, f)
    }
    a = cljs.core.edit_and_set.call(null, this, a, f, b);
    a.cnt -= 1;
    return a
  }
  return cljs.core.edit_and_set.call(null, this, a, f, b)
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, this.arr.slice())
};
cljs.core.ArrayNode.prototype.kv_reduce = function(a, b) {
  for(var c = this.arr.length, d = 0, e = b;;) {
    if(d < c) {
      var f = this.arr[d];
      if(null != f && (e = f.kv_reduce(a, e), cljs.core.reduced_QMARK_.call(null, e))) {
        return cljs.core.deref.call(null, e)
      }
      d += 1
    }else {
      return e
    }
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_find(a + 5, b, c, d) : d
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null == a ? 8 >= this.cnt ? cljs.core.pack_array_node.call(null, this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.call(null, this.arr, d, a)) : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, d, a))) : this
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if(null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.call(null, this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)))
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, f, a))
};
cljs.core.ArrayNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_lookup(a + 5, b, c, d) : d
};
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  b *= 2;
  for(var d = 0;;) {
    if(d < b) {
      if(cljs.core.key_test.call(null, c, a[d])) {
        return d
      }
      d += 2
    }else {
      return-1
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.collision_hash = b;
  this.cnt = c;
  this.arr = d
};
cljs.core.HashCollisionNode.cljs$lang$type = !0;
cljs.core.HashCollisionNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if(c === this.collision_hash) {
    b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
    if(-1 === b) {
      if(this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.call(null, this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f.val = !0, a.cnt += 1, a
      }
      b = this.arr.length;
      c = cljs.core.make_array.call(null, b + 2);
      cljs.core.array_copy.call(null, this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f.val = !0;
      return this.ensure_editable_array(a, this.cnt + 1, c)
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.call(null, this, a, b + 1, e)
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.collision_hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f)
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
  if(-1 === b) {
    return this
  }
  e[0] = !0;
  if(1 === this.cnt) {
    return null
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = cljs.core.make_array.call(null, 2 * (this.cnt + 1));
  cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * this.cnt);
  return new cljs.core.HashCollisionNode(a, this.collision_hash, this.cnt, b)
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b)
};
cljs.core.HashCollisionNode.prototype.inode_find = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? cljs.core.PersistentVector.fromArray([this.arr[a], this.arr[a + 1]], !0) : d
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt - 1, cljs.core.remove_pair.call(null, this.arr, cljs.core.quot.call(null, a, 2)))
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.collision_hash ? (a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), -1 === a ? (a = this.arr.length, b = cljs.core.make_array.call(null, a + 2), cljs.core.array_copy.call(null, this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.val = !0, new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt + 1, b)) : cljs.core._EQ_.call(null, this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt, cljs.core.clone_and_set.call(null, 
  this.arr, a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.collision_hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e)
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? this.arr[a + 1] : d
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(a, b, c) {
  return a === this.edit ? (this.arr = c, this.cnt = b, this) : new cljs.core.HashCollisionNode(this.edit, this.collision_hash, b, c)
};
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, j) {
    var k = cljs.core.hash.call(null, b);
    if(k === g) {
      return new cljs.core.HashCollisionNode(null, k, 2, [b, c, h, j])
    }
    var l = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, k, b, c, l).inode_assoc(a, g, h, j, l)
  }, c = function(a, b, c, g, h, j, k) {
    var l = cljs.core.hash.call(null, c);
    if(l === h) {
      return new cljs.core.HashCollisionNode(null, l, 2, [c, g, j, k])
    }
    var n = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, l, c, g, n).inode_assoc_BANG_(a, b, h, j, k, n)
  }, a = function(a, e, f, g, h, j, k) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, j);
      case 7:
        return c.call(this, a, e, f, g, h, j, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$6 = b;
  a.cljs$core$IFn$_invoke$arity$7 = c;
  return a
}();
cljs.core.NodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.NodeSeq.cljs$lang$type = !0;
cljs.core.NodeSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.NodeSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return null == this.s ? cljs.core.PersistentVector.fromArray([this.nodes[this.i], this.nodes[this.i + 1]], !0) : cljs.core.first.call(null, this.s)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return null == this.s ? cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0, null)
  }, c = function(a, b, c) {
    if(null == c) {
      for(c = a.length;;) {
        if(b < c) {
          if(null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null, null)
          }
          var g = a[b + 1];
          if(cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g, null)
          }
          b += 2
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.NodeSeq(null, a, b, c, null)
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.ArrayNodeSeq.cljs$lang$type = !0;
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.first.call(null, this.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  return cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next.call(null, this.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b, 0, null)
  }, c = function(a, b, c, g) {
    if(null == g) {
      for(g = b.length;;) {
        if(c < g) {
          var h = b[c];
          if(cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h, null)
          }
          c += 1
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g, null)
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.TransientHashMap = "undefined" != typeof cljs.core.TransientHashMap ? cljs.core.TransientHashMap : void 0;
cljs.core.PersistentHashMap = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentHashMap.cljs$lang$type = !0;
cljs.core.PersistentHashMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function() {
  return new cljs.core.TransientHashMap({}, this.root, this.cnt, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(null == b) {
    var d;
    d = (d = this.has_nil_QMARK_) ? c === this.nil_val : d;
    return d ? a : new cljs.core.PersistentHashMap(this.meta, this.has_nil_QMARK_ ? this.cnt : this.cnt + 1, this.root, !0, c, null)
  }
  d = new cljs.core.Box(!1);
  c = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc(0, cljs.core.hash.call(null, b), b, c, d);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, d.val ? this.cnt + 1 : this.cnt, c, this.has_nil_QMARK_, this.nil_val, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ : null == this.root ? !1 : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, cljs.core.lookup_sentinel) !== cljs.core.lookup_sentinel
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.has_nil_QMARK_ ? b.call(null, c, null, this.nil_val) : c;
  return cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : null != this.root ? this.root.kv_reduce(b, a) : a
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  if(0 < this.cnt) {
    var a = null != this.root ? this.root.inode_seq() : null;
    return this.has_nil_QMARK_ ? cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([null, this.nil_val], !0), a) : a
  }
  return null
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(null == b) {
    return this.has_nil_QMARK_ ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null, null) : a
  }
  if(null == this.root) {
    return a
  }
  var c = this.root.inode_without(0, cljs.core.hash.call(null, b), b);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val, null)
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc_BANG_.call(null, e, a[d], b[d]), d = f
    }else {
      return cljs.core.persistent_BANG_.call(null, e)
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientHashMap.cljs$lang$type = !0;
cljs.core.TransientHashMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  return a.without_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.assoc_BANG_(b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return a.conj_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return a.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : null : null == this.root ? null : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  if(this.edit) {
    return this.count
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if(this.edit) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 2048) ? b : a.cljs$core$IMapEntry$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, a)) : b = cljs.core.type_satisfies_.call(null, cljs.core.IMapEntry, a);
    if(b) {
      return this.assoc_BANG_(cljs.core.key.call(null, a), cljs.core.val.call(null, a))
    }
    a = cljs.core.seq.call(null, a);
    for(b = this;;) {
      var c = cljs.core.first.call(null, a);
      if(cljs.core.truth_(c)) {
        a = cljs.core.next.call(null, a), b = b.assoc_BANG_(cljs.core.key.call(null, c), cljs.core.val.call(null, c))
      }else {
        return b
      }
    }
  }else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if(this.edit) {
    if(null == a) {
      this.nil_val !== b && (this.nil_val = b), this.has_nil_QMARK_ || (this.count += 1, this.has_nil_QMARK_ = !0)
    }else {
      var c = new cljs.core.Box(!1), d = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b, c);
      d !== this.root && (this.root = d);
      c.val && (this.count += 1)
    }
    return this
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if(this.edit) {
    if(null == a) {
      this.has_nil_QMARK_ && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1)
    }else {
      if(null != this.root) {
        var b = new cljs.core.Box(!1);
        a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1)
      }
    }
    return this
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if(this.edit) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.tree_map_seq_push = function(a, b, c) {
  for(var d = b;;) {
    if(null != a) {
      b = c ? a.left : a.right, d = cljs.core.conj.call(null, d, a), a = b
    }else {
      return d
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = !0;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count.call(null, cljs.core.next.call(null, a)) + 1 : this.cnt
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return cljs.core.peek.call(null, this.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function() {
  var a = cljs.core.first.call(null, this.stack), a = cljs.core.tree_map_seq_push.call(null, this.ascending_QMARK_ ? a.right : a.left, cljs.core.next.call(null, this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt, this.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, a, null, b), b, c, null)
};
cljs.core.RedNode = "undefined" != typeof cljs.core.RedNode ? cljs.core.RedNode : void 0;
cljs.core.BlackNode = "undefined" != typeof cljs.core.BlackNode ? cljs.core.BlackNode : void 0;
cljs.core.balance_left = function(a, b, c, d) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c) ? cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c.left) ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d, null), null) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c.right) ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left, null), new cljs.core.BlackNode(a, b, c.right.right, d, null), null) : new cljs.core.BlackNode(a, 
  b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_right = function(a, b, c, d) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d.right) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left, null), d.right.blacken(), null) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d.left) ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right, null), null) : new cljs.core.BlackNode(a, 
  b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
    return new cljs.core.RedNode(a, b, c.blacken(), d, null)
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, d)) {
    return cljs.core.balance_right.call(null, a, b, c, d.redden())
  }
  var e;
  e = (e = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d)) ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, d.left) : e;
  if(e) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), cljs.core.balance_right.call(null, d.key, d.val, d.left.right, d.right.redden()), null)
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d)) {
    return new cljs.core.RedNode(a, b, c, d.blacken(), null)
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c)) {
    return cljs.core.balance_left.call(null, a, b, c.redden(), d)
  }
  var e;
  e = (e = cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.right) : e;
  if(e) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left.call(null, c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d, null), null)
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(b, c, d) {
  d = null != b.left ? tree_map_kv_reduce.call(null, b.left, c, d) : d;
  if(cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d)
  }
  d = c.call(null, d, b.key, b.val);
  if(cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d)
  }
  b = null != b.right ? tree_map_kv_reduce.call(null, b.right, c, d) : d;
  return cljs.core.reduced_QMARK_.call(null, b) ? cljs.core.deref.call(null, b) : b
};
cljs.core.BlackNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.BlackNode.cljs$lang$type = !0;
cljs.core.BlackNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/BlackNode")
};
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.BlackNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function() {
  return this.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function() {
  return this.val
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this)
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del.call(null, this.key, this.val, this.left, a)
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b)
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del.call(null, this.key, this.val, a, this.right)
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this)
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right, null)
};
cljs.core.BlackNode.prototype.toString = function() {
  return function() {
    switch(arguments.length) {
      case 0:
        return cljs.core.pr_str.call(null, this)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.RedNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.RedNode.cljs$lang$type = !0;
cljs.core.RedNode.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/RedNode")
};
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.RedNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function() {
  return this.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function() {
  return this.val
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b)
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.left) ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right, null), null) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.right) ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left, null), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right, null), null) : new cljs.core.BlackNode(a.key, 
  a.val, this, a.right, null)
};
cljs.core.RedNode.prototype.toString = function() {
  return function() {
    switch(arguments.length) {
      case 0:
        return cljs.core.pr_str.call(null, this)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.RedNode.prototype.balance_right = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.right) ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left, null), this.right.blacken(), null) : cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, this.left) ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left, null), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right, null), null) : new cljs.core.BlackNode(a.key, 
  a.val, a.left, this, null)
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.list.call(null, this.key, this.val)
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function() {
  return this.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function() {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if(null == c) {
    return new cljs.core.RedNode(d, e, null, null, null)
  }
  var g = b.call(null, d, c.key);
  if(0 === g) {
    return f[0] = c, null
  }
  if(0 > g) {
    return b = tree_map_add.call(null, b, c.left, d, e, f), null != b ? c.add_left(b) : null
  }
  b = tree_map_add.call(null, b, c.right, d, e, f);
  return null != b ? c.add_right(b) : null
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if(null == b) {
    return c
  }
  if(null == c) {
    return b
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, b)) {
    if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
      var d = tree_map_append.call(null, b.right, c.left);
      return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left, null), new cljs.core.RedNode(c.key, c.val, d.right, c.right, null), null) : new cljs.core.RedNode(b.key, b.val, b.left, new cljs.core.RedNode(c.key, c.val, d, c.right, null), null)
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append.call(null, b.right, c), null)
  }
  if(cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, c)) {
    return new cljs.core.RedNode(c.key, c.val, tree_map_append.call(null, b, c.left), c.right, null)
  }
  d = tree_map_append.call(null, b.right, c.left);
  return cljs.core.instance_QMARK_.call(null, cljs.core.RedNode, d) ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left, null), new cljs.core.BlackNode(c.key, c.val, d.right, c.right, null), null) : cljs.core.balance_left_del.call(null, b.key, b.val, b.left, new cljs.core.BlackNode(c.key, c.val, d, c.right, null))
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if(null != c) {
    var f = b.call(null, d, c.key);
    if(0 === f) {
      return e[0] = c, cljs.core.tree_map_append.call(null, c.left, c.right)
    }
    if(0 > f) {
      return b = tree_map_remove.call(null, b, c.left, d, e), e = (d = null != b) ? d : null != e[0], e ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.left) ? cljs.core.balance_left_del.call(null, c.key, c.val, b, c.right) : new cljs.core.RedNode(c.key, c.val, b, c.right, null) : null
    }
    b = tree_map_remove.call(null, b, c.right, d, e);
    e = (d = null != b) ? d : null != e[0];
    return e ? cljs.core.instance_QMARK_.call(null, cljs.core.BlackNode, c.right) ? cljs.core.balance_right_del.call(null, c.key, c.val, c.left, b) : new cljs.core.RedNode(c.key, c.val, c.left, b, null) : null
  }
  return null
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace.call(null, b, c.left, d, e), c.right) : c.replace(f, c.val, c.left, tree_map_replace.call(null, b, c.right, d, e))
};
cljs.core.key = "undefined" != typeof cljs.core.key ? cljs.core.key : void 0;
cljs.core.PersistentTreeMap = function(a, b, c, d, e) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 418776847
};
cljs.core.PersistentTreeMap.cljs$lang$type = !0;
cljs.core.PersistentTreeMap.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap.call(null, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = a.entry_at(b);
  return null != a ? a.val : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = [null], e = cljs.core.tree_map_add.call(null, this.comp, this.tree, b, c, d);
  return null == e ? (d = cljs.core.nth.call(null, d, 0), cljs.core._EQ_.call(null, c, d.val) ? a : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace.call(null, this.comp, this.tree, b, c), this.cnt, this.meta, null)) : new cljs.core.PersistentTreeMap(this.comp, e.blacken(), this.cnt + 1, this.meta, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != a.entry_at(b)
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  return null != this.tree ? cljs.core.tree_map_kv_reduce.call(null, this.tree, b, c) : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function() {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !1, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for(var b = this.tree;;) {
    if(null != b) {
      var c = this.comp.call(null, a, b.key);
      if(0 === c) {
        return b
      }
      b = 0 > c ? b.left : b.right
    }else {
      return null
    }
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, b, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if(0 < this.cnt) {
    a = null;
    for(var d = this.tree;;) {
      if(null != d) {
        var e = this.comp.call(null, b, d.key);
        if(0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, a, d), c, -1, null)
        }
        cljs.core.truth_(c) ? 0 > e ? (a = cljs.core.conj.call(null, a, d), d = d.left) : d = d.right : 0 < e ? (a = cljs.core.conj.call(null, a, d), d = d.right) : d = d.left
      }else {
        return null == a ? null : new cljs.core.PersistentTreeMapSeq(null, a, c, -1, null)
      }
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.call(null, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function() {
  return this.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !0, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return this.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b, this.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove.call(null, this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.call(null, c, 0) ? a : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta, null) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta, null)
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for(var b = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
      if(a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc_BANG_.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e
      }else {
        return cljs.core.persistent_BANG_.call(null, b)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.array_map = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, a), 2), cljs.core.apply.call(null, cljs.core.array, a), null)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.obj_map = function() {
  var a = function(a) {
    var b = [], e = {};
    for(a = cljs.core.seq.call(null, a);;) {
      if(a) {
        b.push(cljs.core.first.call(null, a)), e[cljs.core.first.call(null, a)] = cljs.core.second.call(null, a), a = cljs.core.nnext.call(null, a)
      }else {
        return cljs.core.ObjMap.fromObject.call(null, b, e)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for(var b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if(a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq.call(null, b), f = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator.call(null, a), null, 0, null, 0);;) {
      if(e) {
        var g = cljs.core.nnext.call(null, e), f = cljs.core.assoc.call(null, f, cljs.core.first.call(null, e), cljs.core.second.call(null, e)), e = g
      }else {
        return f
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.keys = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.first, a))
};
cljs.core.key = function(a) {
  return cljs.core._key.call(null, a)
};
cljs.core.vals = function(a) {
  return cljs.core.seq.call(null, cljs.core.map.call(null, cljs.core.second, a))
};
cljs.core.val = function(a) {
  return cljs.core._val.call(null, a)
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.ObjMap.EMPTY, b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(b, d) {
        var e = cljs.core.first.call(null, d), j = cljs.core.second.call(null, d);
        return cljs.core.contains_QMARK_.call(null, b, e) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core._lookup.call(null, b, e, null), j)) : cljs.core.assoc.call(null, b, e, j)
      };
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.reduce.call(null, e, cljs.core.truth_(a) ? a : cljs.core.ObjMap.EMPTY, cljs.core.seq.call(null, b))
      }, b)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.ObjMap.EMPTY, d = cljs.core.seq.call(null, b);;) {
    if(d) {
      var e = cljs.core.first.call(null, d), f = cljs.core._lookup.call(null, a, e, "\ufdd0:cljs.core/not-found"), c = cljs.core.not_EQ_.call(null, f, "\ufdd0:cljs.core/not-found") ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    }else {
      return c
    }
  }
};
cljs.core.TransientHashSet = "undefined" != typeof cljs.core.TransientHashSet ? cljs.core.TransientHashSet : void 0;
cljs.core.PersistentHashSet = function(a, b, c) {
  this.meta = a;
  this.hash_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 15077647
};
cljs.core.PersistentHashSet.cljs$lang$type = !0;
cljs.core.PersistentHashSet.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function() {
  return new cljs.core.TransientHashSet(cljs.core._as_transient.call(null, this.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset.call(null, a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null, this.hash_map, b)) ? b : c
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._assoc.call(null, this.hash_map, b, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.keys.call(null, this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._dissoc.call(null, this.hash_map, b), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return cljs.core._count.call(null, this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core.count.call(null, a) === cljs.core.count.call(null, b)) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(b, this.hash_map, this.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this.meta)
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(a, b) {
  var c = a.length;
  if(c / 2 <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    return c = b ? a : a.slice(), new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.fromArray.call(null, c, !0), null)
  }
  for(var d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
    if(d < c) {
      var f = d + 2, e = cljs.core.conj_BANG_.call(null, e, a[d]), d = f
    }else {
      return cljs.core.persistent_BANG_.call(null, e)
    }
  }
};
cljs.core.TransientHashSet = function(a) {
  this.transient_map = a;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136
};
cljs.core.TransientHashSet.cljs$lang$type = !0;
cljs.core.TransientHashSet.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : c;
        return e;
      case 3:
        return e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? d : c, e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return cljs.core.count.call(null, this.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.dissoc_BANG_.call(null, this.transient_map, b);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.assoc_BANG_.call(null, this.transient_map, b, null);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function() {
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this.transient_map), null)
};
cljs.core.PersistentTreeSet = function(a, b, c) {
  this.meta = a;
  this.tree_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 417730831
};
cljs.core.PersistentTreeSet.cljs$lang$type = !0;
cljs.core.PersistentTreeSet.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset.call(null, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.tree_map.entry_at(b);
  return null != a ? a.key : c
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.call(null, this.tree_map, b, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function() {
  return cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this.tree_map, b))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this.tree_map, b, c))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function() {
  return cljs.core._comparator.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function() {
  return cljs.core.keys.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.call(null, this.tree_map, b), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function() {
  return cljs.core.count.call(null, this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_.call(null, b);
  return c ? (c = cljs.core.count.call(null, a) === cljs.core.count.call(null, b)) ? cljs.core.every_QMARK_.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b)
  }, b) : c : c
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map, this.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this.meta)
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map.call(null), 0);
cljs.core.hash_set = function() {
  var a = null, b = function() {
    return cljs.core.PersistentHashSet.EMPTY
  }, c = function(a) {
    var b = cljs.core.instance_QMARK_.call(null, cljs.core.IndexedSeq, a);
    if(b ? a.arr.length < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD : b) {
      a = a.arr;
      for(var b = a.length, c = cljs.core.make_array.call(null, 2 * b), d = 0;;) {
        if(d < b) {
          var j = 2 * d;
          c[j] = a[d];
          c[j + 1] = null;
          d += 1
        }else {
          return cljs.core.PersistentHashSet.fromArray.call(null, c, !0)
        }
      }
    }else {
      for(c = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
        if(null != a) {
          b = cljs.core._next.call(null, a), c = cljs.core._conj_BANG_.call(null, c, cljs.core._first.call(null, a)), a = b
        }else {
          return cljs.core._persistent_BANG_.call(null, c)
        }
      }
    }
  }, d = function(a) {
    var b = null;
    0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return c.call(this, b)
  };
  d.cljs$lang$maxFixedArity = 0;
  d.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return c(a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.set = function(a) {
  return cljs.core.apply.call(null, cljs.core.hash_set, a)
};
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, a), 0), b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.replace = function(a, b) {
  if(cljs.core.vector_QMARK_.call(null, b)) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)))
  }
  return cljs.core.map.call(null, function(b) {
    var c = cljs.core.find.call(null, a, b);
    return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b
  }, b)
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return function(a, d) {
        for(;;) {
          var e = a, j = cljs.core.nth.call(null, e, 0, null);
          if(e = cljs.core.seq.call(null, e)) {
            if(cljs.core.contains_QMARK_.call(null, d, j)) {
              j = cljs.core.rest.call(null, e), e = d, a = j, d = e
            }else {
              return cljs.core.cons.call(null, j, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, j)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    }, null)
  }.call(null, a, cljs.core.PersistentHashSet.EMPTY)
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.PersistentVector.EMPTY;;) {
    if(cljs.core.next.call(null, a)) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a)
    }else {
      return cljs.core.seq.call(null, b)
    }
  }
};
cljs.core.name = function(a) {
  if(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$INamed$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, cljs.core.INamed, a)) : cljs.core.type_satisfies_.call(null, cljs.core.INamed, a)) {
    return cljs.core._name.call(null, a)
  }
  if(cljs.core.string_QMARK_.call(null, a)) {
    return a
  }
  if(cljs.core.keyword_QMARK_.call(null, a)) {
    var b = a.lastIndexOf("/", a.length - 2);
    return 0 > b ? cljs.core.subs.call(null, a, 2) : cljs.core.subs.call(null, a, b + 1)
  }
  throw Error([cljs.core.str("Doesn't support name: "), cljs.core.str(a)].join(""));
};
cljs.core.namespace = function(a) {
  if(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$INamed$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_.call(null, cljs.core.INamed, a)) : cljs.core.type_satisfies_.call(null, cljs.core.INamed, a)) {
    return cljs.core._namespace.call(null, a)
  }
  if(cljs.core.keyword_QMARK_.call(null, a)) {
    var b = a.lastIndexOf("/", a.length - 2);
    return-1 < b ? cljs.core.subs.call(null, a, 2, b) : null
  }
  throw Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(a)].join(""));
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.ObjMap.EMPTY, d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    var f;
    f = (f = d) ? e : f;
    if(f) {
      c = cljs.core.assoc.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), d = cljs.core.next.call(null, d), e = cljs.core.next.call(null, e)
    }else {
      return c
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) > a.call(null, c) ? b : c
  }, c = function(b, c, d, h) {
    return cljs.core.reduce.call(null, function(c, d) {
      return a.call(null, b, c, d)
    }, a.call(null, b, c, d), h)
  }, d = function(a, b, d, h) {
    var j = null;
    3 < arguments.length && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return c.call(this, a, b, d, j)
  };
  d.cljs$lang$maxFixedArity = 3;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return c(b, d, h, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g, h) {
    switch(arguments.length) {
      case 2:
        return c;
      case 3:
        return b.call(this, a, c, g);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, g, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) < a.call(null, c) ? b : c
  }, c = function(b, c, d, h) {
    return cljs.core.reduce.call(null, function(c, d) {
      return a.call(null, b, c, d)
    }, a.call(null, b, c, d), h)
  }, d = function(a, b, d, h) {
    var j = null;
    3 < arguments.length && (j = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return c.call(this, a, b, d, j)
  };
  d.cljs$lang$maxFixedArity = 3;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), h = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return c(b, d, h, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c, g, h) {
    switch(arguments.length) {
      case 2:
        return c;
      case 3:
        return b.call(this, a, c, g);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, c, g, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c)
  }, c = function(b, c, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? cljs.core.cons.call(null, cljs.core.take.call(null, b, g), a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null
    }, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null
  }, null)
};
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator.call(null, a);
    return b.call(null, e.call(null, cljs.core._entry_key.call(null, a, d), c), 0)
  }
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, null, cljs.core._GT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !0))
  }, c = function(a, b, c, g, h) {
    var j = cljs.core._sorted_seq_from.call(null, a, c, !0);
    if(cljs.core.truth_(j)) {
      var k = cljs.core.nth.call(null, j, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, b, c).call(null, k)) ? j : cljs.core.next.call(null, j))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.rsubseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, null, cljs.core._LT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !1), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !1))
  }, c = function(a, b, c, g, h) {
    var j = cljs.core._sorted_seq_from.call(null, a, h, !1);
    if(cljs.core.truth_(j)) {
      var k = cljs.core.nth.call(null, j, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, b, c), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, g, h).call(null, k)) ? j : cljs.core.next.call(null, j))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.Range = function(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32375006
};
cljs.core.Range.cljs$lang$type = !0;
cljs.core.Range.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Range")
};
cljs.core.Range.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Range")
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll.call(null, a)
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function() {
  return 0 < this.step ? this.start + this.step < this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, a)
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, a, b, c)
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.step ? this.start < this.end ? a : null : this.start > this.end ? a : null
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not.call(null, a.cljs$core$ISeqable$_seq$arity$1(a)) ? 0 : Math.ceil((this.end - this.start) / this.step)
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function() {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null != a.cljs$core$ISeqable$_seq$arity$1(a) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : cljs.core.List.EMPTY
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step, this.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  var c;
  c = (c = this.start > this.end) ? 0 === this.step : c;
  if(c) {
    return this.start
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  a = (a = this.start > this.end) ? 0 === this.step : a;
  return a ? this.start : c
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function() {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.range = function() {
  var a = null, b = function() {
    return a.call(null, 0, Number.MAX_VALUE, 1)
  }, c = function(b) {
    return a.call(null, 0, b, 1)
  }, d = function(b, c) {
    return a.call(null, b, c, 1)
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c, null)
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$3 = e;
  return a
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null
  }, null)
};
cljs.core.split_with = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)], !0)
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq.call(null, c);
    if(d) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c, d) {
        return function(c) {
          return cljs.core._EQ_.call(null, d, b.call(null, c))
        }
      }(e, f), cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))))
    }
    return null
  }, null)
};
cljs.core.frequencies = function(a) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc_BANG_.call(null, a, c, cljs.core._lookup.call(null, a, c, 0) + 1)
  }, cljs.core.transient$.call(null, cljs.core.ObjMap.EMPTY), a))
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core.list.call(null, b.call(null))
    }, null)
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null
    }, null))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    var b = null, c = function(b, c, d, e) {
      return cljs.core.vector.call(null, cljs.core.apply.call(null, a, b, c, d, e))
    }, d = function(a, b, d, e) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return c.call(this, a, b, d, f)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), d = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return c(b, d, e, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = c;
    b = function(b, c, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.vector.call(null, a.call(null));
        case 1:
          return cljs.core.vector.call(null, a.call(null, b));
        case 2:
          return cljs.core.vector.call(null, a.call(null, b, c));
        case 3:
          return cljs.core.vector.call(null, a.call(null, b, c, e));
        default:
          return d.cljs$core$IFn$_invoke$arity$variadic(b, c, e, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = d.cljs$lang$applyTo;
    return b
  }, c = function(a, b) {
    var c = null, d = function(c, d, e, f) {
      return cljs.core.vector.call(null, cljs.core.apply.call(null, a, c, d, e, f), cljs.core.apply.call(null, b, c, d, e, f))
    }, e = function(a, b, c, e) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return d.call(this, a, b, c, f)
    };
    e.cljs$lang$maxFixedArity = 3;
    e.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), e = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return d(b, c, e, a)
    };
    e.cljs$core$IFn$_invoke$arity$variadic = d;
    c = function(c, d, f, j) {
      switch(arguments.length) {
        case 0:
          return cljs.core.vector.call(null, a.call(null), b.call(null));
        case 1:
          return cljs.core.vector.call(null, a.call(null, c), b.call(null, c));
        case 2:
          return cljs.core.vector.call(null, a.call(null, c, d), b.call(null, c, d));
        case 3:
          return cljs.core.vector.call(null, a.call(null, c, d, f), b.call(null, c, d, f));
        default:
          return e.cljs$core$IFn$_invoke$arity$variadic(c, d, f, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = e.cljs$lang$applyTo;
    return c
  }, d = function(a, b, c) {
    var d = null, e = function(d, e, f, k) {
      return cljs.core.vector.call(null, cljs.core.apply.call(null, a, d, e, f, k), cljs.core.apply.call(null, b, d, e, f, k), cljs.core.apply.call(null, c, d, e, f, k))
    }, f = function(a, b, c, d) {
      var f = null;
      3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return e.call(this, a, b, c, f)
    };
    f.cljs$lang$maxFixedArity = 3;
    f.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return e(b, c, d, a)
    };
    f.cljs$core$IFn$_invoke$arity$variadic = e;
    d = function(d, e, k, l) {
      switch(arguments.length) {
        case 0:
          return cljs.core.vector.call(null, a.call(null), b.call(null), c.call(null));
        case 1:
          return cljs.core.vector.call(null, a.call(null, d), b.call(null, d), c.call(null, d));
        case 2:
          return cljs.core.vector.call(null, a.call(null, d, e), b.call(null, d, e), c.call(null, d, e));
        case 3:
          return cljs.core.vector.call(null, a.call(null, d, e, k), b.call(null, d, e, k), c.call(null, d, e, k));
        default:
          return f.cljs$core$IFn$_invoke$arity$variadic(d, e, k, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = f.cljs$lang$applyTo;
    return d
  }, e = function(a, b, c, d) {
    var e = cljs.core.list_STAR_.call(null, a, b, c, d);
    a = null;
    var f = function(a, b, c, d) {
      return cljs.core.reduce.call(null, function(e, f) {
        return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d))
      }, cljs.core.PersistentVector.EMPTY, e)
    }, m = function(a, b, c, d) {
      var e = null;
      3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return f.call(this, a, b, c, e)
    };
    m.cljs$lang$maxFixedArity = 3;
    m.cljs$lang$applyTo = function(a) {
      var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
      a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
      return f(b, c, d, a)
    };
    m.cljs$core$IFn$_invoke$arity$variadic = f;
    a = function(a, b, c, d) {
      switch(arguments.length) {
        case 0:
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null))
          }, cljs.core.PersistentVector.EMPTY, e);
        case 1:
          var f = a;
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null, f))
          }, cljs.core.PersistentVector.EMPTY, e);
        case 2:
          var g = a, h = b;
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null, g, h))
          }, cljs.core.PersistentVector.EMPTY, e);
        case 3:
          var j = a, k = b, n = c;
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null, j, k, n))
          }, cljs.core.PersistentVector.EMPTY, e);
        default:
          return m.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    a.cljs$lang$maxFixedArity = 3;
    a.cljs$lang$applyTo = m.cljs$lang$applyTo;
    return a
  }, f = function(a, b, c, d) {
    var f = null;
    3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return e.call(this, a, b, c, f)
  };
  f.cljs$lang$maxFixedArity = 3;
  f.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a)));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(a)));
    return e(b, c, d, a)
  };
  f.cljs$core$IFn$_invoke$arity$variadic = e;
  a = function(a, e, j, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
      case 3:
        return d.call(this, a, e, j);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, e, j, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a)
      }else {
        return null
      }
    }
  }, c = function(a, b) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var c = cljs.core.seq.call(null, b);
        return c ? 0 < a : c
      }())) {
        var c = a - 1, g = cljs.core.next.call(null, b);
        a = c;
        b = g
      }else {
        return null
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.call(null, a);
    return a
  }, c = function(a, b) {
    cljs.core.dorun.call(null, a, b);
    return b
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.regexp_QMARK_ = function(a) {
  return a instanceof RegExp
};
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b) ? 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return null == c ? null : 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.coll_QMARK_.call(null, d) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, !1, function() {
    return cljs.core.cons.call(null, d, re_seq.call(null, b, g))
  }, null) : null
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return RegExp(b, a)
};
cljs.core.pr_sequential_writer = function(a, b, c, d, e, f, g) {
  cljs.core._write.call(null, a, c);
  cljs.core.seq.call(null, g) && b.call(null, cljs.core.first.call(null, g), a, f);
  for(c = cljs.core.seq.call(null, cljs.core.next.call(null, g));;) {
    if(c) {
      g = cljs.core.first.call(null, c), cljs.core._write.call(null, a, d), b.call(null, g, a, f), c = cljs.core.next.call(null, c)
    }else {
      break
    }
  }
  return cljs.core._write.call(null, a, e)
};
cljs.core.write_all = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq.call(null, b);;) {
      if(e) {
        var f = cljs.core.first.call(null, e);
        cljs.core._write.call(null, a, f);
        e = cljs.core.next.call(null, e)
      }else {
        return null
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.StringBufferWriter = function(a) {
  this.sb = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824
};
cljs.core.StringBufferWriter.cljs$lang$type = !0;
cljs.core.StringBufferWriter.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(a, b) {
  return this.sb.append(b)
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function() {
  return null
};
cljs.core.pr_writer = function pr_writer(b, c, d) {
  if(null == b) {
    return cljs.core._write.call(null, c, "nil")
  }
  if(void 0 === b) {
    return cljs.core._write.call(null, c, "#\x3cundefined\x3e")
  }
  cljs.core.truth_(function() {
    var c = cljs.core._lookup.call(null, d, "\ufdd0:meta", null);
    return cljs.core.truth_(c) ? (b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 131072) ? c : b.cljs$core$IMeta$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b)) : c = cljs.core.type_satisfies_.call(null, cljs.core.IMeta, b), cljs.core.truth_(c) ? cljs.core.meta.call(null, b) : c) : c
  }()) && (cljs.core._write.call(null, c, "^"), pr_writer.call(null, cljs.core.meta.call(null, b), c, d), cljs.core._write.call(null, c, " "));
  var e;
  e = (e = null != b) ? b.cljs$lang$type : e;
  e ? c = b.cljs$lang$ctorPrWriter(b, c, d) : (b ? (e = (e = b.cljs$lang$protocol_mask$partition0$ & 2147483648) ? e : b.cljs$core$IPrintWithWriter$, e = e ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, b)) : e = cljs.core.type_satisfies_.call(null, cljs.core.IPrintWithWriter, b), c = e ? cljs.core._pr_writer.call(null, b, c, d) : cljs.core.truth_(cljs.core.regexp_QMARK_.call(null, b)) ? cljs.core.write_all.call(null, c, '#"', 
  b.source, '"') : cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str(b), "\x3e"));
  return c
};
cljs.core.pr_seq_writer = function(a, b, c) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, a), b, c);
  for(a = cljs.core.seq.call(null, cljs.core.next.call(null, a));;) {
    if(a) {
      var d = cljs.core.first.call(null, a);
      cljs.core._write.call(null, b, " ");
      cljs.core.pr_writer.call(null, d, b, c);
      a = cljs.core.next.call(null, a)
    }else {
      return null
    }
  }
};
cljs.core.pr_sb_with_opts = function(a, b) {
  var c = new goog.string.StringBuffer, d = new cljs.core.StringBufferWriter(c);
  cljs.core.pr_seq_writer.call(null, a, d, b);
  cljs.core._flush.call(null, d);
  return c
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.empty_QMARK_.call(null, a) ? "" : "" + cljs.core.str(cljs.core.pr_sb_with_opts.call(null, a, b))
};
cljs.core.prn_str_with_opts = function(a, b) {
  if(cljs.core.empty_QMARK_.call(null, a)) {
    return"\n"
  }
  var c = cljs.core.pr_sb_with_opts.call(null, a, b);
  c.append("\n");
  return"" + cljs.core.str(c)
};
cljs.core.pr_with_opts = function(a, b) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, a, b))
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core._lookup.call(null, a, "\ufdd0:flush-on-newline", null)) ? cljs.core.flush.call(null) : null
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.PersistentArrayMap.fromArray(["\ufdd0:flush-on-newline", cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0:readably", cljs.core._STAR_print_readably_STAR_, "\ufdd0:meta", cljs.core._STAR_print_meta_STAR_, "\ufdd0:dup", cljs.core._STAR_print_dup_STAR_], !0)
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0:readably", !1));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.newline.call(null, cljs.core.pr_opts.call(null))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.printf = function() {
  var a = function(a, b) {
    return cljs.core.print.call(null, cljs.core.apply.call(null, cljs.core.format, a, b))
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.char_escapes = cljs.core.PersistentArrayMap.fromArray('" \\" \\ \\\\ \b \\b \f \\f \n \\n \r \\r \t \\t'.split(" "), !0);
cljs.core.quote_string = function(a) {
  return[cljs.core.str('"'), cljs.core.str(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return cljs.core._lookup.call(null, cljs.core.char_escapes, a, null)
  })), cljs.core.str('"')].join("")
};
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.HashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.IPrintWithWriter.number = !0;
cljs.core._pr_writer.number = function(a, b) {
  1 / 0;
  return cljs.core._write.call(null, b, "" + cljs.core.str(a))
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#queue [", " ", "]", c, cljs.core.seq.call(null, a))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.IPrintWithWriter["boolean"] = !0;
cljs.core._pr_writer["boolean"] = function(a, b) {
  return cljs.core._write.call(null, b, "" + cljs.core.str(a))
};
cljs.core.IPrintWithWriter.string = !0;
cljs.core._pr_writer.string = function(a, b, c) {
  return cljs.core.keyword_QMARK_.call(null, a) ? (cljs.core._write.call(null, b, ":"), c = cljs.core.namespace.call(null, a), cljs.core.truth_(c) && cljs.core.write_all.call(null, b, "" + cljs.core.str(c), "/"), cljs.core._write.call(null, b, cljs.core.name.call(null, a))) : cljs.core.symbol_QMARK_.call(null, a) ? (c = cljs.core.namespace.call(null, a), cljs.core.truth_(c) && cljs.core.write_all.call(null, b, "" + cljs.core.str(c), "/"), cljs.core._write.call(null, b, cljs.core.name.call(null, a))) : 
  cljs.core.truth_((new cljs.core.Keyword("\ufdd0:readably")).call(null, c)) ? cljs.core._write.call(null, b, cljs.core.quote_string.call(null, a)) : cljs.core._write.call(null, b, a)
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.IPrintWithWriter.array = !0;
cljs.core._pr_writer.array = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#\x3cArray [", ", ", "]\x3e", c, a)
};
cljs.core.IPrintWithWriter["function"] = !0;
cljs.core._pr_writer["function"] = function(a, b) {
  return cljs.core.write_all.call(null, b, "#\x3c", "" + cljs.core.str(a), "\x3e")
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b) {
  return cljs.core._write.call(null, b, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
Date.prototype.cljs$core$IPrintWithWriter$ = !0;
Date.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b) {
  var c = function(a, b) {
    for(var c = "" + cljs.core.str(a);;) {
      if(cljs.core.count.call(null, c) < b) {
        c = [cljs.core.str("0"), cljs.core.str(c)].join("")
      }else {
        return c
      }
    }
  };
  return cljs.core.write_all.call(null, b, '#inst "', "" + cljs.core.str(a.getUTCFullYear()), "-", c.call(null, a.getUTCMonth() + 1, 2), "-", c.call(null, a.getUTCDate(), 2), "T", c.call(null, a.getUTCHours(), 2), ":", c.call(null, a.getUTCMinutes(), 2), ":", c.call(null, a.getUTCSeconds(), 2), ".", c.call(null, a.getUTCMilliseconds(), 3), "-", '00:00"')
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, function(a) {
    return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, a, b)
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153938944;
  this.cljs$lang$protocol_mask$partition1$ = 2
};
cljs.core.Atom.cljs$lang$type = !0;
cljs.core.Atom.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Atom")
};
cljs.core.Atom.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  for(var d = cljs.core.seq.call(null, this.watches);;) {
    if(d) {
      var e = cljs.core.first.call(null, d), f = cljs.core.nth.call(null, e, 0, null);
      cljs.core.nth.call(null, e, 1, null).call(null, f, a, b, c);
      d = cljs.core.next.call(null, d)
    }else {
      return null
    }
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  return a.watches = cljs.core.assoc.call(null, this.watches, b, c)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return a.watches = cljs.core.dissoc.call(null, this.watches, b)
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  cljs.core._write.call(null, b, "#\x3cAtom: ");
  cljs.core._pr_writer.call(null, this.state, b, c);
  return cljs.core._write.call(null, b, "\x3e")
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function() {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function() {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return a === b
};
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null)
  }, c = function(a, b) {
    var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core._lookup.call(null, c, "\ufdd0:validator", null), c = cljs.core._lookup.call(null, c, "\ufdd0:meta", null);
    return new cljs.core.Atom(a, c, d, null)
  }, d = function(a, b) {
    var d = null;
    1 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return c.call(this, a, d)
  };
  d.cljs$lang$maxFixedArity = 1;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a);
    a = cljs.core.rest(a);
    return c(b, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.call(null, b))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list(cljs.core.symbol(null, "validate"), cljs.core.symbol(null, "new-value")), cljs.core.hash_map("\ufdd0:line", 6705))))].join(""));
  }
  c = a.state;
  a.state = b;
  cljs.core._notify_watches.call(null, a, c, b);
  return b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state))
  }, c = function(a, b, c) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c))
  }, d = function(a, b, c, d) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d))
  }, e = function(a, b, c, d, e) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d, e))
  }, f = function(a, b, c, d, e, f) {
    return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, d, e, f))
  }, g = function(a, b, c, d, e, g) {
    var p = null;
    5 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
    return f.call(this, a, b, c, d, e, p)
  };
  g.cljs$lang$maxFixedArity = 5;
  g.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a), c = cljs.core.first(cljs.core.next(a)), d = cljs.core.first(cljs.core.next(cljs.core.next(a))), e = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(a)))), g = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
    a = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(a)))));
    return f(b, c, d, e, g, a)
  };
  g.cljs$core$IFn$_invoke$arity$variadic = f;
  a = function(a, f, k, l, n, m) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, k);
      case 4:
        return d.call(this, a, f, k, l);
      case 5:
        return e.call(this, a, f, k, l, n);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, f, k, l, n, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.call(null, a.state, b) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, b, e) {
    return a.meta = cljs.core.apply.call(null, b, a.meta, e)
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b), e = cljs.core.first(cljs.core.next(b));
    b = cljs.core.rest(cljs.core.next(b));
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c)
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.call(null, "G__")
  }, c = function(a) {
    null == cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0));
    return cljs.core.symbol.call(null, [cljs.core.str(a), cljs.core.str(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc))].join(""))
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.state = a;
  this.f = b;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Delay.cljs$lang$type = !0;
cljs.core.Delay.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/Delay")
};
cljs.core.Delay.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function() {
  return(new cljs.core.Keyword("\ufdd0:done")).call(null, cljs.core.deref.call(null, this.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function() {
  var a = this;
  return(new cljs.core.Keyword("\ufdd0:value")).call(null, cljs.core.swap_BANG_.call(null, a.state, function(b) {
    b = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b;
    var c = cljs.core._lookup.call(null, b, "\ufdd0:done", null);
    return cljs.core.truth_(c) ? b : cljs.core.PersistentArrayMap.fromArray(["\ufdd0:done", !0, "\ufdd0:value", a.f.call(null)], !0)
  }))
};
cljs.core.delay_QMARK_ = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.Delay, a)
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a)
};
cljs.core.IEncodeJS = {};
cljs.core._clj__GT_js = function(a) {
  var b;
  b = a ? a.cljs$core$IEncodeJS$_clj__GT_js$arity$1 : a;
  if(b) {
    return a.cljs$core$IEncodeJS$_clj__GT_js$arity$1(a)
  }
  b = cljs.core._clj__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._clj__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-clj-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core._key__GT_js = function(a) {
  var b;
  b = a ? a.cljs$core$IEncodeJS$_key__GT_js$arity$1 : a;
  if(b) {
    return a.cljs$core$IEncodeJS$_key__GT_js$arity$1(a)
  }
  b = cljs.core._key__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-key-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core.IEncodeJS["null"] = !0;
cljs.core._clj__GT_js["null"] = function() {
  return null
};
cljs.core.IEncodeJS._ = !0;
cljs.core._key__GT_js._ = function(a) {
  return function() {
    var b = cljs.core.string_QMARK_.call(null, a);
    return b || (b = cljs.core.number_QMARK_.call(null, a)) ? b : (b = cljs.core.keyword_QMARK_.call(null, a)) ? b : cljs.core.symbol_QMARK_.call(null, a)
  }() ? cljs.core._clj__GT_js.call(null, a) : cljs.core.pr_str.call(null, a)
};
cljs.core._clj__GT_js._ = function(a) {
  if(cljs.core.keyword_QMARK_.call(null, a)) {
    return cljs.core.name.call(null, a)
  }
  if(cljs.core.symbol_QMARK_.call(null, a)) {
    return"" + cljs.core.str(a)
  }
  if(cljs.core.map_QMARK_.call(null, a)) {
    var b = {};
    for(a = cljs.core.seq.call(null, a);;) {
      if(a) {
        var c = cljs.core.first.call(null, a), d = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null);
        b[cljs.core._key__GT_js.call(null, d)] = cljs.core._clj__GT_js.call(null, c);
        a = cljs.core.next.call(null, a)
      }else {
        break
      }
    }
    return b
  }
  return cljs.core.coll_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.array, cljs.core.map.call(null, cljs.core._clj__GT_js, a)) : a
};
cljs.core.clj__GT_js = function(a) {
  return cljs.core._clj__GT_js.call(null, a)
};
cljs.core.IEncodeClojure = {};
cljs.core._js__GT_clj = function() {
  var a = null, b = function(a) {
    var b;
    b = a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$1 : a;
    if(b) {
      return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$1(a)
    }
    b = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
    if(!b && (b = cljs.core._js__GT_clj._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", a);
    }
    return b.call(null, a)
  }, c = function(a, b) {
    var c;
    c = a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2 : a;
    if(c) {
      return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(a, b)
    }
    c = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._js__GT_clj._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", a);
    }
    return c.call(null, a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.IEncodeClojure._ = !0;
cljs.core._js__GT_clj._ = function() {
  var a = null;
  return a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return cljs.core._js__GT_clj.call(null, a, cljs.core.PersistentArrayMap.fromArray(["\ufdd0:keywordize-keys", !1], !0));
      case 2:
        var d = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, e = cljs.core._lookup.call(null, d, "\ufdd0:keywordize-keys", null), f = cljs.core.truth_(e) ? cljs.core.keyword : cljs.core.str;
        return function h(a) {
          return cljs.core.seq_QMARK_.call(null, a) ? cljs.core.doall.call(null, cljs.core.map.call(null, h, a)) : cljs.core.coll_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.empty.call(null, a), cljs.core.map.call(null, h, a)) : cljs.core.truth_(goog.isArray(a)) ? cljs.core.vec.call(null, cljs.core.map.call(null, h, a)) : cljs.core.type.call(null, a) === Object ? cljs.core.into.call(null, cljs.core.ObjMap.EMPTY, function(b, c, d, e) {
            return function q(b) {
              return new cljs.core.LazySeq(null, !1, function() {
                for(;;) {
                  if(cljs.core.seq.call(null, b)) {
                    var c = cljs.core.first.call(null, b);
                    return cljs.core.cons.call(null, cljs.core.PersistentVector.fromArray([e.call(null, c), h.call(null, a[c])], !0), q.call(null, cljs.core.rest.call(null, b)))
                  }
                  return null
                }
              }, null)
            }
          }(c, d, e, f).call(null, cljs.core.js_keys.call(null, a))) : a
        }.call(null, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.js__GT_clj = function() {
  var a = function(a, b) {
    return cljs.core._js__GT_clj.call(null, a, cljs.core.apply.call(null, cljs.core.array_map, b))
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.ObjMap.EMPTY), c = function(c) {
    var d = cljs.core._lookup.call(null, cljs.core.deref.call(null, b), c, null);
    if(cljs.core.truth_(d)) {
      return d
    }
    d = cljs.core.apply.call(null, a, c);
    cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
    return d
  }, d = function(a) {
    var b = null;
    0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return c.call(this, b)
  };
  d.cljs$lang$maxFixedArity = 0;
  d.cljs$lang$applyTo = function(a) {
    a = cljs.core.seq(a);
    return c(a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  return d
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(a = a.call(null), !cljs.core.fn_QMARK_.call(null, a)) {
        return a
      }
    }
  }, c = function(b, c) {
    return a.call(null, function() {
      return cljs.core.apply.call(null, b, c)
    })
  }, d = function(a, b) {
    var d = null;
    1 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return c.call(this, a, d)
  };
  d.cljs$lang$maxFixedArity = 1;
  d.cljs$lang$applyTo = function(a) {
    var b = cljs.core.first(a);
    a = cljs.core.rest(a);
    return c(b, a)
  };
  d.cljs$core$IFn$_invoke$arity$variadic = c;
  a = function(a, c) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.call(null, 1)
  }, c = function(a) {
    return Math.random.call(null) * a
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return Math.floor.call(null, Math.random.call(null) * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core._lookup.call(null, b, e, cljs.core.PersistentVector.EMPTY), d))
  }, cljs.core.ObjMap.EMPTY, b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.PersistentArrayMap.fromArray(["\ufdd0:parents", cljs.core.ObjMap.EMPTY, "\ufdd0:descendants", cljs.core.ObjMap.EMPTY, "\ufdd0:ancestors", cljs.core.ObjMap.EMPTY], !0)
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function() {
  null == cljs.core._global_hierarchy && (cljs.core._global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null)));
  return cljs.core._global_hierarchy
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var a = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.swap_BANG_, cljs.core.get_global_hierarchy.call(null), a, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b, c)
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.call(null, c, f);
    if(!g && !(g = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword("\ufdd0:ancestors")).call(null, b).call(null, c), f)) && (g = cljs.core.vector_QMARK_.call(null, f))) {
      if(g = cljs.core.vector_QMARK_.call(null, c)) {
        if(g = cljs.core.count.call(null, f) === cljs.core.count.call(null, c)) {
          for(var g = !0, h = 0;;) {
            var j;
            j = (j = cljs.core.not.call(null, g)) ? j : h === cljs.core.count.call(null, f);
            if(j) {
              return g
            }
            g = a.call(null, b, c.call(null, h), f.call(null, h));
            h += 1
          }
        }else {
          return g
        }
      }else {
        return g
      }
    }else {
      return g
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), b, null))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), b, null))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b)
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core._lookup.call(null, (new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), b, null))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if(!cljs.core.truth_(cljs.core.namespace.call(null, c))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list(cljs.core.symbol(null, "namespace"), cljs.core.symbol(null, "parent")), cljs.core.hash_map("\ufdd0:line", 7041))))].join(""));
    }
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null
  }, c = function(a, b, c) {
    if(!cljs.core.not_EQ_.call(null, b, c)) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.with_meta(cljs.core.list(cljs.core.symbol(null, "not\x3d"), cljs.core.symbol(null, "tag"), cljs.core.symbol(null, "parent")), cljs.core.hash_map("\ufdd0:line", 7045))))].join(""));
    }
    var g = (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), h = (new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), j = (new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), k;
    k = function(a, b, c, d, e) {
      return cljs.core.reduce.call(null, function(a, b) {
        return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core._lookup.call(null, e, b, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, d, e.call(null, d))))
      }, a, cljs.core.cons.call(null, b, c.call(null, b)))
    };
    if(cljs.core.contains_QMARK_.call(null, g.call(null, b), c)) {
      b = null
    }else {
      if(cljs.core.contains_QMARK_.call(null, j.call(null, b), c)) {
        throw Error([cljs.core.str(b), cljs.core.str("already has"), cljs.core.str(c), cljs.core.str("as ancestor")].join(""));
      }
      if(cljs.core.contains_QMARK_.call(null, j.call(null, c), b)) {
        throw Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(c), cljs.core.str("has"), cljs.core.str(b), cljs.core.str("as ancestor")].join(""));
      }
      b = cljs.core.PersistentArrayMap.fromArray(["\ufdd0:parents", cljs.core.assoc.call(null, (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), b, cljs.core.conj.call(null, cljs.core._lookup.call(null, g, b, cljs.core.PersistentHashSet.EMPTY), c)), "\ufdd0:ancestors", k.call(null, (new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), b, h, c, j), "\ufdd0:descendants", k.call(null, (new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), c, j, b, h)], !0)
    }
    return cljs.core.truth_(b) ? b : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null
  }, c = function(a, b, c) {
    var g = (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), h = cljs.core.truth_(g.call(null, b)) ? cljs.core.disj.call(null, g.call(null, b), c) : cljs.core.PersistentHashSet.EMPTY, h = cljs.core.truth_(cljs.core.not_empty.call(null, h)) ? cljs.core.assoc.call(null, g, b, h) : cljs.core.dissoc.call(null, g, b), h = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a) {
      return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)))
    }, cljs.core.seq.call(null, h)));
    return cljs.core.contains_QMARK_.call(null, g.call(null, b), c) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, h)) : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function() {
    return cljs.core.deref.call(null, b)
  });
  return cljs.core.swap_BANG_.call(null, c, function() {
    return cljs.core.deref.call(null, d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if(cljs.core.truth_(e)) {
    return e
  }
  a: {
    for(e = cljs.core.parents.call(null, c);;) {
      if(0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e)
      }else {
        e = null;
        break a
      }
    }
    e = void 0
  }
  if(cljs.core.truth_(e)) {
    return e
  }
  a: {
    for(b = cljs.core.parents.call(null, b);;) {
      if(0 < cljs.core.count.call(null, b)) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, b), c, d)), b = cljs.core.rest.call(null, b)
      }else {
        c = null;
        break a
      }
    }
    c = void 0
  }
  return cljs.core.truth_(c) ? c : !1
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var j = cljs.core.reduce.call(null, function(e, g) {
    var h = cljs.core.nth.call(null, g, 0, null);
    cljs.core.nth.call(null, g, 1, null);
    if(cljs.core.isa_QMARK_.call(null, cljs.core.deref.call(null, d), c, h)) {
      var j = cljs.core.truth_(function() {
        var b = null == e;
        return b ? b : cljs.core.dominates.call(null, h, cljs.core.first.call(null, e), f)
      }()) ? g : e;
      if(!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, j), h, f))) {
        throw Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(b), cljs.core.str("' match dispatch value: "), cljs.core.str(c), cljs.core.str(" -\x3e "), cljs.core.str(h), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, j)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return j
    }
    return e
  }, null, cljs.core.deref.call(null, e));
  if(cljs.core.truth_(j)) {
    if(cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, j)), cljs.core.second.call(null, j)
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h)
  }
  return null
};
cljs.core.IMultiFn = {};
cljs.core._reset = function(a) {
  var b;
  b = a ? a.cljs$core$IMultiFn$_reset$arity$1 : a;
  if(b) {
    return a.cljs$core$IMultiFn$_reset$arity$1(a)
  }
  b = cljs.core._reset[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._reset._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
  }
  return b.call(null, a)
};
cljs.core._add_method = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a;
  if(d) {
    return a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c)
  }
  d = cljs.core._add_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_method = function(a, b) {
  var c;
  c = a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a;
  if(c) {
    return a.cljs$core$IMultiFn$_remove_method$arity$2(a, b)
  }
  c = cljs.core._remove_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._prefer_method = function(a, b, c) {
  var d;
  d = a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a;
  if(d) {
    return a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c)
  }
  d = cljs.core._prefer_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._prefer_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._get_method = function(a, b) {
  var c;
  c = a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a;
  if(c) {
    return a.cljs$core$IMultiFn$_get_method$arity$2(a, b)
  }
  c = cljs.core._get_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._get_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._methods = function(a) {
  var b;
  b = a ? a.cljs$core$IMultiFn$_methods$arity$1 : a;
  if(b) {
    return a.cljs$core$IMultiFn$_methods$arity$1(a)
  }
  b = cljs.core._methods[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._methods._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
  }
  return b.call(null, a)
};
cljs.core._prefers = function(a) {
  var b;
  b = a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a;
  if(b) {
    return a.cljs$core$IMultiFn$_prefers$arity$1(a)
  }
  b = cljs.core._prefers[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._prefers._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
  }
  return b.call(null, a)
};
cljs.core._dispatch = function(a, b) {
  var c;
  c = a ? a.cljs$core$IMultiFn$_dispatch$arity$2 : a;
  if(c) {
    return a.cljs$core$IMultiFn$_dispatch$arity$2(a, b)
  }
  c = cljs.core._dispatch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dispatch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", a);
  }
  return c.call(null, a, b)
};
cljs.core.do_dispatch = function(a, b, c) {
  b = cljs.core.apply.call(null, b, c);
  a = cljs.core._get_method.call(null, a, b);
  if(!cljs.core.truth_(a)) {
    throw Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(b)].join(""));
  }
  return cljs.core.apply.call(null, a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h;
  this.cljs$lang$protocol_mask$partition0$ = 4194304;
  this.cljs$lang$protocol_mask$partition1$ = 256
};
cljs.core.MultiFn.cljs$lang$type = !0;
cljs.core.MultiFn.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/MultiFn")
};
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function() {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function() {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function() {
    return cljs.core.ObjMap.EMPTY
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function() {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy)) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if(cljs.core.truth_(c)) {
    return c
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this.name), cljs.core.str("': "), cljs.core.str(c), cljs.core.str(" is already preferred to "), cljs.core.str(b)].join(""));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core._lookup.call(null, a, b, cljs.core.PersistentHashSet.EMPTY), c))
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function() {
  return cljs.core.deref.call(null, this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function() {
  return cljs.core.deref.call(null, this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(a, b) {
  return cljs.core.do_dispatch.call(null, a, this.dispatch_fn, b)
};
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, b) {
    return cljs.core._dispatch.call(null, this, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch.call(null, this, b)
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a)
};
cljs.core.UUID = function(a) {
  this.uuid = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104
};
cljs.core.UUID.cljs$lang$type = !0;
cljs.core.UUID.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/UUID")
};
cljs.core.UUID.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/UUID")
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.string.hashCode(cljs.core.pr_str.call(null, a))
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b) {
  return cljs.core._write.call(null, b, [cljs.core.str('#uuid "'), cljs.core.str(this.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.instance_QMARK_.call(null, cljs.core.UUID, b);
  return c ? this.uuid === b.uuid : c
};
cljs.core.UUID.prototype.toString = function() {
  return cljs.core.pr_str.call(null, this)
};
cljs.core.ExceptionInfo = function(a, b, c) {
  this.message = a;
  this.data = b;
  this.cause = c
};
cljs.core.ExceptionInfo.cljs$lang$type = !0;
cljs.core.ExceptionInfo.cljs$lang$ctorPrSeq = function() {
  return cljs.core.list.call(null, "cljs.core/ExceptionInfo")
};
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(a, b) {
  return cljs.core._write.call(null, b, "cljs.core/ExceptionInfo")
};
cljs.core.ExceptionInfo.prototype = Error();
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var a = null, b = function(a, b) {
    return new cljs.core.ExceptionInfo(a, b, null)
  }, c = function(a, b, c) {
    return new cljs.core.ExceptionInfo(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ex_data = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.ExceptionInfo, a) ? a.data : null
};
cljs.core.ex_message = function(a) {
  return cljs.core.instance_QMARK_.call(null, Error, a) ? a.message : null
};
cljs.core.ex_cause = function(a) {
  return cljs.core.instance_QMARK_.call(null, cljs.core.ExceptionInfo, a) ? a.cause : null
};
cljs.core.comparator = function(a) {
  return function(b, c) {
    return cljs.core.truth_(a.call(null, b, c)) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0
  }
};
var clojure = {string:{}};
clojure.string.seq_reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a)
};
clojure.string.reverse = function(a) {
  return a.split("").reverse().join("")
};
clojure.string.replace = function(a, b, c) {
  if(cljs.core.string_QMARK_.call(null, b)) {
    return a.replace(RegExp(goog.string.regExpEscape(b), "g"), c)
  }
  if(cljs.core.truth_(b.hasOwnProperty("source"))) {
    return a.replace(RegExp(b.source, "g"), c)
  }
  throw[cljs.core.str("Invalid match arg: "), cljs.core.str(b)].join("");
};
clojure.string.replace_first = function(a, b, c) {
  return a.replace(b, c)
};
clojure.string.join = function() {
  var a = null, b = function(a) {
    return cljs.core.apply.call(null, cljs.core.str, a)
  }, c = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
clojure.string.upper_case = function(a) {
  return a.toUpperCase()
};
clojure.string.lower_case = function(a) {
  return a.toLowerCase()
};
clojure.string.capitalize = function(a) {
  return 2 > cljs.core.count.call(null, a) ? clojure.string.upper_case.call(null, a) : [cljs.core.str(clojure.string.upper_case.call(null, cljs.core.subs.call(null, a, 0, 1))), cljs.core.str(clojure.string.lower_case.call(null, cljs.core.subs.call(null, a, 1)))].join("")
};
clojure.string.split = function() {
  var a = null, b = function(a, b) {
    return cljs.core.vec.call(null, ("" + cljs.core.str(a)).split(b))
  }, c = function(a, b, c) {
    if(1 > c) {
      return cljs.core.vec.call(null, ("" + cljs.core.str(a)).split(b))
    }
    for(var g = cljs.core.PersistentVector.EMPTY;;) {
      if(cljs.core._EQ_.call(null, c, 1)) {
        return cljs.core.conj.call(null, g, a)
      }
      var h = cljs.core.re_find.call(null, b, a);
      if(cljs.core.truth_(h)) {
        var j = h, h = a.indexOf(j), j = a.substring(h + cljs.core.count.call(null, j));
        c -= 1;
        g = cljs.core.conj.call(null, g, a.substring(0, h));
        a = j
      }else {
        return cljs.core.conj.call(null, g, a)
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
clojure.string.split_lines = function(a) {
  return clojure.string.split.call(null, a, /\n|\r\n/)
};
clojure.string.trim = function(a) {
  return goog.string.trim(a)
};
clojure.string.triml = function(a) {
  return goog.string.trimLeft(a)
};
clojure.string.trimr = function(a) {
  return goog.string.trimRight(a)
};
clojure.string.trim_newline = function(a) {
  for(var b = a.length;;) {
    if(0 === b) {
      return""
    }
    var c = cljs.core._lookup.call(null, a, b - 1, null);
    var d = cljs.core._EQ_.call(null, c, "\n"), c = d ? d : cljs.core._EQ_.call(null, c, "\r");
    if(c) {
      b -= 1
    }else {
      return a.substring(0, b)
    }
  }
};
clojure.string.blank_QMARK_ = function(a) {
  return goog.string.isEmptySafe(a)
};
clojure.string.escape = function(a, b) {
  for(var c = new goog.string.StringBuffer, d = a.length, e = 0;;) {
    if(cljs.core._EQ_.call(null, d, e)) {
      return c.toString()
    }
    var f = a.charAt(e), g = cljs.core._lookup.call(null, b, f, null);
    cljs.core.truth_(g) ? c.append("" + cljs.core.str(g)) : c.append(f);
    e += 1
  }
};
var webster = {html:{}};
webster.html.sym_to_str = function(a) {
  return clojure.string.replace.call(null, "" + cljs.core.str(a), ":", "")
};
webster.html.attrs_to_str = function(a) {
  return clojure.string.join.call(null, " ", cljs.core.map.call(null, function(b) {
    var c = webster.html.sym_to_str.call(null, b);
    return cljs.core.format.call(null, '%s\x3d"%s"', c, a.call(null, b))
  }, cljs.core.keys.call(null, a)))
};
webster.html.compile_form = function compile_form(b) {
  if(cljs.core._EQ_.call(null, cljs.core.count.call(null, b), 1)) {
    return compile_form.call(null, cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, b), cljs.core.ObjMap.EMPTY, ""], !0))
  }
  if(cljs.core._EQ_.call(null, cljs.core.count.call(null, b), 2)) {
    return cljs.core.map_QMARK_.call(null, cljs.core.second.call(null, b)) ? compile_form.call(null, cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, b), cljs.core.second.call(null, b), ""], !0)) : compile_form.call(null, cljs.core.PersistentVector.fromArray([cljs.core.first.call(null, b), cljs.core.ObjMap.EMPTY, cljs.core.last.call(null, b)], !0))
  }
  var c = cljs.core.first.call(null, b), d = cljs.core.second.call(null, b);
  b = cljs.core.drop.call(null, 2, b);
  var c = webster.html.sym_to_str.call(null, c), e = webster.html.attrs_to_str.call(null, d), d = cljs.core._EQ_.call(null, 1, cljs.core.count.call(null, b)) ? cljs.core.string_QMARK_.call(null, cljs.core.first.call(null, b)) ? cljs.core.first.call(null, b) : compile_form.call(null, cljs.core.first.call(null, b)) : cljs.core.reduce.call(null, cljs.core.str, cljs.core.map.call(null, compile_form, b));
  return cljs.core.format.call(null, "\x3c%s%s\x3e%s\x3c/%s\x3e", c, function() {
    var b = cljs.core.empty_QMARK_.call(null, e);
    return b ? b : null == e
  }() ? "" : [cljs.core.str(" "), cljs.core.str(e)].join(""), d, c)
};
webster.html.compile = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core.str, cljs.core.map.call(null, webster.html.compile_form, a))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
webster.dom = {};
webster.dom.each_node = function(a, b) {
  for(var c = cljs.core.seq.call(null, cljs.core.range.call(null, a.length));;) {
    if(c) {
      var d = cljs.core.first.call(null, c);
      b.call(null, a.item(d));
      c = cljs.core.next.call(null, c)
    }else {
      return null
    }
  }
};
webster.dom.map_nodes = function(a, b) {
  return cljs.core.map.call(null, function(c) {
    return a.call(null, $(b.get(c)))
  }, cljs.core.range.call(null, b.length))
};
webster.dom.get_jnode = function(a, b) {
  return $(a.get(b))
};
webster.dom.get_column_span = function(a) {
  a = cljs.core.re_find.call(null, /span(\d+)/, a.attr("class"));
  return 1 < cljs.core.count.call(null, a) ? parseInt(cljs.core.second.call(null, a), 10) : 0
};
webster.dom.set_column_span = function(a, b) {
  var c = webster.dom.get_column_span.call(null, a);
  a.removeClass([cljs.core.str("span"), cljs.core.str(c)].join(""));
  return a.addClass([cljs.core.str("span"), cljs.core.str(b)].join(""))
};
webster.dom.increment_column_span = function(a) {
  return webster.dom.set_column_span.call(null, a, webster.dom.get_column_span.call(null, a) + 1)
};
webster.dom.decrement_column_span = function(a) {
  return webster.dom.set_column_span.call(null, a, webster.dom.get_column_span.call(null, a) - 1)
};
webster.dom.get_column_offset = function(a) {
  a = cljs.core.re_find.call(null, /offset(\d+)/, a.attr("class"));
  return 1 < cljs.core.count.call(null, a) ? parseInt(cljs.core.second.call(null, a), 10) : 0
};
webster.dom.set_column_offset = function(a, b) {
  var c = webster.dom.get_column_offset.call(null, a);
  a.removeClass([cljs.core.str("offset"), cljs.core.str(c)].join(""));
  return a.addClass([cljs.core.str("offset"), cljs.core.str(b)].join(""))
};
webster.dom.increment_column_offset = function(a) {
  return webster.dom.set_column_offset.call(null, a, webster.dom.get_column_offset.call(null, a) + 1)
};
webster.dom.decrement_column_offset = function(a) {
  return webster.dom.set_column_offset.call(null, a, webster.dom.get_column_offset.call(null, a) - 1)
};
webster.dom.get_column_width = function(a) {
  return webster.dom.get_column_span.call(null, a) + webster.dom.get_column_offset.call(null, a)
};
webster.dom.column_max = 12;
webster.dom.make_editable = function() {
  var a = function(a, b) {
    a.attr("contenteditable", "true");
    if(cljs.core.truth_(b)) {
      var e = rangy.createRange();
      e.setStart(a.get(0), 0);
      e.collapse(!0);
      return rangy.getSelection().setSingleRange(e)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
webster.dom.new_row = function() {
  return $(webster.html.compile.call(null, cljs.core.PersistentVector.fromArray(["\ufdd0:div", cljs.core.PersistentArrayMap.fromArray(["\ufdd0:class", "row-fluid selectable"], !0), cljs.core.PersistentVector.fromArray(["\ufdd0:div", cljs.core.PersistentArrayMap.fromArray(["\ufdd0:class", "span4 empty"], !0)], !0), cljs.core.PersistentVector.fromArray(["\ufdd0:div", cljs.core.PersistentArrayMap.fromArray(["\ufdd0:class", "span8 empty"], !0)], !0)], !0)))
};
webster.listeners = {};
webster.listeners.selected_listener = function(a) {
  return cljs.core._EQ_.call(null, a.target, a.currentTarget) ? a.stopPropagation() : null
};
webster.listeners.default_listener = function(a, b) {
  webster.listeners.make_unselected.call(null, $(".selected"));
  $("[contenteditable\x3dtrue]").removeAttr("contenteditable");
  return b.callHandler("defaultSelectedHandler", {})
};
webster.listeners.container_listener = function(a, b) {
  var c = $(a.currentTarget);
  return cljs.core.truth_(function() {
    var a = cljs.core.not.call(null, c.hasClass("selected"));
    return a ? webster.listeners.nothing_selected.call(null) : a
  }()) ? (webster.listeners.select_node.call(null, c, b), a.stopPropagation(), a.preventDefault()) : null
};
webster.listeners.select_node = function(a, b) {
  var c = webster.listeners.node_info.call(null, a);
  webster.listeners.make_selected.call(null, a);
  return b.callHandler("containerSelectedHandler", c)
};
webster.listeners.node_info = function node_info(b) {
  var c = b.offset(), d = b.width(), e = b.height(), c = cljs.core.PersistentArrayMap.fromArray(["\ufdd0:top", c.top, "\ufdd0:left", c.left, "\ufdd0:width", d, "\ufdd0:height", e, "\ufdd0:tag", b.prop("tagName"), "\ufdd0:classes", b.attr("class").split(" ")], !0);
  return cljs.core.clj__GT_js.call(null, cljs.core.truth_(webster.listeners.is_row_QMARK_.call(null, b)) ? cljs.core.conj.call(null, c, cljs.core.PersistentVector.fromArray(["\ufdd0:children", webster.dom.map_nodes.call(null, node_info, b.find("\x3e div"))], !0)) : c)
};
webster.listeners.get_selected = function() {
  return $(".selected")
};
webster.listeners.nothing_selected = function() {
  return cljs.core._EQ_.call(null, $(".selected").length, 0)
};
webster.listeners.make_selected = function(a) {
  var b = a.get(0);
  a.addClass("selected");
  return cljs.core.truth_(b) ? b.addEventListener("click", webster.listeners.selected_listener) : null
};
webster.listeners.make_unselected = function(a) {
  var b = a.get(0);
  a.removeClass("selected");
  return cljs.core.truth_(b) ? b.removeEventListener("click", webster.listeners.selected_listener) : null
};
webster.listeners.is_selected = function(a) {
  return a.hasClass("selected")
};
webster.listeners.is_row_QMARK_ = function(a) {
  return a.hasClass("row-fluid")
};
webster.main = {};
webster.main.on_bridge_ready = function(a) {
  var b = a.bridge;
  b.init("handler?");
  webster.dom.each_node.call(null, document.getElementsByClassName("selectable"), function(a) {
    return a.addEventListener("click", function(a) {
      return webster.listeners.container_listener.call(null, a, b)
    }, !1)
  });
  document.addEventListener("click", function(a) {
    return webster.listeners.default_listener.call(null, a, b)
  }, !1);
  b.registerHandler("removeElementHandler", function(a, d) {
    return webster.main.remove_element_handler.call(null, a, d, b)
  });
  b.registerHandler("editElementHandler", webster.main.edit_element_handler);
  b.registerHandler("addRowUnderSelectedElement", function(a, d) {
    return webster.main.add_row_handler.call(null, a, d, b)
  });
  b.registerHandler("incrementColumn", webster.main.increment_column);
  b.registerHandler("decrementColumn", webster.main.decrement_column);
  b.registerHandler("incrementColumnOffset", webster.main.increment_column_offset);
  return b.registerHandler("decrementColumnOffset", webster.main.decrement_column_offset)
};
webster.main.increment_column_offset = function(a, b) {
  var c = webster.listeners.get_selected.call(null), d = parseInt(a.index), e = c.find("\x3e div"), d = webster.dom.get_jnode.call(null, e, d);
  1 < webster.dom.get_column_span.call(null, d) && (webster.dom.decrement_column_span.call(null, d), webster.dom.increment_column_offset.call(null, d));
  return b.call(null, webster.listeners.node_info.call(null, c))
};
webster.main.decrement_column = function(a, b) {
  var c = webster.listeners.get_selected.call(null), d = parseInt(a.index), e = c.find("\x3e div"), d = webster.dom.get_jnode.call(null, e, d);
  1 < webster.dom.get_column_span.call(null, d) && webster.dom.decrement_column_span.call(null, d);
  return b.call(null, webster.listeners.node_info.call(null, c))
};
webster.main.decrement_column_offset = function(a, b) {
  var c = webster.listeners.get_selected.call(null), d = parseInt(a.index, 10), e = c.find("\x3e div"), d = webster.dom.get_jnode.call(null, e, d), e = webster.dom.get_column_offset.call(null, d);
  0 < e && (console.log(e), webster.dom.set_column_offset.call(null, d, e - 1), webster.dom.set_column_span.call(null, d, webster.dom.get_column_span.call(null, d) + 1));
  return b.call(null, webster.listeners.node_info.call(null, c))
};
webster.main.increment_column = function(a, b) {
  var c = webster.listeners.get_selected.call(null), d = parseInt(a.index, 10), e = c.find("\x3e div"), f = e.length, g = webster.dom.get_jnode.call(null, e, d), h = webster.dom.get_column_span.call(null, g), j = cljs.core.map.call(null, function(a) {
    return webster.dom.get_jnode.call(null, e, a)
  }, cljs.core.range.call(null, f)), f = cljs.core.map.call(null, function(a) {
    return webster.dom.get_jnode.call(null, e, a)
  }, cljs.core.range.call(null, d + 1, f)), d = cljs.core.filter.call(null, function(a) {
    return 1 < webster.dom.get_column_span.call(null, a)
  }, f), f = cljs.core.filter.call(null, function(a) {
    return 0 < webster.dom.get_column_offset.call(null, a)
  }, f), d = cljs.core.first.call(null, d), f = cljs.core.first.call(null, f), j = cljs.core._EQ_.call(null, 12, cljs.core.reduce.call(null, cljs.core._PLUS_, cljs.core.map.call(null, webster.dom.get_column_width, j)));
  cljs.core.truth_(f) ? webster.dom.set_column_offset.call(null, f, webster.dom.get_column_offset.call(null, f) - 1) : cljs.core.truth_(j ? d : j) && webster.dom.set_column_span.call(null, d, webster.dom.get_column_span.call(null, d) - 1);
  cljs.core.truth_(cljs.core.truth_(f) ? f : cljs.core.truth_(d) ? d : !j) && webster.dom.set_column_span.call(null, g, 1 + h);
  return b.call(null, webster.listeners.node_info.call(null, c))
};
webster.main.remove_element_handler = function() {
  var a = null, b = function() {
    var a = $(".selected");
    webster.listeners.make_unselected.call(null, a);
    return a.remove()
  }, c = function(b, c, f) {
    a.call(null, b, c);
    return webster.listeners.default_listener.call(null, null, f)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
webster.main.edit_element_handler = function() {
  var a = $(".selected");
  return webster.dom.make_editable.call(null, a, !0)
};
webster.main.add_row_handler = function(a, b, c) {
  a = webster.listeners.get_selected.call(null);
  b = webster.dom.new_row.call(null);
  a.append(b);
  webster.listeners.default_listener.call(null, null, c);
  b.get(0).addEventListener("click", function(a) {
    return webster.listeners.container_listener.call(null, a, c)
  });
  return webster.listeners.select_node.call(null, b, c)
};
document.addEventListener("WebViewJavascriptBridgeReady", webster.main.on_bridge_ready, !1);
