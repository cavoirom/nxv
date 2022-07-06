import { h, hydrate } from '../deps/preact.js';
import Redirect from './component/redirect/redirect.js';
import App from './container/app/app.js';
import initializeState from './initialize-state.js';
import { StoreProvider } from './store/store.js';

// Retrieve state from rendered json.
const statePromise = window.__STATE__
  ? window.__STATE__
  : initializeState(window.location.href);
delete window.__STATE__;

statePromise.then((state) => {
  const rootElement = document.getElementById('app');

  hydrate(
    h(
      StoreProvider,
      { state },
      h(App, null, null),
      h(Redirect, { from: '/', to: '/blog' }, null),
    ),
    rootElement,
  );
});
