import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducer';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from './epic';
import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore() {
  const initialState = {
    site: {},
    me: {},
    journey: {
      years: [],
    },
    work: {
      years: [],
    },
  };

  const epicMiddleware = createEpicMiddleware();
  const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(rootEpic);
  return store;
}
