import { log } from './shared/logger';

const assetCacheName = 'asset';
// cacheResources will be keep every time we activate service worker, other routes will be cleaned up to reduce cache size.
const cacheResources = ['route-place-holder'];
// networkResources will be fetch for every request.
const networkResources = cacheResources.filter(
  (route) => ['/', '/blog', '/home'].indexOf(route) > -1 || route.endsWith('.html') || route.endsWith('.json'),
);

self.addEventListener('install', (event) => {
  // Pre-cache these resources to help page works offline.
  event.waitUntil(caches.open(assetCacheName).then((assetCache) => assetCache.addAll(cacheResources)));
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
            log.debug('Found cache: ', key);
            if (key !== assetCacheName) {
              log.debug('Delete out dated cache: ', key);
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
              log.debug('Clean up outdated resource: ', key.url);
              return assetCache.delete(key);
            }
            log.debug('Resource unchanged, keep the cache: ', key.url);
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
