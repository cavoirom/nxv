import { isEntryUrl } from './container/blog-entry/blog-entry.js';
import { fetchDefaultState, fetchPartialState } from './store/action.js';

export default function initializeState(location) {
  const url = new URL(location);
  if (url.pathname === '/' || url.pathname === '/home') {
    return fetchDefaultState();
  } else if (url.pathname === '/blog') {
    return Promise.all([fetchDefaultState(), fetchPartialState(url.pathname)]).then(([defaultState, blog]) => {
      return Promise.resolve({
        ...defaultState,
        blog,
      });
    });
  } else if (isEntryUrl(url.pathname)) {
    return Promise.all([fetchDefaultState(), fetchPartialState(url.pathname)]).then(([defaultState, entry]) => {
      defaultState.blog.entry = entry;
      return Promise.resolve({
        ...defaultState,
        blog: {
          ...defaultState.blog,
          entry,
        },
      });
    });
  }
  return fetchDefaultState();
}
