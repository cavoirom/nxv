import { isEntryUrl, toEntryJsonUrl } from './shared/blog-entries';
import { fetchDefaultState, fetchBlogEntry, fetchBlog } from './store/action';

export default function initializeState(location) {
  const url = new URL(location);
  if (url.pathname === '/' || url.pathname === '/home') {
    return fetchDefaultState();
  } else if (url.pathname === '/blog') {
    return Promise.all([fetchDefaultState(), fetchBlog()]).then(([defaultState, blog]) => {
      return Promise.resolve({
        ...defaultState,
        blog,
      });
    });
  } else if (isEntryUrl(url.pathname)) {
    return Promise.all([fetchDefaultState(), fetchBlogEntry(toEntryJsonUrl(url.pathname))]).then(
      ([defaultState, entry]) => {
        defaultState.blog.entry = entry;
        return Promise.resolve({
          ...defaultState,
          blog: {
            ...defaultState.blog,
            entry,
          },
        });
      },
    );
  }
  return Promise.resolve({});
}
