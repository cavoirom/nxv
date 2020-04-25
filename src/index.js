import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import App from './app';
import store from './store/store';

const Provider = ReactRedux.Provider;
const rootElement = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    rootElement);
