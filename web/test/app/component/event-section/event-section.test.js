import { h } from '../../../../deps/preact.js';
import { render, screen } from '../../../../deps/testing-library-preact.js';
import EventSection from '../../../../app/component/event-section/event-section.js';
import { assertEquals } from '../../../../deps/testing.js';
import { setupDom, tearDownDom } from '../../../dom.js';

Deno.test('event-section should have correct roles and accessible name', async (test) => {
  setupDom();

  const year = {
    year: 2020,
    events: ['started this site.'],
  };
  render(h(EventSection, { year }));

  // Assert events
  // TODO I would like to use screen.findByRole to actually test by accessibility role, but test-library is not support deno for now (2022-07-30).
  const yearTitle = document.querySelector(`[aria-label="year ${year.year}"]`);
  assertEquals(yearTitle.textContent, year.year.toString());

  // Assert events
  // TODO I would like to use screen.findByRole to actually test by accessibility role, but test-library is not support deno for now (2022-07-30).
  const firstEvent = document.querySelector(
    `[aria-label="event ${year.events[0]}"]`,
  );
  assertEquals(firstEvent.textContent, year.events[0]);

  tearDownDom();
});
