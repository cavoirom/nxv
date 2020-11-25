import config from './config';
import generateCacheRoutes from './generate-cache-routes';
import generatePage from './pages';
import { buildBlogRoute, buildDefaultRoute } from './default-routes';
import { buildBlogEntryRoute, buildBlogEntry, findBlogEntryPaths } from './blog-entries';
import fs from 'fs';

const routes = [];

// Build default routes and their state from config.
const defaultRoutes = config.defaultPathnames.map((pathname) => buildDefaultRoute(pathname, config.defaultState));
routes.push(...defaultRoutes);

// Find all paths to the blog's markdown file.
const blogEntryPaths = findBlogEntryPaths(`${config.content}/blog`);
const blogEntries = blogEntryPaths.map(buildBlogEntry).sort((a, b) => b.created - a.created);
const blogEntryRoutes = blogEntries.map(buildBlogEntryRoute);
routes.push(...blogEntryRoutes);

// Build blog route with preview blog entries
routes.push(buildBlogRoute(config.defaultState, blogEntries));

// Generate default state
fs.mkdirSync(`${config.output}/api`, { recursive: true });
fs.writeFileSync(`${config.output}/api/default.json`, JSON.stringify(config.defaultState), { encoding: 'utf8' });

// Server Side Rendering static page for each route
routes.forEach(generatePage);

// update cache routes in worker include generated files
generateCacheRoutes();
