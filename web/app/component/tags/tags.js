import { h } from '../../../deps/preact.js';
import { useContext } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { StoreContext } from '../../store/store.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { toTagColorCssClass } from '../../shared/blog-entries.js';

// The _externals object will help mocking these methods, assist the unit
// testing.
// See more: https://deno.land/manual@main/testing/mocking
export const _externals = {
  'useContext': useContext,
  'useLocation': useLocation,
  'fetchPartialState': fetchPartialState,
};

export default function Tags({ tags }) {
  // VARIABLES
  const [_state, dispatch] = _externals.useContext(StoreContext);
  const [_location, setLocation] = _externals.useLocation();
  const { fetchPartialState } = _externals;

  // EVENT HANDLERS
  const openTag = (ev) => {
    const tagUrl = ev.target.getAttribute('href');
    fetchPartialState(tagUrl).then((entriesByTag) => {
      dispatch({
        type: ActionTypes.SET_BLOG_ENTRIES_BY_TAG,
        payload: { entriesByTag },
      });
      setLocation(tagUrl);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog tag ${tagUrl} is opened:`, entriesByTag);
    });
    ev.preventDefault();
  };

  // RENDER COMPONENT
  return h(
    'ul',
    { className: 'blog-entry__tags', 'aria-label': 'tags' },
    ...tags.map((tag) => {
      const tagLink = h(
        'a',
        {
          href: `/blog/tag/${tag}`,
          onClick: openTag,
          'aria-label': `tag ${tag}`,
        },
        tag,
      );
      return h('li', {
        className: `blog-entry__tag ${toTagColorCssClass(tag)}`,
      }, tagLink);
    }),
  );
}
