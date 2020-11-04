import * as path from 'path';
import config from './config';
import generateCacheRoutes from './generate-cache-routes';
import generatePage from './page-generator';
import { buildDefaultRoute, findBlogEntryPaths, buildBlogEntry } from './route-builder';
import {buildBlogEntryRoute} from './blog-entries';

const routes = [];
// Find all paths to the blog's markdown file.
const blogEntryPaths = findBlogEntryPaths(path.resolve(__dirname, '../../src/blog'));
const blogEntries = blogEntryPaths
    .map(buildBlogEntry)
    .sort((a, b) => b.created - a.created);
const blogEntryRoutes = blogEntries.map(buildBlogEntryRoute);

// Build default routes and their state from config.
blogEntries.forEach((entry) => {
  const previewBlogEntries = (({ content, ...rest }) => rest)(entry);
  config.defaultState.blog.entries.push(previewBlogEntries);
});
const defaultRoutes = config.defaultPathnames
    .map((pathname) => buildDefaultRoute(pathname, config.defaultState));
routes.push(...defaultRoutes);

routes.push(...blogEntryRoutes);

// Server Side Rendering static page for each route
routes.forEach(generatePage);

// update cache routes in worker include generated files
generateCacheRoutes();
