import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epic';
import { composeWithDevTools } from 'redux-devtools-extension';
import createRootReducer from './reducer';

export function configureStore(initialState) {
  console.log(initialState);
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(createRootReducer(), initialState, composeWithDevTools(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(rootEpic);
  return store;
}
