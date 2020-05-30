import './index.scss'; // index.scss use as entry point for css bundling
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
      <App />
      <Redirect from="/" to="/blog" />
    </Provider>,
    rootElement,
  );
});
