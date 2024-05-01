import { Fragment, h } from '../../../deps/preact.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import EventSection from '../../component/event-section/event-section.js';
import { log } from '../../shared/logger.js';
import { StoreContext } from '../../store/store.js';
import { ActionTypes } from '../../store/action.js';

export default function Home() {
  log.debug('Render Home.');

  const [state, dispatch] = useContext(StoreContext);
  const home = state.home;
  const title = state.home.title;

  // EFFECTS
  // Set title
  useEffect(() => {
    dispatch({ type: ActionTypes.SET_SITE_TITLE, payload: { title } });
  }, [location]);

  if (!home) {
    return h(Fragment);
  }

  const { me, journey, work } = home;

  const journeyEvents = journey.years.map((year) =>
    h(EventSection, { key: year.year, year })
  );
  const workEvents = work.years.map((year) =>
    h(EventSection, { key: year.year, year })
  );
  return h(
    Fragment,
    null,
    h(
      'div',
      { className: 'pure-g' },
      h(
        'div',
        { className: 'pure-u-1' },
        h('h3', null, me.title),
        h('p', { dangerouslySetInnerHTML: { __html: me.content } }),
      ),
    ),
    h(
      'div',
      { className: 'pure-g' },
      h(
        'div',
        { className: 'pure-u-1' },
        h('h3', null, journey.title),
        ...journeyEvents,
      ),
    ),
    h(
      'div',
      { className: 'pure-g' },
      h(
        'div',
        { className: 'pure-u-1' },
        h('h3', null, work.title),
        ...workEvents,
      ),
    ),
  );
}
