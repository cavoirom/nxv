import { jest } from '@jest/globals';

const getLocation = jest.fn();
const setLocation = jest.fn();

export default {
  useLocation: () => [getLocation(), setLocation],
  getLocation,
  setLocation,
};
