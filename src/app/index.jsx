import './index.scss'; // index.scss use as entry point for css bundling

import * as React from 'react';
import { Suspense, lazy } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import configureStore from './store/store';

const store = configureStore();

const App = lazy(() => import('./container/app/app'));

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Suspense fallback="Loading..">
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </Suspense>,
  rootElement,
);
