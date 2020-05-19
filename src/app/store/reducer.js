import { FETCH_BLOG_SUCCESSFULLY, FETCH_HOME_SUCCESSFULLY, FETCH_SITE_SUCCESSFULLY } from './action';

export default function rootReducer(state, action) {
  if (action.type === FETCH_SITE_SUCCESSFULLY) {
    return {
      ...state,
      site: action.payload,
    };
  } else if (action.type === FETCH_HOME_SUCCESSFULLY) {
    return {
      ...state,
      home: action.payload,
    };
  } else if (action.type === FETCH_BLOG_SUCCESSFULLY) {
    return {
      ...state,
      blog: action.payload,
    };
  }
  return state;
}
