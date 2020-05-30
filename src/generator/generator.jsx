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

// Should generate JSON API

const routes = ['', '/home', '/blog'];

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
