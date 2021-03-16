import { Fragment, h } from 'preact';
import { useAction, useSelector, useStore } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { toEntryJsonUrl, toEntryUrl } from '../../shared/blog-entries';
import { useEffect } from 'preact/hooks';
import { fetchBlog, fetchBlogEntry } from '../../store/action';
import { log } from '../../shared/logger';

export default function Blog() {
  const blog = useSelector((state) => state.blog);
  const title = useSelector((state) => state.site.title);
  const [location, setLocation] = useLocation();

  log.debug('Render Blog:', blog);

  const fetchBlogAction = useAction((state) => {
    return fetchBlog().then((blog) => {
      return Promise.resolve({
        ...state,
        blog,
      });
    });
  });

  // Set title
  useEffect(() => {
    document.title = title;
  }, []);

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!blog || !blog.entries || !blog.entries.length > 0) {
      fetchBlogAction();
    }
  }, []);

  // Open blog entry when title clicked
  const store = useStore();

  function openBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    log.debug(`Opening blog entry: ${pathname}`);
    fetchBlogEntry(toEntryJsonUrl(pathname)).then((entry) => {
      const state = store.getState();
      store.setState({ ...state, blog: { ...state.blog, entry } });
      setLocation(pathname);
      log.debug(`Blog entry ${pathname} is opened:`, entry);
    });
    ev.preventDefault();
  }

  // Prefetch json of blog entry, service worker will cache the response
  function prefetchBlogEntry(ev) {
    const pathname = ev.target.getAttribute('href');
    fetch(toEntryJsonUrl(pathname));
    log.debug(`Prefetched blog entry ${pathname}`);
  }

  if (!blog) {
    return h(Fragment);
  }

  const { entries } = blog;

  // Render Blog Component
  const entryItems = entries.map((item) => {
    const title = h(
      'h3',
      { className: 'blog-entry__title' },
      h(
        'a',
        {
          href: toEntryUrl(item),
          onClick: openBlogEntry,
          onMouseEnter: prefetchBlogEntry,
          onTouchStart: prefetchBlogEntry,
        },
        item.title,
      ),
    );
    const content = h('div', { className: 'blog-entry__content' }, h('p', null, item.preview));
    const entryWrapper = h('div', { className: 'pure-u-1' }, title, content);
    return h('div', { key: toEntryUrl(item), className: 'blog-entry pure-g' }, entryWrapper);
  });
  return h(Fragment, null, entryItems);
}
