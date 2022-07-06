import { h } from '../../../deps/preact.js';
import { useContext } from '../../../deps/preact-hooks.js';
import { log } from '../../shared/logger.js';
import { useLocation } from '../../../deps/wouter-preact.js';
import { StoreContext } from '../../store/store.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';

export default function Tags({ tags }) {
  // VARIABLES
  // deno-lint-ignore no-unused-vars
  const [state, dispatch] = useContext(StoreContext);
  // deno-lint-ignore no-unused-vars
  const [location, setLocation] = useLocation();

  // EVENT HANDLERS
  function openTag(ev) {
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
  }

  // RENDER COMPONENT
  return h(
    'ul',
    { className: 'blog-entry__tags' },
    ...tags.map((tag) => {
      const tagLink = h(
        'a',
        { href: `/blog/tag/${tag}`, onClick: openTag },
        tag,
      );
      return h('li', { className: 'blog-entry__tag' }, tagLink);
    }),
  );
}
