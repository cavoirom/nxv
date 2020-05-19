import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epic';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';
import createRootReducer from './reducer';

export const history = createHashHistory();

export function configureStore() {
  const initialState = {};
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeWithDevTools(applyMiddleware(epicMiddleware)),
  );
  epicMiddleware.run(rootEpic);
  return store;
}
