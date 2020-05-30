const assetCacheName = 'asset';
// preCacheResources will be cleaned up and pre-cached every time we install service worker.
const preCacheResources = ['/', '/index.html'];
// CacheResources will be keep every time we activate service worker, to reduce cache size.
const cacheResources = ['rout-place-holder'];

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
