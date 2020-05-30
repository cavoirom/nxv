import './index.scss'; // index.scss use as entry point for css bundling

// Must be the first import
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}
import { h, hydrate } from 'preact';
import { StoreProvider as Provider } from '@preact-hooks/unistore';
import { configureStore } from './store/store';
import Redirect from './component/redirect/redirect';
import App from './container/app/app';

// Retrieve state from rendered json.
const statePromise = window.__STATE__;
delete window.__STATE__;

statePromise.then((state) => {
  const store = configureStore(state);
  const rootElement = document.getElementById('app');
  hydrate(
    <Provider value={store}>
      <Redirect from="/" to="/blog" />
      <App />
    </Provider>,
    rootElement,
  );
});
