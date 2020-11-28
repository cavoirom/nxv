// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useSelector } from '@preact-hooks/unistore';
import { Link, useRoute } from 'wouter-preact';
import { log } from '../../shared/logger';

export default function Header() {
  log.debug('Render Header.');

  const site = useSelector((state) => state.site);
  const [homeRouteMatched] = useRoute('/home');
  const [blogRouteMatched] = useRoute('/blog/:entryUrl*');

  if (!site) {
    return <></>;
  }

  const { title } = site;
  return (
    <header className="header">
      <div className="pure-g">
        <div className="pure-u-1">
          <ul className="navigator">
            <li className="navigator__item">
              <Link href="/home" className={`navigator__link ${homeRouteMatched && 'navigator__link--active'}`}>
                {title}
              </Link>
            </li>
            <li className="navigator__item">
              <Link href="/blog" className={`navigator__link ${blogRouteMatched && 'navigator__link--active'}`}>
                to be continued
              </Link>
            </li>
            <li className="navigator__item">
              <a href="https://github.com/cavoirom" className="navigator__link">
                github
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
