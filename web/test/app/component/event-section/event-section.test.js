import { h } from '../../../../deps/preact.js';
import { render } from '../../../../deps/testing-library-preact.js';
import EventSection from '../../../../app/component/event-section/event-section.js';
import { assertEquals } from '../../../../deps/testing.js';
import { setupDom, tearDownDom } from '../../../dom.js';

Deno.test('event-section should have correct roles and accessible name', async () => {
  setupDom();

  const year = {
    year: 2020,
    events: ['started this site.'],
  };

  const { findByRole } = render(h(EventSection, { year }));

  // Assert events
  const yearTitle = await findByRole('heading', { name: `year ${year.year}` });
  console.log(yearTitle);
  assertEquals(yearTitle.textContent, year.year.toString());

  // Assert events
  const firstEvent = await findByRole('listitem', { name: `event ${year.events[0]}` });
  assertEquals(firstEvent.textContent, year.events[0]);

  tearDownDom();
});
