import { h } from 'preact';
import { render, screen } from '../../../../deps/testing-library-preact.js';
import userEvent from '../../../../deps/testing-library-user-event.js';
import {
  assertEquals,
  assertExists,
  assertSpyCall,
  returnsNext,
  stub,
} from '../../../../deps/testing.js';
import { setupDom, tearDownDom } from '../../../dom.js';
import Tags from '../../../../app/component/tags/tags.js';
import { _externals } from '../../../../app/component/tags/tags.js';

Deno.test('[Tags] should have correct roles and accessible name', () => {
  setupDom();
  const useContextStub = stub(
    _externals,
    'useContext',
    returnsNext([[{}, () => {}]]),
  );
  const useLocationStub = stub(
    _externals,
    'useLocation',
    returnsNext(['', () => {}]),
  );
  try {
    const tags = ['linux', 'windows'];
    render(h(Tags, { tags }));

    const tagsElement = document.querySelector(`[aria-label="tags"]`);
    assertExists(tagsElement);

    const tagElements = document.querySelectorAll('[aria-label="tags"] li');
    tags.forEach((tag, index) => {
      assertEquals(tagElements[index].textContent, tag);
    });
  } finally {
    useLocationStub.restore();
    useContextStub.restore();
  }

  tearDownDom();
});

// TODO The current combination of Deno testing, deno_dom, @testing-library are
// not working well. We need a test framework that support ESModule and could
// run on browser.
//
// Deno.test('[Tags] should call server to get state and then set correct url when tag is clicked', () => {
//   setupDom();
//
//   const useContextStub = stub(
//     _internals,
//     'useContext',
//     returnsNext([[{}, () => {}]]),
//   );
//   const useLocationStub = stub(
//     _internals,
//     'useLocation',
//     returnsNext(['', () => {}]),
//   );
//   const fetchPartialStateStub = stub(
//     _internals,
//     'fetchPartialState',
//     returnsNext([]),
//   );
//
//   try {
//     const tags = ['linux', 'windows'];
//     render(h(Tags, { tags }));
//     const tagLink = document.querySelector(`[aria-label="tag ${tags[0]}"] a`);
//     console.log(typeof tagLink);
//     userEvent.click(tagLink);
//     // const tagPartialStateUrl = mockAction.fetchPartialState.mock.calls[0][0];
//     // expect(tagPartialStateUrl).toEqual('/blog/tag/linux');
//     assertSpyCall(fetchPartialStateStub, 0, {
//       args: ['/blog/tag/linux'],
//     });
//
//     const location = await new Promise((resolve, reject) => {
//       setTimeout(() => {
//         try {
//           resolve(mockWouterPreact.setLocation.mock.calls[0][0]);
//         } catch (error) {
//           reject(error);
//         }
//       });
//     });
//     assertEquals(location, '/blog/tag/linux');
//   } finally {
//     fetchPartialStateStub.restore();
//     useLocationStub.restore();
//     useContextStub.restore();
//   }
//
//   tearDownDom();
// });
