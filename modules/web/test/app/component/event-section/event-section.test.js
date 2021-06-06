/**
 * @jest-environment jsdom
 */

import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import EventSection from '../../../../src/app/component/event-section/event-section';

test('event-section rendering', async () => {
  const year = {
    year: 2020,
    events: ['started this site.'],
  };
  render(h(EventSection, { year }));

  // Assert year
  const yearField = await screen.findByText(year.year);
  expect(yearField.tagName).toEqual('H4');
  expect(yearField.textContent).toEqual(year.year.toString());

  // Assert events
  const firstEvent = await screen.findByText(year.events[0]);
  expect(firstEvent.tagName).toEqual('LI');
  expect(firstEvent.textContent).toEqual(year.events[0]);
});
