import { Fragment, h } from '../../../deps/preact.js';
import { Link, useLocation } from '../../../deps/wouter-preact.js';
import { log } from '../../shared/logger.js';
import { StoreContext } from '../../store/store.js';
import { useContext } from '../../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';

export default function Header() {
  log.debug('Render Header.');

  // VARIABLES
  const [state, dispatch] = useContext(StoreContext);
  const { site } = state;
  const [homeRouteMatched] = useLocation('/home');
  const [blogRouteMatched] = useLocation('/blog/:childUrl*');
  // deno-lint-ignore no-unused-vars
  const [location, setLocation] = useLocation();

  // EVENT HANDLERS
  // Open blog when blog link is clicked.
  function openBlog(ev) {
    const blogUrl = ev.target.getAttribute('href');
    log.debug(`Opening blog: ${blogUrl}`);
    fetchPartialState(blogUrl).then((entries) => {
      dispatch({ type: ActionTypes.SET_BLOG_ENTRIES, payload: { entries } });
      setLocation(blogUrl);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog ${blogUrl} is opened:`, entries);
    });
    ev.preventDefault();
  }

  // RENDER COMPONENT
  if (!site) {
    return h(Fragment);
  }

  const { title } = site;

  const homeItem = h(
    'li',
    { className: 'navigator__item' },
    h(Link, {
      href: '/home',
      className: `navigator__link ${
        homeRouteMatched && 'navigator__link--active'
      }`,
    }, title),
  );
  const blogItem = h(
    'li',
    { className: 'navigator__item' },
    h(
      'a',
      {
        href: '/blog',
        className: `navigator__link ${
          blogRouteMatched && 'navigator__link--active'
        }`,
        onClick: openBlog,
      },
      'to be continued',
    ),
  );
  const githubItem = h(
    'li',
    { className: 'navigator__item' },
    h('a', {
      href: 'https://github.com/cavoirom',
      className: 'navigator__link',
    }, 'github'),
  );
  return h(
    'header',
    null,
    h(
      'div',
      { className: 'pure-g' },
      h(
        'div',
        { className: 'pure-u-1' },
        h('ul', { className: 'navigator' }, homeItem, blogItem, githubItem),
      ),
    ),
  );
}
