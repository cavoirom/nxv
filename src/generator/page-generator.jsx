import { h } from 'preact';
import { Router } from 'wouter-preact';
import staticLocationHook from 'wouter-preact/static-location';
import render from 'preact-render-to-string';
import { StoreProvider as Provider } from '@preact-hooks/unistore';

import * as fs from 'fs';
import * as path from 'path';

import { configureStore } from "../app/store/store";
import App from "../app/container/app/app";
import buildMainTemplate from './main-template';
import config from './config';
import { isEntryUrl } from '../app/shared/blog-entries';

export default function generatePage(route) {
  const { state, pathname } = route;
  const store = configureStore(state);

  // Pre-render app html
  const appHtml = render(
      <Provider value={store}>
      <Router hook={staticLocationHook(pathname)}>
      <App />
      </Router>
      </Provider>,
  );

  // Build complete html page and json state
  const html = buildMainTemplate(pathname, appHtml);
  // Create directory corresponding to pathname
  const pageDirectory = `${config.output}${pathname}`
  fs.mkdirSync(path.resolve(__dirname, pageDirectory), { recursive: true });
  // Write html to pathname/index.html file
  const writeOptions = { encoding: 'utf8' };
  fs.writeFileSync(path.resolve(__dirname, `${pageDirectory}/index.html`), html, writeOptions);
  // Write state to pathname/index.json file
  fs.writeFileSync(path.resolve(__dirname, `${pageDirectory}/index.json`), JSON.stringify(state), writeOptions);
  // Write partial state for ajax call
  writePartialState(route, writeOptions);
  console.log(`Generated: ${pathname}`);
}

function writePartialState(route, writeOptions) {
  const outputPath = `${config.output}/api${route.pathname}.json`;
  const outputDirectory = path.dirname(outputPath);

  let partialState = null;
  if (route.pathname === '/blog') {
    partialState = route.state.blog;
  } else if (route.pathname === '/home') {
    partialState = route.state.home;
  } else if (isEntryUrl(route.pathname)) {
    partialState = route.state.blog.entry;
  }

  if (partialState !== null) {
    fs.mkdirSync(path.resolve(__dirname, outputDirectory), { recursive: true });
    fs.writeFileSync(path.resolve(__dirname, outputPath), JSON.stringify(partialState), writeOptions);
  }
}