import { createStore } from 'redux';

const store = createStore(
    (state, action) => {
      if (action.type === 'LOAD_STATE') {
        return action.content;
      }
      return state;
    });

export default store;