import { h, toChildArray } from '../../deps/preact.js';
import { createContext } from '../../deps/preact.js';
import { useReducer } from '../../deps/preact-hooks.js';
import { ActionTypes } from './action.js';

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_BLOG_ENTRY:
      return {
        ...state,
        blog: {
          ...state.blog,
          entry: action.payload.entry,
        },
      };
    case ActionTypes.SET_BLOG_ENTRIES:
      return {
        ...state,
        blog: {
          ...state.blog,
          entries: action.payload.entries,
        },
      };
    case ActionTypes.SET_BLOG_ENTRIES_BY_TAG:
      return {
        ...state,
        blog: {
          ...state.blog,
          entriesByTag: action.payload.entriesByTag,
        },
      };
    default:
      return state;
  }
};

export const StoreContext = createContext([{}, null]);

export function StoreProvider({ children, state }) {
  const store = useReducer(reducer, state);
  // We need toChildArray because children may be a single element.
  return h(StoreContext.Provider, { value: store }, ...toChildArray(children));
}
