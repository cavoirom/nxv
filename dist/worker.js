parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iltZ":[function(require,module,exports) {
function e(e,a){return o(e)||r(e,a)||n(e,a)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function r(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,r=!1,o=void 0;try{for(var l,s=e[Symbol.iterator]();!(a=(l=s.next()).done)&&(n.push(l.value),!t||n.length!==t);a=!0);}catch(c){r=!0,o=c}finally{try{a||null==s.return||s.return()}finally{if(r)throw o}}return n}}function o(e){if(Array.isArray(e))return e}var l="asset",s=["/","/index.html"],c=["/IBMPlexSans-Bold.4dfaebd3.ttf","/IBMPlexSans-Bold.9bf2f545.svg","/IBMPlexSans-Bold.9f766d0a.woff","/IBMPlexSans-Bold.eb647a17.eot","/IBMPlexSans-BoldItalic.0be4c971.svg","/IBMPlexSans-BoldItalic.6b960924.eot","/IBMPlexSans-BoldItalic.a74a87a4.ttf","/IBMPlexSans-BoldItalic.d5946f79.woff","/IBMPlexSans-Italic.0bbe81ad.svg","/IBMPlexSans-Italic.3ab9eaea.woff","/IBMPlexSans-Italic.94529531.ttf","/IBMPlexSans-Italic.ec6868b4.eot","/IBMPlexSans-Regular.0fa616bf.svg","/IBMPlexSans-Regular.97a23001.ttf","/IBMPlexSans-Regular.b7fe0cc8.woff","/IBMPlexSans-Regular.d9968fd3.eot","/app.13e74d63.js","/app.13e74d63.js.map","/app.6bb7ffb8.css","/app.6bb7ffb8.css.map","/app.8e976e8a.js","/app.8e976e8a.js.map","/app.ddab8523.css","/app.ddab8523.css.map","/favicon.eb18f3b3.ico","/index.html","/manifest.webmanifest","/"];self.addEventListener("install",function(t){var n=new URL(t.target.registration.scope);t.waitUntil(caches.open(l).then(function(e){return Promise.all([Promise.resolve(e),e.keys()])}).then(function(t){var a=e(t,2),r=a[0],o=a[1];return Promise.all([Promise.resolve(r),o.map(function(e){var t=new URL(e.url);if(n.host===t.host&&s.indexOf(t.pathname)>-1)return console.log("Clean up pre-cached resource: ",e.url),r.delete(e)})])}).then(function(t){return e(t,1)[0].addAll(s)}))}),self.addEventListener("activate",function(t){var n=new URL(t.target.registration.scope);t.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){if(console.log("Found cache: ",e),e!==l)return console.log("Delete out dated cache: ",e),caches.delete(e)}))}).then(function(){return caches.open(l)}).then(function(e){return Promise.all([Promise.resolve(e),e.keys()])}).then(function(t){var a=e(t,2),r=a[0],o=a[1];return Promise.all(o.map(function(e){var t=new URL(e.url);if(n.host!==t.host||-1===c.indexOf(t.pathname))return console.log("Clean up cached resource: ",e.url),r.delete(e);console.log("Resource unchanged, keep the cache: ",e.url)}))}))}),self.addEventListener("fetch",function(e){e.respondWith(caches.match(e.request).then(function(t){return t||fetch(e.request).then(function(t){if(!t||200!==t.status||"basic"!==t.type)return t;var n=t.clone();return caches.open(l).then(function(t){t.put(e.request,n)}),t})}))});
},{}]},{},["iltZ"], null)
//# sourceMappingURL=/worker.js.map