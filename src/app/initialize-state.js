import { isEntryUrl, toEntryJsonUrl } from './shared/blog-entries';
import { fetchBlog, fetchBlogEntry, fetchHome, fetchSite } from './store/action';

export default function initializeState(location) {
  const url = new URL(location);
  if (url.pathname === '/' || url.pathname === '/blog' || url.pathname === '/home') {
    return Promise.all([fetchSite(), fetchHome(), fetchBlog()]).then(([site, home, blog]) =>
      Promise.resolve({ site, home, blog }),
    );
  } else if (isEntryUrl(url.pathname)) {
    return Promise.all([fetchSite(), fetchHome(), fetchBlog(), fetchBlogEntry(toEntryJsonUrl(url.pathname))]).then(
      ([site, home, blog, entry]) => {
        blog.entry = entry;
        return Promise.resolve({ site, home, blog });
      },
    );
  }
  return Promise.resolve({});
}
