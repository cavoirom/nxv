import './index.scss'; // index.scss use as entry point for css bundling

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './container/app/app';
import store from './store/store';

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement,
);
