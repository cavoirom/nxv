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

Deno.test('[Tags] should have correct roles and accessible name', async () => {
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
    const { findByRole, findAllByRole } = render(h(Tags, { tags }));

    const tagsElement = await findByRole('list', { name: `tags` })
    assertExists(tagsElement);

    const tagElements = await findAllByRole('listitem');
    tags.forEach((tag, index) => {
      assertEquals(tagElements[index].textContent, tag);
    });
  } finally {
    useLocationStub.restore();
    useContextStub.restore();
  }

  tearDownDom();
});

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
    const { findByRole } = render(h(Tags, { tags }));
    const tagLink = await findByRole('link', { name: `tag ${tags[0]}` });
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
