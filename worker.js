var c={debug(e,...t){console.log(e,...t)},info(e,...t){console.log(e,...t)},error(e,...t){console.error(e,...t)}};var n="asset-1729818995157",d=["/favicon.ico","/home","/index.css","/index.js","/manifest.webmanifest"],l=["/","/.DS_Store","/CNAME","/api","/api/blog.json","/blog","/blog/index.json","/index.css.map","/index.html","/robots.txt","/worker.js","/worker.js.map"];self.addEventListener("install",e=>{e.waitUntil(caches.open(n).then(t=>t.addAll(d)))});self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(t=>Promise.all(t.map(r=>{if(c.debug("Found cacheIdentifier: ",r),r!==n)return c.debug("Delete out dated cacheIdentifier: ",r),caches.delete(r)}))))});self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request).then(r=>{if(!r||r.status!==200||r.type!=="basic")return r;let i=new URL(e.request.url);if(l.indexOf(i.pathname)!==-1)return r;let o=r.clone();return caches.open(n).then(s=>{s.put(e.request,o)}),r})))});