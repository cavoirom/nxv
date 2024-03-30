import { h } from '../../../deps/preact.js';

function renderEvent(event, index) {
  return h('li', { key: index, 'aria-label': `event ${event}` }, event);
}

export default function EventSection({ year }) {
  const yearTitle = h(
    'h4',
    { 'aria-label': `year ${year['year']}` },
    year['year'],
  );
  const events = h(
    'ul',
    { 'aria-label': `events in ${year['year']}` },
    year['events'].map(renderEvent),
  );
  return h('div', null, yearTitle, events);
}
