import { toEntryUrl } from '../app/shared/blog-entries';
import config from './config';

export function buildBlogEntryRoute(blogEntry) {
  const { defaultState } = config;
  const blogEntryPathname = toEntryUrl(blogEntry);
  const blogEntryState = {
    ...defaultState,
    blog: {
      entries: defaultState.blog.entries,
      entry: blogEntry
    }
  };

  return {
    pathname: blogEntryPathname,
    state: blogEntryState
  };
}