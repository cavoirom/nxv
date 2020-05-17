import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducer';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epic';

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(rootReducer, applyMiddleware(epicMiddleware));
  epicMiddleware.run(rootEpic);
  return store;
}
