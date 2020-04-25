import * as React from 'react';
import * as ReactRedux from 'react-redux';

const useSelector = ReactRedux.useSelector;

function Header() {
  const title = useSelector(state => state.site.title);
  return <header>
    <div className="pure-g">
      <div className="pure-u-1-1">{title}</div>
    </div>
  </header>;
}

export default Header;