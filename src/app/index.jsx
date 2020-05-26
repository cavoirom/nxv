import './index.scss'; // index.scss use as entry point for css bundling
import { h, hydrate } from 'preact';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { configureStore } from './store/store';
import { createHashHistory } from 'history';

const state = window.__STATE__;
delete window.__STATE__;
const store = configureStore(state);

const rootElement = document.getElementById('app');

// Use dynamic import to let parcel do code splitting
import('./container/app/app')
  .then((exports) => exports.default || exports)
  .then((App) => {
    hydrate(
      <Provider store={store}>
        <Router history={createHashHistory()}>
          <App />
        </Router>
      </Provider>,
      rootElement,
    );
  });
