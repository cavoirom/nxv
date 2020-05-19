import './index.scss'; // index.scss use as entry point for css bundling

import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { Provider } from 'react-redux';
import { HashRouter as Router, Redirect } from 'react-router-dom';
import { configureStore } from './store/store';
import { createHashHistory } from 'history';
import Spinner from './component/spinner/spinner';

const store = configureStore();

const App = lazy(() => import('./container/app/app'));

const rootElement = document.getElementById('app');

render(
  <Suspense fallback={<Spinner />}>
    <Provider store={store}>
      <Router history={createHashHistory()}>
        <App path="/" />
        <Redirect from="/" to="/blog" exact />
      </Router>
    </Provider>
  </Suspense>,
  rootElement,
);
