import CacheStore from '../../../src/generator/cache-store/cache-store';
import CachedPage from '../../../src/generator/cache-store/cached-page';

test('should store page and load page successfully.', async () => {
  const cacheStore = new CacheStore(':memory:');
  cacheStore.initialize();
  const page = CachedPage.newStatic('/home', 'STATIC', {}, {});
  await cacheStore.addPage(page);
  const storedPages = await cacheStore.findAllPages();
  const storedPage = storedPages[0];

  // Assert stored page
  expect(storedPages.length).toEqual(1);
  expect(storedPage.url).toEqual(page.url);
});
