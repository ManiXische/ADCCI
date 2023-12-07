/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/url-search-params-polyfill@8.1.0/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(t){"use strict";var n,r=function(){try{if(t.URLSearchParams&&"bar"===new t.URLSearchParams("foo=bar").get("foo"))return t.URLSearchParams}catch(t){}return null}(),e=r&&"a=1"===new r({a:1}).toString(),o=r&&"+"===new r("s=%2B").get("s"),i="__URLSearchParams__",a=!r||((n=new r).append("s"," &"),"s=+%26"===n.toString()),c=h.prototype,s=!(!t.Symbol||!t.Symbol.iterator);if(!(r&&e&&o&&a)){c.append=function(t,n){v(this[i],t,n)},c.delete=function(t){delete this[i][t]},c.get=function(t){var n=this[i];return this.has(t)?n[t][0]:null},c.getAll=function(t){var n=this[i];return this.has(t)?n[t].slice(0):[]},c.has=function(t){return d(this[i],t)},c.set=function(t,n){this[i][t]=[""+n]},c.toString=function(){var t,n,r,e,o=this[i],a=[];for(n in o)for(r=l(n),t=0,e=o[n];t<e.length;t++)a.push(r+"="+l(e[t]));return a.join("&")};var u=!!o&&r&&!e&&t.Proxy;Object.defineProperty(t,"URLSearchParams",{value:u?new Proxy(r,{construct:function(t,n){return new t(new h(n[0]).toString())}}):h});var f=t.URLSearchParams.prototype;f.polyfill=!0,f.forEach=f.forEach||function(t,n){var r=y(this.toString());Object.getOwnPropertyNames(r).forEach(function(e){r[e].forEach(function(r){t.call(n,r,e,this)},this)},this)},f.sort=f.sort||function(){var t,n,r,e=y(this.toString()),o=[];for(t in e)o.push(t);for(o.sort(),n=0;n<o.length;n++)this.delete(o[n]);for(n=0;n<o.length;n++){var i=o[n],a=e[i];for(r=0;r<a.length;r++)this.append(i,a[r])}},f.keys=f.keys||function(){var t=[];return this.forEach(function(n,r){t.push(r)}),g(t)},f.values=f.values||function(){var t=[];return this.forEach(function(n){t.push(n)}),g(t)},f.entries=f.entries||function(){var t=[];return this.forEach(function(n,r){t.push([r,n])}),g(t)},s&&(f[t.Symbol.iterator]=f[t.Symbol.iterator]||f.entries)}function h(t){((t=t||"")instanceof URLSearchParams||t instanceof h)&&(t=t.toString()),this[i]=y(t)}function l(t){var n={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(t).replace(/[!'\(\)~]|%20|%00/g,function(t){return n[t]})}function p(t){return t.replace(/[ +]/g,"%20").replace(/(%[a-f0-9]{2})+/gi,function(t){return decodeURIComponent(t)})}function g(n){var r={next:function(){var t=n.shift();return{done:void 0===t,value:t}}};return s&&(r[t.Symbol.iterator]=function(){return r}),r}function y(t){var n={};if("object"==typeof t)if(S(t))for(var r=0;r<t.length;r++){var e=t[r];if(!S(e)||2!==e.length)throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");v(n,e[0],e[1])}else for(var o in t)t.hasOwnProperty(o)&&v(n,o,t[o]);else{0===t.indexOf("?")&&(t=t.slice(1));for(var i=t.split("&"),a=0;a<i.length;a++){var c=i[a],s=c.indexOf("=");-1<s?v(n,p(c.slice(0,s)),p(c.slice(s+1))):c&&v(n,p(c),"")}}return n}function v(t,n,r){var e="string"==typeof r?r:null!=r&&"function"==typeof r.toString?r.toString():JSON.stringify(r);d(t,n)?t[n].push(e):t[n]=[e]}function S(t){return!!t&&"[object Array]"===Object.prototype.toString.call(t)}function d(t,n){return Object.prototype.hasOwnProperty.call(t,n)}}("undefined"!=typeof global?global:"undefined"!=typeof window?window:this);
//# sourceMappingURL=/sm/58f69aede6b47898937cc52ddc30714797df9f672c79c70e200a62bfedd60cb3.map