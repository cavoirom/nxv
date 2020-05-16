import './index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import App from './container/app/app';
import store from './store/store';

const { Provider } = ReactRedux;
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement);
