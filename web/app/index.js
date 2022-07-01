// Must be the first import
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}
import { h, hydrate } from 'preact';
import { StoreProvider as Provider } from '@preact-hooks/unistore';
import { configureStore } from './store/store.js';
import Redirect from './component/redirect/redirect.js';
import App from './container/app/app.js';
import initializeState from './initialize-state.js';

// Retrieve state from rendered json.
const statePromise = window.__STATE__
  ? window.__STATE__
  : initializeState(window.location.href);
delete window.__STATE__;

statePromise.then((state) => {
  const store = configureStore(state);
  const rootElement = document.getElementById('app');

  hydrate(
    h(
      Provider,
      { value: store },
      h(App),
      h(Redirect, { from: '/', to: '/blog' }),
    ),
    rootElement,
  );
});
