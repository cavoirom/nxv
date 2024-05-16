import { h } from '../../../../deps/preact.js';
import { render } from '../../../../deps/testing-library-preact.js';
import {
  assertEquals,
  assertExists,
  assertSpyCall,
  returnsNext,
  stub,
} from '../../../../deps/testing.js';
import { setupDom, tearDownDom } from '../../../dom.js';
import Tags, { _externals } from '../../../../app/component/tags/tags.js';
import userEvent from '../../../../deps/testing-library-user-event.js';

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
Deno.test('[Tags] should call server to get state and then set correct url when tag is clicked', async () => {
  setupDom();

  const useContextStub = stub(
    _externals,
    'useContext',
    returnsNext([[{}, () => {}]]),
  );
  const useLocationStub = stub(
    _externals,
    'useLocation',
    returnsNext([['', () => {}]]),
  );
  const fetchPartialStateStub = stub(
    _externals,
    'fetchPartialState',
    returnsNext([Promise.resolve({})]),
  );

  try {
    const tags = ['linux', 'windows'];
    render(h(Tags, { tags }));
    const tagLink = document.querySelector(`[aria-label="tag ${tags[0]}"]`);
    await userEvent.click(tagLink);

    assertSpyCall(fetchPartialStateStub, 0, {
      args: ['/blog/tag/linux'],
    });
  } finally {
    fetchPartialStateStub.restore();
    useLocationStub.restore();
    useContextStub.restore();
  }

  tearDownDom();
});
