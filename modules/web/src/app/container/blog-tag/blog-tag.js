import { Fragment, h } from 'preact';
import { useAction, useSelector, useStore } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import { fetchPartialState, toPartialStateUrl } from '../../store/action.js';
import { log } from '../../shared/logger.js';
import { renderSimpleBlogEntry } from '../blog-entry/blog-entry';

const BLOG_TAG_URL_PATTERN = /\/blog\/tag\/([\w-/]+)/;

export default function BlogTag() {
  const blog = useSelector((state) => state.blog);
  const [location, setLocation] = useLocation();
  const tag = location.match(BLOG_TAG_URL_PATTERN)[1];
  const title = useSelector((state) => `${state.site.title} - tag:${tag}`);

  log.debug('Render Blog Tag:', blog);
  const fetchBlogTagAction = useAction((state) => {
    return fetchPartialState(location).then((blog) => {
      return Promise.resolve({
        ...state,
        blog,
      });
    });
  });

  // Set title
  useEffect(() => {
    document.title = title;
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!blog || !blog.entriesByTag || !blog.entriesByTag.length > 0) {
      fetchBlogTagAction();
    }
  });

  // Open blog entry when title clicked
  const store = useStore();

  function openBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    log.debug(`Opening blog entry: ${pathname}`);
    fetchPartialState(pathname).then((entry) => {
      const state = store.getState();
      store.setState({ ...state, blog: { ...state.blog, entry } });
      setLocation(pathname);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog entry ${pathname} is opened:`, entry);
    });
    ev.preventDefault();
  }

  // Prefetch json of blog entry, service worker will cache the response
  function prefetchBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    fetch(toPartialStateUrl(pathname));
    log.debug(`Prefetched blog entry ${pathname}`);
  }

  // Open Tag page
  function openTag(ev) {
    const pathname = ev.target.getAttribute('href');
    fetchPartialState(pathname).then((blog) => {
      const state = store.getState();
      store.setState({ ...state, blog });
      setLocation(pathname);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog tag ${pathname} is opened:`, blog);
    });
  }

  if (!blog) {
    return h(Fragment);
  }

  const { entriesByTag } = blog;

  // Render Blog Tag Component
  const titleItem = h(
    'div',
    { className: 'pure-g' },
    h('div', { className: 'pure-u-1' }, h('h1', { className: 'content__title' }, tag))
  );
  const entryItems = entriesByTag.map((item) => renderSimpleBlogEntry(item, openBlogEntry, prefetchBlogEntry, openTag));
  return h(Fragment, null, titleItem, entryItems);
}
