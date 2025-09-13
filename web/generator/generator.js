import CacheStore from './cache-store/cache-store.js';
import HomeCollector from './collector/home-collector.js';
import BlogCollector from './collector/blog-collector.js';
import StaticPageRenderer from './renderer/static-page-renderer.js';
import BlogEntryCollector from './collector/blog-entry-collector.js';
import BlogEntryRenderer from './renderer/blog-entry-renderer.js';
import { ensureDir, expandGlob } from '../deps/fs.js';
import BlogTagCollector from './collector/blog-tag-collector.js';
import FeedRenderer from './renderer/feed-renderer.js';
import FeedCollector from './collector/feed-collector.js';
import { argsParse } from '../deps/cli.js';
import { dirname, resolve } from '../deps/path.js';

async function _generateDefaultState(config) {
  // Generate default state
  const output = resolve(`${config.workingDirectory}/${config.output}`);
  await ensureDir(`${output}/api`);
  await Deno.writeTextFile(
    `${output}/api/default.json`,
    JSON.stringify(config.defaultState),
  );
}

async function _generateCacheRoutes(config) {
  // TODO should reimplement this cache.
  const excludedPaths = [
    '',
    '.DS_Store',
    'CNAME',
    'api',
    'api/blog.json',
    'blog',
    'blog/index.json',
    'index.css.map',
    'index.html',
    'robots.txt',
    'worker.js',
    'worker.js.map',
  ];
  const additionalPaths = [];

  // List all files in /build/dist folder
  const fileNames = [];
  const output = resolve(`${config.workingDirectory}/${config.output}`);
  for await (const item of expandGlob(`${output}/*`)) {
    const path = item.path;
    fileNames.push(path.substring(output.length + 1));
  }

  // Create routes to be caches in local
  const cacheIdentifier = `asset-${new Date().getTime()}`;
  const precachedResources = fileNames
    .concat(additionalPaths)
    .filter((fileName) => !excludedPaths.includes(fileName))
    .map((fileName) => `"/${fileName}"`)
    .join(',');
  const excludedResources = excludedPaths.map((excludedPath) =>
    `"/${excludedPath}"`
  ).join(',');

  // Replace the placeholder routes array with real information
  // The double quotes or single quotes is depending on
  // google-closure-compiler.
  const workerPath = `${output}/worker.js`;
  const workerText = (await Deno.readTextFile(workerPath))
    .replace('<cache-identifier>', cacheIdentifier)
    .replace(`"<precached-resources>"`, precachedResources)
    .replace(`"<excluded-resources>"`, excludedResources);
  await Deno.writeTextFile(workerPath, workerText);
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
    new FeedCollector(cacheStore, config),
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
    FEED: new FeedRenderer(config),
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

  await _generateDefaultState(config);

  await _generateCacheRoutes(config);

  cacheStore.close();
}

async function main(args) {
  const parsedArgs = argsParse(args, {
    alias: { c: 'config' },
  });

  const configPath = parsedArgs.config;
  if (!configPath) {
    console.error(
      'No configuration file provided. Please use --config to provide the path to configuration file.',
    );
    return 1;
  }
  const config = JSON.parse(await Deno.readTextFile(configPath));
  // The `workingDirectory` will be used to resolve relative path inside the configuration.
  config.workingDirectory = resolve(dirname(configPath));

  await generate(config);
}

if (import.meta.main) {
  Deno.exit(await main(Deno.args));
}
