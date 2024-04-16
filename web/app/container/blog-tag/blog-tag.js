import { Fragment, h } from '../../../deps/preact.js';
import { useContext } from '../../../deps/preact-hooks.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { useEffect } from '../../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../../component/blog-entry/blog-entry.js';
import { StoreContext } from '../../store/store.js';
import { useOpenBlogEntry } from '../../shared/blog-entries.js';

const BLOG_TAG_URL_PATTERN = /\/blog\/tag\/([\w-/]+)/;

export default function BlogTag() {
  // VARIABLES
  const [state, dispatch] = useContext(StoreContext);
  const entriesByTag = state.blog?.entriesByTag;
  const [location, _setLocation] = useLocation();
  const tag = getTagFromUrl(location);
  const title = `tag: ${tag} - to be continued`;

  log.debug('Render Blog Tag:', entriesByTag);

  // EFFECTS
  // Set title
  useEffect(() => {
    document.title = title;
  });

  // Initialize entriesByTag if it's undefined
  // We could extract this one a custom hook.
  useEffect(() => {
    if (!!tag && (!entriesByTag || entriesByTag.length === 0)) {
      fetchPartialState(location).then((item) => {
        dispatch({
          type: ActionTypes.SET_BLOG_ENTRIES_BY_TAG,
          payload: { entriesByTag: item },
        });
      });
    }
  });

  // Event handler when blog entry title is clicked.
  const openBlogEntry = useOpenBlogEntry();

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

export function getTagFromUrl(blogTagUrl) {
  if (BLOG_TAG_URL_PATTERN.test(blogTagUrl)) {
    const tag = blogTagUrl.match(BLOG_TAG_URL_PATTERN)[1];
    return tag;
  }
}
