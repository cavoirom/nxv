import './index.scss'; // index.scss use as entry point for css bundling
import { h, hydrate } from 'preact';
import { Provider } from 'react-redux';
import { configureStore } from './store/store';
import Redirect from './component/redirect/redirect';

const statePromise = window.__STATE__;
delete window.__STATE__;

// Use dynamic import to let parcel do code splitting
const appPromise = import('./container/app/app').then((exports) => exports.default || exports);

Promise.all([statePromise, appPromise]).then(([state, App]) => {
  const store = configureStore(state);
  const rootElement = document.getElementById('app');
  hydrate(
    <Provider store={store}>
      <App />
      <Redirect from="/" to="/blog" />
    </Provider>,
    rootElement,
  );
});
