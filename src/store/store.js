import * as Redux from 'redux';

const store = Redux.createStore(
    (state, action) => {
      if (action.type === 'LOAD_STATE') {
        return action.content;
      }
      return state;
    });

export default store;