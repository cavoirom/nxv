import './header.scss';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const title = useSelector((state) => state.site.title);
  return (
    <header>
      <div className="pure-g">
        <div className="pure-u-1">
          <h1>{title}</h1>
        </div>
        <div className="pure-u-1">
          <h2>
            <NavLink to="/" className="nav-link">me</NavLink>
            <span> &middot; </span>
            <NavLink to="/blog" className="nav-link">blog</NavLink>
            <span> &middot; </span>
            <a href="https://github.com/cavoirom" className="nav-link">github</a>
          </h2>
        </div>
      </div>
    </header>
  );
}
