import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSelector, useStore } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import dlv from 'dlv';
import { log } from '../../shared/logger.js';
import Tags from '../../component/tags/tags';
import { fetchPartialState, toPartialStateUrl } from '../../store/action';

const BLOG_ENTRY_URL_PATTERN = /\/blog\/entry\/[\w-/]+/;

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const [location] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  // EFFECTS
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
  const title = h('header', null, h('h1', { className: 'blog-entry__title' }, blogEntry.title));
  const tags = h(Tags, { tags: blogEntry.tags });
  const content = h('div', {
    className: 'blog-entry__content',
    dangerouslySetInnerHTML: { __html: blogEntry.content },
  });
  const updated = h('div', { className: 'blog-entry__updated' }, `Updated: ${blogEntry.updated}`);
  return h(
    'div',
    { className: 'blog-entry pure-g' },
    h('article', { className: 'pure-u-1' }, title, tags, content, updated)
  );
}

export function SimpleBlogEntry({ children, ...props }) {
  // VARIABLES
  const { blogEntry } = props;
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();
  const store = useStore();

  // EVENT HANDLERS
  // Open blog entry when title clicked
  function openBlogEntry(ev) {
    const blogEntryUrl = ev.target.getAttribute('href');
    log.debug(`Opening blog entry: ${blogEntryUrl}`);
    fetchPartialState(blogEntryUrl).then((entry) => {
      const state = store.getState();
      store.setState({ ...state, blog: { ...state.blog, entry } });
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
      blogEntry.title
    )
  );
  const tags = h(Tags, { tags: blogEntry.tags });
  const content = h('div', { className: 'blog-entry__content' }, h('p', null, blogEntry.preview));
  const wrapper = h('div', { className: 'pure-u-1' }, title, tags, content);
  return h('div', { key: blogEntry.url, className: 'blog-entry pure-g' }, wrapper);
}

export function isBlogEntryUrl(blogEntryUrl) {
  return BLOG_ENTRY_URL_PATTERN.test(blogEntryUrl);
}
