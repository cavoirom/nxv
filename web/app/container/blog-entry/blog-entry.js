import { Fragment, h } from '../../../deps/preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import dlv from '../../../deps/dlv.js';
import { log } from '../../shared/logger.js';
import Tags from '../../component/tags/tags.js';
import { StoreContext } from '../../store/store.js';
import {
  ActionTypes,
  fetchPartialState,
  toPartialStateUrl,
} from '../../store/action.js';

const BLOG_ENTRY_URL_PATTERN = /\/blog\/entry\/[\w-/]+/;

export default function BlogEntry() {
  const [state, dispatch] = useContext(StoreContext);
  const entry = dlv(state, 'blog.entry');
  const [location] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  // EFFECTS
  /*
   * When we navigate back/forward by Browser buttons, the blog entry could be undefined or incorrect.
   * In this case, we should check the current blog entry with the url to reload blog entry if necessary.
   */
  useEffect(() => {
    // We only fetch blog entry if the current url is blog entry url. Some time it's /blog.
    if (isBlogEntryUrl(location) && location !== dlv(entry, 'url')) {
      fetchPartialState(location).then((entry) => {
        dispatch({ type: ActionTypes.SET_BLOG_ENTRY, payload: { entry } });
      });
    }
  });

  useEffect(() => {
    document.title = dlv(entry, 'title');
  });

  // RENDER COMPONENT
  if (!entry || location !== dlv(entry, 'url')) {
    return h(Fragment);
  }
  return _renderBlogEntry(entry);
}

function _renderBlogEntry(blogEntry) {
  const title = h(
    'header',
    null,
    h('h1', { className: 'blog-entry__title' }, blogEntry.title),
  );
  const tags = h(Tags, { tags: blogEntry.tags });
  const content = h('div', {
    className: 'blog-entry__content',
    dangerouslySetInnerHTML: { __html: blogEntry.content },
  });
  const dates = h(
    'div',
    { className: 'blog-entry__dates' },
    `Created ${toDisplayDate(blogEntry.created)} · Updated ${
      toDisplayDate(blogEntry.updated)
    }`,
  );
  return h(
    'div',
    { className: 'blog-entry pure-g' },
    h('article', { className: 'pure-u-1' }, title, dates, tags, content),
  );
}

export function SimpleBlogEntry({ blogEntry }) {
  // VARIABLES
  // deno-lint-ignore no-unused-vars
  const [location, setLocation] = useLocation();
  // deno-lint-ignore no-unused-vars
  const [state, dispatch] = useContext(StoreContext);

  // EVENT HANDLERS
  // Open blog entry when title clicked
  function openBlogEntry(ev) {
    const blogEntryUrl = ev.target.getAttribute('href');
    log.debug(`Opening blog entry: ${blogEntryUrl}`);
    fetchPartialState(blogEntryUrl).then((entry) => {
      dispatch({ type: ActionTypes.SET_BLOG_ENTRY, payload: { entry } });
      setLocation(blogEntryUrl);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog entry ${blogEntryUrl} is opened:`, entry);
    });
    ev.preventDefault();
  }

  // Prefetch json of blog entry, service worker will cache the response
  function prefetchBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    fetch(toPartialStateUrl(pathname));
    log.debug(`Prefetched blog entry ${pathname}`);
  }

  // RENDER COMPONENT
  const title = h(
    'h3',
    { className: 'blog-entry__title' },
    h(
      'a',
      {
        href: blogEntry.url,
        onClick: openBlogEntry,
        onMouseEnter: prefetchBlogEntry,
        onTouchStart: prefetchBlogEntry,
      },
      blogEntry.title,
    ),
  );
  const tags = h(Tags, { tags: blogEntry.tags });
  const content = h(
    'div',
    { className: 'blog-entry__content' },
    h('p', null, blogEntry.preview),
  );
  const wrapper = h('div', { className: 'pure-u-1' }, title, tags, content);
  return h(
    'div',
    { key: blogEntry.url, className: 'blog-entry pure-g' },
    wrapper,
  );
}

export function isBlogEntryUrl(blogEntryUrl) {
  return BLOG_ENTRY_URL_PATTERN.test(blogEntryUrl);
}

function toDisplayDate(date) {
  if (date) {
    return date.slice(0, 10);
  }
}
