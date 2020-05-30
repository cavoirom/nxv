import createStore from 'unistore';
import devtools from 'unistore/devtools';

export function configureStore(initialState) {
  console.log('Initial state: ', initialState);
  return process.env.NODE_ENV === 'production' ? createStore(initialState) : devtools(createStore(initialState));
}
