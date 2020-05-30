// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/compat';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { Link, useRoute } from 'wouter-preact';
import { fetchSiteAction } from '../../store/action';

export default function Header() {
  const site = useSelector((state) => state.site);
  const [homeRouteMatched] = useRoute('/home');
  const [blogRouteMatched] = useRoute('/blog');

  const fetchSite = useAction(fetchSiteAction);
  useEffect(() => {
    if (!site) {
      fetchSite();
    }
  }, []);

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
