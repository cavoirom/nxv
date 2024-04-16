import { Fragment, h } from '../../../deps/preact.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../../component/blog-entry/blog-entry.js';
import { StoreContext } from '../../store/store.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { useOpenBlogEntry } from '../../shared/blog-entries.js';

export default function Blog() {
  const [state, dispatch] = useContext(StoreContext);
  const entries = state.blog?.entries;
  const [location, _setLocation] = useLocation();

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
  const openBlogEntry = useOpenBlogEntry();

  // RENDER COMPONENT
  if (!entries || entries.length === 0) {
    return h(Fragment);
  }
  const entryItems = entries.map((item) =>
    h(SimpleBlogEntry, { blogEntry: item, onOpen: openBlogEntry })
  );
  return h(Fragment, null, entryItems);
}
