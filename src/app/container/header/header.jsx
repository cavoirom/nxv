// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useSelector } from '@preact-hooks/unistore';
import { Link, useRoute } from 'wouter-preact';

export default function Header() {
  const site = useSelector((state) => state.site);
  const [homeRouteMatched] = useRoute('/home');
  const [blogRouteMatched] = useRoute('/blog/:entryUrl*');

  if (!site) {
    return <></>;
  }

  const { title } = site;
  return (
    <header>
      <div className="pure-g">
        <div className="pure-u-1">
          <h1>{title}</h1>
        </div>
        <div className="pure-u-1">
          <h2>
            <Link href="/home" className={`nav-link ${homeRouteMatched && 'active'}`}>
              me
            </Link>
            <span> &middot; </span>
            <Link href="/blog" className={`nav-link ${blogRouteMatched && 'active'}`}>
              to be continued
            </Link>
            <span> &middot; </span>
            <a href="https://github.com/cavoirom" className="nav-link">
              github
            </a>
          </h2>
        </div>
      </div>
    </header>
  );
}
