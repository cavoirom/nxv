import * as Redux from 'redux';

const { createStore } = Redux;

const store = createStore(
    (state, action) => {
      if (action.type === 'LOAD_STATE') {
        return action.content;
      }
      return state;
    });

export default store;