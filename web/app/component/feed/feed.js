import { h } from '../../../deps/preact.js';
import FeedEntry from '../feed-entry/feed-entry.js';
import { dirname } from '../../../deps/path.js';

export default function Feed({ state }) {
  const feedParentPath = dirname(state.site.path);
  return h(
    'feed',
    { xmlns: 'http://www.w3.org/2005/Atom' },
    h('id', null, `https://${state.site.host}${feedParentPath}`),
    h('title', null, state.site.title),
    h('updated', null, state.blog.updated),
    h(
      'link',
      { href: feedParentPath },
      null,
    ),
    h(
      'link',
      { rel: 'self', href: state.site.path },
      null,
    ),
    ...state.blog.entries.map((entry) =>
      h(FeedEntry, { ...entry, host: state.site.host }, null)
    ),
  );
}
