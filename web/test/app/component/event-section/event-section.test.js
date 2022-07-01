/**
 * @jest-environment jsdom
 */
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import EventSection from '../../../../src/app/component/event-section/event-section';

test('event-section should have correct roles and accessible name', async () => {
  const year = {
    year: 2020,
    events: ['started this site.'],
  };
  render(h(EventSection, { year }));

  // Assert events
  const yearTitle = await screen.findByRole('heading', {
    name: `year ${year.year}`,
  });
  expect(yearTitle.textContent).toEqual(year.year.toString());

  // Assert events
  const firstEvent = await screen.findByRole('listitem', {
    name: `event ${year.events[0]}`,
  });
  expect(firstEvent.textContent).toEqual(year.events[0]);
});
