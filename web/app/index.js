import { h, hydrate } from '../deps/preact.js';
import Redirect from './component/redirect/redirect.js';
import App from './container/app/app.js';
import initializeState from './initialize-state.js';
import { StoreProvider } from './store/store.js';
import { Router } from '../deps/wouter-preact.js';

// Retrieve state from rendered json.
const statePromise = globalThis.__STATE__
  ? globalThis.__STATE__
  : initializeState(globalThis.location.href);
delete globalThis.__STATE__;

statePromise.then((state) => {
  const rootElement = document.getElementById('app');

  hydrate(
    h(
      StoreProvider,
      { state },
      h(Router, null, h(App, null, null)),
      h(Redirect, { from: '/', to: '/blog' }, null),
    ),
    rootElement,
  );
});
