import { h } from '../../../deps/preact.js';

export default function FeedEntry(
  { title, host, url, created, updated, author, preview, content },
) {
  return h(
    'entry',
    null,
    h('id', null, `https://${host}${url}`),
    h('published', null, created),
    h('updated', null, updated),
    h('title', null, title),
    h('author', null, h('name', null, author)),
    h(
      'summary',
      { type: 'xhtml' },
      h('div', {
        xmlns: 'http://www.w3.org/1999/xhtml',
        dangerouslySetInnerHTML: { __html: preview },
      }, null),
    ),
    h(
      'content',
      { type: 'xhtml' },
      h('div', {
        xmlns: 'http://www.w3.org/1999/xhtml',
        dangerouslySetInnerHTML: { __html: content },
      }, null),
    ),
    h('link', { href: `https://${host}${url}` }, null),
  );
}
