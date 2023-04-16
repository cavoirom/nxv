import { Fragment, h } from '../../../deps/preact.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry.js';
import dlv from '../../../deps/dlv.js';
import { StoreContext } from '../../store/store.js';
import {
  ActionTypes,
  fetchPartialState,
  toPartialStateUrl,
} from '../../store/action.js';

export default function Blog() {
  const [state, dispatch] = useContext(StoreContext);
  const entries = dlv(state, 'blog.entries');
  const [location, setLocation] = useLocation();

  log.debug('Render Blog:', entries);

  // Set title
  useEffect(() => {
    document.title = 'to be continued';
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!entries || entries.length === 0) {
      fetchPartialState(location).then((entries) => {
        dispatch({ type: ActionTypes.SET_BLOG_ENTRIES, payload: { entries } });
      });
    }
  });

  // Event handler when blog entry title is clicked.
  function openBlogEntry(entry) {
    log.debug(`Opening blog entry: ${blogEntryUrl}`);
    fetchPartialState(entry.url).then((item) => {
      // Only need to scroll to top when user intentionally navigates to a blog.
      // Will keep the scroll position when user navigate back/forward.
      document.documentElement.scrollTop = 0;
      dispatch({ type: ActionTypes.SET_BLOG_ENTRY, payload: { item } });
      setLocation(blogEntryUrl);
    });
  }

  // RENDER COMPONENT
  if (!entries || entries.length === 0) {
    return h(Fragment);
  }
  const entryItems = entries.map((item) =>
    h(SimpleBlogEntry, { blogEntry: item, onOpen: openBlogEntry })
  );
  return h(Fragment, null, entryItems);
}
