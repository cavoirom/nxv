import CacheStore from './cache-store/cache-store.js';
import HomeCollector from './collector/home-collector.js';
import BlogCollector from './collector/blog-collector.js';
import config from './config.js';
import StaticPageRenderer from './renderer/static-page-renderer.js';
import BlogEntryCollector from './collector/blog-entry-collector.js';
import BlogEntryRenderer from './renderer/blog-entry-renderer.js';
import { ensureDirSync, expandGlobSync } from '../deps/fs.js';
import BlogTagCollector from './collector/blog-tag-collector.js';

function _generateDefaultState(config) {
  // Generate default state
  ensureDirSync(`${config.output}/api`);
  Deno.writeTextFileSync(
    `${config.output}/api/default.json`,
    JSON.stringify(config.defaultState),
  );
}

function _generateCacheRoutes(config) {
  // TODO should reimplement this cache.
  const excludedPaths = [
    '',
    'blog',
    'blog/index.json',
    'index.html',
    'api',
    'api/blog.json',
    'worker.js',
    'worker.js.map',
    'CNAME',
    '.DS_Store',
  ];
  const additionalPaths = [];

  // List all files in /build/dist folder
  const fileNames = [...expandGlobSync(`${config.output}/*`)].map((item) =>
    item.path
  ).map((item) => item.substring(config.output.length + 1));

  // Create routes to be caches in local
  const cacheIdentifier = `asset-${new Date().getTime()}`;
  const precachedResources = fileNames
    .concat(additionalPaths)
    .filter((fileName) => !excludedPaths.includes(fileName))
    .map((fileName) => `'/${fileName}'`)
    .join(',');
  const excludedResources = excludedPaths.map((excludedPath) =>
    `'/${excludedPath}'`
  ).join(',');

  // Replace the place holder routes array with real informations
  const workerPath = `${config.output}/worker.js`;
  const workerText = Deno.readTextFileSync(workerPath)
    .replace('<cache-identifier>', cacheIdentifier)
    .replace(`'<precached-resources>'`, precachedResources)
    .replace(`'<excluded-resources>'`, excludedResources);
  Deno.writeTextFileSync(workerPath, workerText);
}

async function generate(config) {
  // Path to cache database
  const db = ':memory:';
  // const db = './cache.sqlite';
  // The cache store
  const cacheStore = new CacheStore(db);
  // Initialize the database schema
  cacheStore.initialize();
  // The collectors to generate cache metadata
  const collectors = [
    new HomeCollector(cacheStore, config),
    new BlogEntryCollector(cacheStore, config),
    new BlogCollector(cacheStore, config),
    new BlogTagCollector(cacheStore, config),
  ];
  // Collect the pages
  for (const collector of collectors) {
    await collector.collect();
  }
  // Render the pages
  const pages = cacheStore.findAllPages();
  const renderers = {
    STATIC: new StaticPageRenderer(config),
    BLOG: new StaticPageRenderer(config),
    BLOG_ENTRY: new BlogEntryRenderer(config),
    BLOG_TAG: new StaticPageRenderer(config),
  };

  for (const page of pages) {
    const renderer = renderers[page.type];
    if (renderer) {
      console.log(`Render page: ${page.url}`);
      await renderer.render(page);
    } else {
      console.log(`No renderer for page: ${page.type} ${page.url}`);
    }
  }

  _generateDefaultState(config);

  _generateCacheRoutes(config);

  cacheStore.close();
}

await generate(config);
