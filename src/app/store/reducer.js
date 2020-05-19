import { combineReducers } from 'redux';
import { FETCH_BLOG_SUCCESSFULLY, FETCH_HOME_SUCCESSFULLY, FETCH_SITE_SUCCESSFULLY } from './action';

const siteReducer = (state, action) => {
  if (state === undefined) {
    return null;
  }
  if (action.type === FETCH_SITE_SUCCESSFULLY) {
    return action.payload;
  }
  return state;
};

const homeReducer = (state, action) => {
  if (state === undefined) {
    return null;
  }
  if (action.type === FETCH_HOME_SUCCESSFULLY) {
    return action.payload;
  }
  return state;
};

const blogReducer = (state, action) => {
  if (state === undefined) {
    return null;
  }
  if (action.type === FETCH_BLOG_SUCCESSFULLY) {
    return action.payload;
  }
  return state;
};

const createRootReducer = () => {
  return combineReducers({
    site: siteReducer,
    home: homeReducer,
    blog: blogReducer,
  });
};

export default createRootReducer;
