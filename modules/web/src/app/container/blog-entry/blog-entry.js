import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import dlv from 'dlv';
import { toEntryUrl } from '../../shared/blog-entries.js';
import { log } from '../../shared/logger.js';

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const entryUrl = toEntryUrl(entry);
  const [location] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  useEffect(() => {
    document.title = dlv(entry, 'title');
  });

  if (!entry || location !== entryUrl) {
    return h(Fragment);
  }

  const blogEntryHeader = h('header', null, h('h1', { className: 'blog-entry__title' }, entry.title));
  const blogEntryContent = h('div', {
    className: 'blog-entry__content',
    dangerouslySetInnerHTML: { __html: entry.content },
  });
  return h(
    'div',
    { className: 'blog-entry pure-g' },
    h('article', { className: 'pure-u-1' }, blogEntryHeader, blogEntryContent)
  );
}
