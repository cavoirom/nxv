import { isBlogEntryUrl } from './shared/blog-entries.js';
import { fetchDefaultState, fetchPartialState } from './store/action.js';
import { isBlogTagUrl } from './container/blog-tag/blog-tag.js';

export default function initializeState(location) {
  const url = new URL(location);
  if (url.pathname === '/' || url.pathname === '/home') {
    return fetchDefaultState();
  } else if (url.pathname === '/blog') {
    return Promise.all([fetchDefaultState(), fetchPartialState(url.pathname)])
      .then(([defaultState, entries]) => {
        return Promise.resolve({
          ...defaultState,
          blog: {
            ...defaultState.blog,
            entries,
          },
        });
      });
  } else if (isBlogEntryUrl(url.pathname)) {
    return Promise.all([fetchDefaultState(), fetchPartialState(url.pathname)])
      .then(([defaultState, entry]) => {
        return Promise.resolve({
          ...defaultState,
          blog: {
            ...defaultState.blog,
            entry,
          },
        });
      });
  } else if (isBlogTagUrl(url.pathname)) {
    return Promise.all([fetchDefaultState(), fetchPartialState(url.pathname)])
      .then(([defaultState, entriesByTag]) => {
        return Promise.resolve({
          ...defaultState,
          blog: {
            ...defaultState.blog,
            entriesByTag,
          },
        });
      });
  }
  return fetchDefaultState();
}
