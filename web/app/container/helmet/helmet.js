import { useEffect } from '../../../deps/preact-hooks.js';
import { Fragment, h } from '../../../deps/preact.js';

export default function Helmet({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return h(Fragment, null, null);
}
