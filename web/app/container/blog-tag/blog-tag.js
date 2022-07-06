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
    h(SimpleBlogEntry, { blogEntry: item })
  );
  return h(Fragment, null, titleItem, entryItems);
}

export function isBlogTagUrl(blogTagUrl) {
  return BLOG_TAG_URL_PATTERN.test(blogTagUrl);
}
