const assetCacheName = 'asset';
// preCacheResources will be cleaned up and pre-cached every time we install service worker.
const preCacheResources = ['/', '/index.html'];
// CacheResources will be keep every time we activate service worker, to reduce cache size.
const cacheResources = [
  '/IBMPlexSans-Bold.4dfaebd3.ttf',
  '/IBMPlexSans-Bold.9bf2f545.svg',
  '/IBMPlexSans-Bold.9f766d0a.woff',
  '/IBMPlexSans-Bold.eb647a17.eot',
  '/IBMPlexSans-BoldItalic.0be4c971.svg',
  '/IBMPlexSans-BoldItalic.6b960924.eot',
  '/IBMPlexSans-BoldItalic.a74a87a4.ttf',
  '/IBMPlexSans-BoldItalic.d5946f79.woff',
  '/IBMPlexSans-Italic.0bbe81ad.svg',
  '/IBMPlexSans-Italic.3ab9eaea.woff',
  '/IBMPlexSans-Italic.94529531.ttf',
  '/IBMPlexSans-Italic.ec6868b4.eot',
  '/IBMPlexSans-Regular.0fa616bf.svg',
  '/IBMPlexSans-Regular.97a23001.ttf',
  '/IBMPlexSans-Regular.b7fe0cc8.woff',
  '/IBMPlexSans-Regular.d9968fd3.eot',
  '/app.320a5a69.css',
  '/app.320a5a69.css.map',
  '/app.69f3c742.js',
  '/app.69f3c742.js.map',
  '/app.d29b5467.js',
  '/app.d29b5467.js.map',
  '/app.fa1796bf.css',
  '/app.fa1796bf.css.map',
  '/favicon.eb18f3b3.ico',
  '/index.html',
  '/manifest.webmanifest',
  '/',
];

self.addEventListener('install', (event) => {
  // Pre-cache these resources to help page works offline.
  const hostUrl = new URL(event.target.registration.scope);
  event.waitUntil(
    caches
      .open(assetCacheName)
      .then((assetCache) => Promise.all([Promise.resolve(assetCache), assetCache.keys()]))
      .then(([assetCache, keys]) =>
        Promise.all([
          Promise.resolve(assetCache),
          keys.map((key) => {
            // Clean up pre-cached resources because they may out dated and they will be excluded when clean up the
            // cache in activate event.
            const url = new URL(key.url);
            if (hostUrl.host === url.host && preCacheResources.indexOf(url.pathname) > -1) {
              console.log('Clean up pre-cached resource: ', key.url);
              return assetCache.delete(key);
            }
          }),
        ]),
      )
      .then(([assetCache]) => assetCache.addAll(preCacheResources)),
  );
});

self.addEventListener('activate', (event) => {
  // Clean up the caches every time a new version activated to reduce cache size.
  const hostUrl = new URL(event.target.registration.scope);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            console.log('Found cache: ', key);
            if (key !== assetCacheName) {
              console.log('Delete out dated cache: ', key);
              return caches.delete(key);
            }
          }),
        ),
      )
      .then(() => caches.open(assetCacheName))
      .then((assetCache) => Promise.all([Promise.resolve(assetCache), assetCache.keys()]))
      .then(([assetCache, keys]) =>
        Promise.all(
          keys.map((key) => {
            const url = new URL(key.url);
            if (hostUrl.host !== url.host || cacheResources.indexOf(url.pathname) === -1) {
              console.log('Clean up cached resource: ', key.url);
              return assetCache.delete(key);
            }
            console.log('Resource unchanged, keep the cache: ', key.url);
          }),
        ),
      ),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const toBeCachedResponse = response.clone();

        caches.open(assetCacheName).then((cache) => {
          cache.put(event.request, toBeCachedResponse);
        });

        return response;
      });
    }),
  );
});
