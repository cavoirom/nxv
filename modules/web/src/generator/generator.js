import fs from 'fs';
import config from './config';
import { BlogEntryCollector, BlogEntryPageGenerator, BlogEntryRouteBuilder } from './blog-entries';
import { DefaultCollector, DefaultPageGenerator, DefaultRouteBuilder } from './defaults';
import { BlogCollector, BlogPageGenerator, BlogRouteBuilder } from './blogs';

/*
 * The collectors will based on configuration to explore the pathnames.
 */
function collectPathnames(collectors) {
  const reducer = (accumulator, currentValue) => accumulator.concat(currentValue);
  return collectors.map((collector) => collector.collectPathnames()).reduce(reducer, []);
}

/*
 * The builders will create route with all required information to generate page.
 * Route structure:
 * - pathname
 * - state
 * - (route specific metadata based on individual type)
 */
function buildRoutes(builders, pathnames) {
  return pathnames
    .map((pathname) => {
      const builder = builders.find((builder) => {
        if (builder.isValid(pathname)) {
          return builder;
        }
      });
      if (builder) {
        return builder.buildRoute(pathname);
      }
    })
    .filter((route) => !!route);
}

/*
 * The generators will base on route to generate static page.
 * Generated artifact:
 * - index.html
 * - index.json
 * - partial.json
 * - (page specific artifact such as image, icon...)
 */
function generatePages(generators, routes) {
  // Generate default state
  fs.mkdirSync(`${config.output}/api`, { recursive: true });
  fs.writeFileSync(`${config.output}/api/default.json`, JSON.stringify(config.defaultState), { encoding: 'utf8' });

  routes.forEach((route) => {
    console.log(`Generated: ${route.pathname}`);
    const generator = generators.find((generator) => {
      if (generator.isValid(route)) {
        return generator;
      }
    });
    if (generator) {
      generator.generatePage(route);
    }
  });
}

function generateCacheRoutes() {
  const excludedPaths = ['', 'index.html', 'api', 'worker.js', 'worker.js.map', 'CNAME'];
  const additionalPaths = [];

  // List all files in /build/dist folder
  const fileNames = fs.readdirSync(config.output);

  // Create routes to be caches in local
  const cacheRoutes = fileNames
    .concat(additionalPaths)
    .filter((fileName) => !excludedPaths.includes(fileName))
    .map((fileName) => `"/${fileName}"`)
    .join(',');

  // Replace the place holder routes array with real informations
  const workerPath = `${config.output}/worker.js`;
  const workerText = fs.readFileSync(workerPath, 'utf8');
  fs.writeFileSync(workerPath, workerText.replace('"route-place-holder"', cacheRoutes), { encoding: 'utf8' });
}

function main() {
  const pathnames = collectPathnames([
    new DefaultCollector(config),
    new BlogCollector(config),
    new BlogEntryCollector(config),
  ]);

  const routes = buildRoutes(
    [new DefaultRouteBuilder(config), new BlogRouteBuilder(config), new BlogEntryRouteBuilder(config)],
    pathnames
  );

  generatePages(
    [new DefaultPageGenerator(config), new BlogPageGenerator(config), new BlogEntryPageGenerator(config)],
    routes
  );

  generateCacheRoutes();
}

main();
