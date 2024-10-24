import { Fragment, h } from '../../../deps/preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import Tags from '../tags/tags.js';
import { ActionTypes, toPartialStateUrl } from '../../store/action.js';
import { StoreContext } from '../../store/store.js';

export default function BlogEntry({ blogEntry }) {
  // INPUT
  const [_state, dispatch] = useContext(StoreContext);

  log.debug('Render BlogEntry:', blogEntry);

  // EFFECTS
  // Set title
  useEffect(() => {
    dispatch({
      type: ActionTypes.SET_SITE_TITLE,
      payload: { title: blogEntry.title },
    });
  }, [location]);

  // RENDER COMPONENT
  if (!blogEntry) {
    return h(Fragment);
  }
  return _renderBlogEntry(blogEntry);
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
    `Created ${_toDisplayDate(blogEntry.created)} · Updated ${
      _toDisplayDate(blogEntry.updated)
    }`,
  );
  return h(
    'div',
    { className: 'blog-entry pure-g' },
    h('article', { className: 'pure-u-1' }, title, dates, tags, content),
  );
}

export function SimpleBlogEntry({ blogEntry, onOpen }) {
  // VARIABLES

  // INPUT VALIDATION
  if (!onOpen) {
    throw new Error('Event handler for opening Blog Entry is required.');
  }

  // EVENT HANDLERS
  // Open blog entry when title clicked
  function openBlogEntry(ev) {
    onOpen(blogEntry);
    ev.preventDefault();
  }

  // Prefetch json of blog entry, service worker will cache the response
  // TODO extract prefetch logic outside of BlogEntry.
  function prefetchBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    log.debug(`Prefetched blog entry ${pathname}`);
    fetch(toPartialStateUrl(pathname));
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

function _toDisplayDate(date) {
  if (date) {
    return date.slice(0, 10);
  }
}
