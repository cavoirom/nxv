import createStore from 'unistore';

export function configureStore(initialState) {
  console.log('Initial state: ', initialState);
  // Only activate devtools for Browser
  if (process.env.NODE_ENV === 'development') {
    console.log('Run in ENV: ', process.env.NODE_ENV);
    const devtools = require('unistore/devtools');
    return devtools(createStore(initialState));
  }
  return createStore(initialState);
}
