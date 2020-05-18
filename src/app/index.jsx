import './index.scss'; // index.scss use as entry point for css bundling

import * as React from 'react';
import { Suspense, lazy } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Redirect } from 'react-router-dom';
import configureStore from './store/store';
import Spinner from './component/spinner/spinner';

const store = configureStore();

const App = lazy(() => import('./container/app/app'));

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Suspense fallback={<Spinner />}>
    <Provider store={store}>
      <Router>
        <App />
        <Redirect exact from="/" to="/blog" />
      </Router>
    </Provider>
  </Suspense>,
  rootElement,
);
