import * as React from 'react';
import { useSelector } from 'react-redux';

function Content() {
  const { me, journey, work } = useSelector((state) => state);

  return (
    <div id="content" className="content">
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{me.title}</h3>
          <p>{me.content}</p>
        </div>
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{journey.title}</h3>
        </div>
        {journey.years.map(renderYear)}
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <h3>{work.title}</h3>
        </div>
        {work.years.map(renderYear)}
      </div>
    </div>
  );
}

function renderYear(year) {
  return (
    <div className="pure-u-1" key={year.year}>
      <h4>{year.year}</h4>
      <ul>{year.events.map(renderEvent)}</ul>
    </div>
  );
}

function renderEvent(event, index) {
  return <li key={index}>{event}</li>;
}

export default Content;
