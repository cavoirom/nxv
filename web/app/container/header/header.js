import { Fragment, h } from 'preact';
import { useSelector, useStore } from '@preact-hooks/unistore';
import { Link, useLocation, useRoute } from 'wouter-preact';
import { log } from '../../shared/logger.js';
import action from '../../store/action.js';
const { fetchPartialState } = action;

export default function Header() {
  log.debug('Render Header.');

  // VARIABLES
  const site = useSelector((state) => state.site);
  const [homeRouteMatched] = useRoute('/home');
  const [blogRouteMatched] = useRoute('/blog/:childUrl*');
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();
  const store = useStore();

  // EVENT HANDLERS
  // Open blog when blog link is clicked.
  function openBlog(ev) {
    const blogUrl = ev.target.getAttribute('href');
    log.debug(`Opening blog: ${blogUrl}`);
    fetchPartialState(blogUrl).then((entries) => {
      const state = store.getState();
      store.setState({ ...state, blog: { ...state.blog, entries } });
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
