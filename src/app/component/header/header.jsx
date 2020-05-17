import * as React from 'react';
import { useSelector } from 'react-redux';

function Header() {
  const title = useSelector((state) => state.site.title);
  return (
    <header>
      <div className="pure-g">
        <div className="pure-u-1">
          <h1>{title}</h1>
        </div>
        <div className="pure-u-1">
          <h2>
            <span>me</span> &middot; <span>blog</span> &middot; <span>github</span>
          </h2>
        </div>
      </div>
    </header>
  );
}

export default Header;
