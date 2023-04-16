import { Fragment, h } from '../../../deps/preact.js';
import { useContext } from '../../../deps/preact-hooks.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { useEffect } from '../../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry.js';
import dlv from '../../../deps/dlv.js';
import { StoreContext } from '../../store/store.js';

const BLOG_TAG_URL_PATTERN = /\/blog\/tag\/([\w-/]+)/;

export default function BlogTag() {
  // VARIABLES
  const [state, dispatch] = useContext(StoreContext);
  const entriesByTag = dlv(state, 'blog.entriesByTag');
  const [location] = useLocation();
  const tag = location.match(BLOG_TAG_URL_PATTERN)[1];
  const title = `tag:${tag} - to be continued`;

  log.debug('Render Blog Tag:', entriesByTag);

  // EFFECTS
  // Set title
  useEffect(() => {
    document.title = title;
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!entriesByTag || entriesByTag.length === 0) {
      fetchPartialState(location).then((entriesByTag) => {
        dispatch({
          type: ActionTypes.SET_BLOG_ENTRIES_BY_TAG,
          payload: { entriesByTag },
        });
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
  if (!entriesByTag || entriesByTag.length <= 0) {
    return h(Fragment);
  }

  const titleItem = h(
    'div',
    { className: 'pure-g' },
    h(
      'div',
      { className: 'pure-u-1' },
      h('h1', { className: 'content__title' }, tag),
    ),
  );
  const entryItems = entriesByTag.map((item) =>
    h(SimpleBlogEntry, { blogEntry: item, onOpen: openBlogEntry })
  );
  return h(Fragment, null, titleItem, entryItems);
}

export function isBlogTagUrl(blogTagUrl) {
  return BLOG_TAG_URL_PATTERN.test(blogTagUrl);
}
