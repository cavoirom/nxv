import * as React from 'react';
import * as ReactRedux from 'react-redux';

const useSelector = ReactRedux.useSelector;

function Content() {
  const {me, journey, work} = useSelector(state => state);

  return <div id="content" className="content">
    <div className="pure-g">
      <div className="pure-u-1-1">{me.title}</div>
      <div className="pure-u-1-1">{journey.title}</div>
      <div className="pure-u-1-1">{work.title}</div>
    </div>
  </div>;
}

export default Content;