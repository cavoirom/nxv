import { log } from './shared/logger.js';

// The cachName will identify the current cache version, every release will
// have different cache version to prevent oudated files being cached and new
// resources are not served correctly.
//
// The place holders will be replaced when running the
// generator.
const cacheIdentifier = '<cache-identifier>';
// PrecachedResources will be keep every time we activate service worker,
// other routes will be cleaned up to reduce cache size.
const precachedResources = ['<precached-resources>'];
// excludedResources will not be cached to prevent outdated.
const excludedResources = ['<excluded-resources>'];

self.addEventListener('install', (event) => {
  // Pre-cache these resources to help page works offline.
  event.waitUntil(
    caches.open(cacheIdentifier).then((currentCache) =>
      currentCache.addAll(precachedResources)
    ),
  );
});

self.addEventListener('activate', (event) => {
  // Clean up the caches every time a new version activated to reduce cache size.
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          log.debug('Found cacheIdentifier: ', cacheName);
          if (cacheName !== cacheIdentifier) {
            log.debug('Delete out dated cacheIdentifier: ', cacheName);
            return caches.delete(cacheName);
          }
        }),
      )
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
        // Will not cache response which is not present, not successful, or not normal.
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Will not cache excluded resources
        const requestUrl = new URL(event.request.url);
        if (excludedResources.indexOf(requestUrl.pathname) !== -1) {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const toBeCachedResponse = response.clone();

        caches.open(cacheIdentifier).then((cache) => {
          cache.put(event.request, toBeCachedResponse);
        });

        return response;
      });
    }),
  );
});
