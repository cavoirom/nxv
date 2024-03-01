import { useCallback, useContext } from '../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../store/action.js';
import { StoreContext } from '../store/store.js';
import { useLocation } from '../../deps/wouter-preact.js';

const BLOG_ENTRY_URL_PATTERN = /\/blog\/entry\/[\w-/]+/;

export function useOpenBlogEntry() {
  const [_state, dispatch] = useContext(StoreContext);
  const [_location, setLocation] = useLocation();
  return useCallback((entry) => {
    fetchPartialState(entry.url).then((item) => {
      // Only need to scroll to top when user intentionally navigates to a blog.
      // Will keep the scroll position when user navigate back/forward.
      document.documentElement.scrollTop = 0;
      dispatch({ type: ActionTypes.SET_BLOG_ENTRY, payload: { entry: item } });
      setLocation(item.url);
    });
  }, [dispatch, setLocation]);
}

export function isBlogEntryUrl(blogEntryUrl) {
  return BLOG_ENTRY_URL_PATTERN.test(blogEntryUrl);
}

export function toTagColorCssClass(tag) {
  // We pre-defined the number of colors in blog-entry.scss.
  const numberOfColors = 10;
  // Convert string to integer by converting char to 8 bits integer and count the total value.
  const tagUint8Array = new TextEncoder().encode(tag);
  const tagInteger = tagUint8Array.reduce(
    (accumulator, current) => accumulator + current,
    0,
  );
  const tagIndex = tagInteger % numberOfColors;
  return `blog-entry__tag__color-${tagIndex}`;
}
