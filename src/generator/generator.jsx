import { h } from 'preact';
import render from 'preact-render-to-string';
import { StoreProvider as Provider } from '@preact-hooks/unistore';
import { Router } from 'wouter-preact';
import * as fs from 'fs';
import * as path from 'path';

import staticLocationHook from 'wouter-preact/static-location';
import App from '../app/container/app/app';
import { configureStore } from '../app/store/store';

import buildState from './build-state';
import buildMainTemplate from './main-template';
import generateCacheRoutes from './generate-cache-route';

const routes = ['', '/home', '/blog'];

const throwError = (error) => {
  if (error) {
    throw error;
  }
};

routes.map((route) => {
  const state = buildState(route);
  const store = configureStore(state);
  // workaround for redirect
  const location = route === '' ? '/blog' : route;
  const appHtml = render(
    <Provider value={store}>
      <Router hook={staticLocationHook(location)}>
        <App />
      </Router>
    </Provider>,
  );
  const html = buildMainTemplate(route, appHtml);

  fs.mkdirSync(path.resolve(__dirname, `../dist${route}`), { recursive: true });

  fs.writeFile(path.resolve(__dirname, `../dist${route}/index.html`), html, { encoding: 'utf8' }, throwError);
  fs.writeFile(
    path.resolve(__dirname, `../dist${route}/index.json`),
    JSON.stringify(state),
    { encoding: 'utf8' },
    throwError,
  );

  generateCacheRoutes();
});
