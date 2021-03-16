import { h } from 'preact';

function renderEvent(event, index) {
  return h('li', { key: index }, event);
}

export default function EventSection({ year }) {
  const yearTitle = h('h4', null, year.year);
  const events = h('ul', null, year.events.map(renderEvent));
  return h('div', null, yearTitle, events);
}
