import { h } from 'preact';
import render from 'preact-render-to-string';
import { StoreProvider as Provider } from '@preact-hooks/unistore';
import { Router } from 'wouter-preact';
import * as fs from 'fs';
import * as path from 'path';

import staticLocationHook from 'wouter-preact/static-location';
import App from '../app/container/app/app';
import { configureStore } from '../app/store/store';

import config from './config';
import buildState from './build-state';
import buildMainTemplate from './main-template';
import generateCacheRoutes from './generate-cache-routes';
import findBlogEntry from './find-blog-entry';
import buildBlogEntry from './build-blog-entry';
import { toEntryUrl } from '../app/shared/blog-entries';

const routes = ['', '/home', '/blog'];

// Collect markdown files
const blogEntries = findBlogEntry(path.resolve(__dirname, '../../src/blog'));
const blog = { entries: [] };
blogEntries
  .map((entryPath) => buildBlogEntry(entryPath))
  .sort((a, b) => b.created - a.created)
  .forEach((entry) => {
    const previewBlogEntries = (({ content, ...rest }) => rest)(entry);
    const json = JSON.stringify(entry);
    blog.entries.push(previewBlogEntries);
    const year = entry.created.getFullYear();
    const month = String(entry.created.getMonth() + 1).padStart(2, '0');
    const day = String(entry.created.getDate()).padStart(2, '0');

    fs.mkdirSync(path.resolve(__dirname, `api/blog/entry/${year}/${month}/${day}`), { recursive: true });
    fs.writeFileSync(
      path.resolve(__dirname, `api/blog/entry/${year}/${month}/${day}/${entry.slug}.json`),
      json,
      'utf8',
    );

    fs.mkdirSync(path.resolve(__dirname, `${config.distPath}/api/blog/entry/${year}/${month}/${day}`), {
      recursive: true,
    });
    fs.writeFileSync(
      path.resolve(__dirname, `${config.distPath}/api/blog/entry/${year}/${month}/${day}/${entry.slug}.json`),
      json,
      'utf8',
    );
    const entryUrl = toEntryUrl(entry);
    console.log('Generated entry', entryUrl);
    routes.push(entryUrl);
  });
const blogText = JSON.stringify(blog);
fs.writeFileSync(path.resolve(__dirname, 'api/blog.json'), blogText, { encoding: 'utf8' });
fs.writeFileSync(path.resolve(__dirname, `${config.distPath}/api/blog.json`), blogText, { encoding: 'utf8' });

routes.map((route) => {
  const state = buildState(route);
  const store = configureStore(state);

  // workaround for redirect
  const location = route === '' ? '/blog' : route;
  // pre-render app html
  const appHtml = render(
    <Provider value={store}>
      <Router hook={staticLocationHook(location)}>
        <App />
      </Router>
    </Provider>,
  );

  // build complete html page and json state
  const html = buildMainTemplate(route, appHtml);
  fs.mkdirSync(path.resolve(__dirname, `${config.distPath}${route}`), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, `${config.distPath}${route}/index.html`), html, { encoding: 'utf8' });
  fs.writeFileSync(path.resolve(__dirname, `${config.distPath}${route}/index.json`), JSON.stringify(state), {
    encoding: 'utf8',
  });
});

// update cache routes in worker include generated files
generateCacheRoutes();
