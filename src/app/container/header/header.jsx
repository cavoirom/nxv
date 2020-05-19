import './header.scss';

import { h, Fragment } from 'preact';
import { useEffect } from 'preact/compat';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { createFetchAction, FETCH_SITE } from '../../store/action';

export default function Header() {
  const site = useSelector((state) => state.site);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!site) {
      dispatch(createFetchAction(FETCH_SITE));
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
            <NavLink to="/home" className="nav-link">
              me
            </NavLink>
            <span> &middot; </span>
            <NavLink to="/blog" className="nav-link">
              blog
            </NavLink>
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
