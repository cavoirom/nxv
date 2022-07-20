import { assertEquals } from '../../../deps/testing.js';
import CacheStore from '../../../generator/cache-store/cache-store.js';
import CachedPage from '../../../generator/cache-store/cached-page.js';

Deno.test('should store page and load page successfully.', () => {
  const cacheStore = new CacheStore(':memory:');
  const page = CachedPage.newStatic('/home', 'STATIC', {}, {});
  cacheStore.addPage(page);
  const storedPages = cacheStore.findAllPages();
  const storedPage = storedPages[0];
  cacheStore.close();

  // Assert stored page
  assertEquals(storedPages.length, 1);
  assertEquals(storedPage.url, page.url);
});
