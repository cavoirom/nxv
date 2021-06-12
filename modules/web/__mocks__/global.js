import { jest } from '@jest/globals';

const fetch = jest.fn();

Object.defineProperty(window, 'fetch', {
  writable: true,
  value: fetch,
});

export default {
  fetch,
};
