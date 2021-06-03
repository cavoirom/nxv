import { h, Fragment } from 'preact';
import { useSelector } from '@preact-hooks/unistore';
import { Link, useRoute } from 'wouter-preact';
import { log } from '../../shared/logger.js';

export default function Header() {
  log.debug('Render Header.');

  const site = useSelector((state) => state.site);
  const [homeRouteMatched] = useRoute('/home');
  const [blogRouteMatched] = useRoute('/blog/:childUrl*');

  if (!site) {
    return h(Fragment);
  }

  const { title } = site;

  const homeItem = h(
    'li',
    { className: 'navigator__item' },
    h(Link, { href: '/home', className: `navigator__link ${homeRouteMatched && 'navigator__link--active'}` }, title)
  );
  const blogItem = h(
    'li',
    { className: 'navigator__item' },
    h(
      Link,
      { href: '/blog', className: `navigator__link ${blogRouteMatched && 'navigator__link--active'}` },
      'to be continued'
    )
  );
  const githubItem = h(
    'li',
    { className: 'navigator__item' },
    h('a', { href: 'https://github.com/cavoirom', className: 'navigator__link' }, 'github')
  );
  return h(
    'header',
    null,
    h(
      'div',
      { className: 'pure-g' },
      h('div', { className: 'pure-u-1' }, h('ul', { className: 'navigator' }, homeItem, blogItem, githubItem))
    )
  );
}
