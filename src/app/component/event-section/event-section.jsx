import * as React from 'react';

function renderEvent(event, index) {
  return <li key={index}>{event}</li>;
}

export default function EventSection({ year }) {
  return (
    <div className="pure-u-1">
      <h4>{year.year}</h4>
      <ul>{year.events.map(renderEvent)}</ul>
    </div>
  );
}
