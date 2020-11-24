import { isEntryUrl, toEntryJsonUrl } from './shared/blog-entries';
import { fetchDefaultState, fetchBlogEntry } from './store/action';

export default function initializeState(location) {
  const url = new URL(location);
  if (url.pathname === '/' || url.pathname === '/blog' || url.pathname === '/home') {
    return fetchDefaultState();
  } else if (isEntryUrl(url.pathname)) {
    return Promise.all([fetchDefaultState(), fetchBlogEntry(toEntryJsonUrl(url.pathname))]).then(
      ([defaultState, entry]) => {
        defaultState.blog.entry = entry;
        return Promise.resolve(defaultState);
      },
    );
  }
  return Promise.resolve({});
}
