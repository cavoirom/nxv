import { jest } from '@jest/globals';

const state = {
  blog: {},
};

const store = {
  setState: jest.fn(),
  getState: () => state,
};

export default {
  useStore: () => store,
};
