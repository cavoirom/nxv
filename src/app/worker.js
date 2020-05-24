const cacheName = 'v1';
const preCacheRoutes = ['/', '/index.html'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('Pre-cache listed resources: ', preCacheRoutes);
      return cache.addAll(preCacheRoutes);
    }),
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const toBeCachedResponse = response.clone();

        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, toBeCachedResponse);
        });

        return response;
      });
    }),
  );
});
