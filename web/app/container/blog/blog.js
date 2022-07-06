import { Fragment, h } from '../../../deps/preact.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry.js';
import dlv from '../../../deps/dlv.js';
import { StoreContext } from '../../store/store.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';

export default function Blog() {
  const [state, dispatch] = useContext(StoreContext);
  const entries = dlv(state, 'blog.entries');
  const [location] = useLocation();

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

  // RENDER COMPONENT
  if (!entries || entries.length === 0) {
    return h(Fragment);
  }
  const entryItems = entries.map((item) =>
    h(SimpleBlogEntry, { blogEntry: item })
  );
  return h(Fragment, null, entryItems);
}
