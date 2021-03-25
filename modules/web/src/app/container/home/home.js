import { h, Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSelector } from '@preact-hooks/unistore';
import EventSection from '../../component/event-section/event-section.js';
import { log } from '../../shared/logger.js';

export default function Home() {
  log.debug('Render Home.');

  const home = useSelector((state) => state.home);
  const title = useSelector((state) => state.site.title);

  // Set title
  useEffect(() => {
    document.title = title;
  });

  if (!home) {
    return h(Fragment);
  }

  const { me, journey, work } = home;

  const journeyEvents = journey.years.map((year) => h(EventSection, { key: year.year, year }));
  const workEvents = work.years.map((year) => h(EventSection, { key: year.year, year }));
  return h(
    Fragment,
    null,
    h(
      'div',
      { className: 'pure-g' },
      h('div', { className: 'pure-u-1' }, h('h3', null, me.title), h('p', null, me.content))
    ),
    h(
      'div',
      { className: 'pure-g' },
      h('div', { className: 'pure-u-1' }, h('h3', null, journey.title), ...journeyEvents)
    ),
    h(
      'div',
      { className: 'pure-g' },
      h('div', { className: 'pure-u-1' }, h('h3', null, work.title), h('p', null, ...workEvents))
    )
  );
}
