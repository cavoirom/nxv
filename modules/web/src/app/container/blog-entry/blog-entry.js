import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSelector, useStore } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import dlv from 'dlv';
import { toEntryUrl } from '../../shared/blog-entries.js';
import { log } from '../../shared/logger.js';
import { fetchPartialState } from '../../store/action';

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const entryUrl = toEntryUrl(entry);
  const [location, setLocation] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  useEffect(() => {
    document.title = dlv(entry, 'title');
  });

  // Open Tag page
  const store = useStore();
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

  if (!entry || location !== entryUrl) {
    return h(Fragment);
  }
  return renderBlogEntry(entry, openTag);
}

export function renderBlogEntry(blogEntry, openTag) {
  const title = h('header', null, h('h1', { className: 'blog-entry__title' }, blogEntry.title));
  const tags = _renderTags(blogEntry.tags, openTag);
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

export function renderSimpleBlogEntry(blogEntry, openBlogEntry, prefetchBlogEntry, openTag) {
  const title = h(
    'h3',
    { className: 'blog-entry__title' },
    h(
      'a',
      {
        href: toEntryUrl(blogEntry),
        onClick: openBlogEntry,
        onMouseEnter: prefetchBlogEntry,
        onTouchStart: prefetchBlogEntry,
      },
      blogEntry.title
    )
  );
  const tags = _renderTags(blogEntry.tags, openTag);
  const content = h('div', { className: 'blog-entry__content' }, h('p', null, blogEntry.preview));
  const wrapper = h('div', { className: 'pure-u-1' }, title, tags, content);
  return h('div', { key: toEntryUrl(blogEntry), className: 'blog-entry pure-g' }, wrapper);
}

function _renderTags(tags, openTag) {
  return h(
    'ul',
    { className: 'blog-entry__tags' },
    ...tags.map((tag) => {
      const tagLink = h('a', { href: `/blog/tag/${tag}`, onClick: openTag }, tag);
      return h('li', { className: 'blog-entry__tag' }, tagLink);
    })
  );
}
