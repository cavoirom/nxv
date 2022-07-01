/**
 * @jest-environment jsdom
 */
import { h } from 'preact';
import { render, screen } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
const { click } = userEvent.default;
/*
 * Workaround for ESM Mock, based on https://github.com/facebook/jest/issues/10025#issuecomment-811461098
 */
// eslint-disable-next-line jest/no-mocks-import
import mockUnistoreHooks from '../../../../__mocks__/@preact-hooks/unistore.js';
// eslint-disable-next-line jest/no-mocks-import
import mockWouterPreact from '../../../../__mocks__/wouter-preact.js';
// eslint-disable-next-line jest/no-mocks-import
import mockAction from '../../../../src/app/store/__mocks__/action.js';
const asyncModulesHolder = import('@preact-hooks/unistore')
  .then(({ default: unistoreHooks }) => {
    unistoreHooks.useStore = mockUnistoreHooks.useStore;
    return { unistoreHooks };
  })
  .then((asyncModulesHolder) => {
    return import('../../../../src/app/store/action.js').then(
      ({ default: action }) => {
        action.fetchPartialState = mockAction.fetchPartialState;
        return {
          ...asyncModulesHolder,
          action,
        };
      },
    );
  })
  .then((asyncModulesHolder) => {
    return import('wouter-preact').then(({ default: wouterPreact }) => {
      wouterPreact.useLocation = mockWouterPreact.useLocation;
      return {
        ...asyncModulesHolder,
        wouterPreact,
      };
    });
  })
  .then((asyncModulesHolder) => {
    return import('../../../../src/app/component/tags/tags.js').then((
      { default: Tags },
    ) => ({
      ...asyncModulesHolder,
      Tags,
    }));
  });

test('[Tags] should have correct roles and accessible name', async () => {
  const { Tags } = await asyncModulesHolder;
  const tags = ['linux', 'windows'];
  render(h(Tags, { tags }));

  const tagsElement = await screen.findByRole('list');
  expect(tagsElement).toBeTruthy();

  const tagElements = await screen.findAllByRole('listitem');
  tags.forEach((tag, index) =>
    expect(tagElements[index].textContent).toEqual(tag)
  );
});

test('[Tags] should call server to get state and then set correct url when tag is clicked', async () => {
  const { Tags } = await asyncModulesHolder;
  const tags = ['linux', 'windows'];

  mockAction.fetchPartialState.mockImplementation(async () => []);

  render(h(Tags, { tags }));

  const tagElements = await screen.findAllByRole('link');
  click(tagElements[0]);
  const tagPartialStateUrl = mockAction.fetchPartialState.mock.calls[0][0];
  expect(tagPartialStateUrl).toEqual('/blog/tag/linux');
  const location = await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(mockWouterPreact.setLocation.mock.calls[0][0]);
      } catch (error) {
        reject(error);
      }
    });
  });
  expect(location).toEqual('/blog/tag/linux');
});
