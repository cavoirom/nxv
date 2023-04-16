import { h } from '../../../deps/preact.js';
import { Route, Switch, useLocation } from '../../../deps/wouter-preact.js';
import Home from '../home/home.js';
import Blog from '../blog/blog.js';
import BlogEntry, { isBlogEntryUrl } from '../blog-entry/blog-entry.js';
import { log } from '../../shared/logger.js';
import BlogTag from '../blog-tag/blog-tag.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { StoreContext } from '../../store/store.js';
import dlv from '../../../deps/dlv.js';

export default function Content() {
  log.debug('Render Content.');

  // INPUT
  const [location, _setLocation] = useLocation();
  const [state, dispatch] = useContext(StoreContext);
  const blogEntry = dlv(state, 'blog.entry');

  // EFFECTS
  // If the current location is a blog entry and different from current entry,
  // fetch the blog entry based on location. We need this handling for back/forward navigation.
  useEffect(() => {
    if (isBlogEntryUrl(location) && location !== dlv(blogEntry, 'url')) {
      fetchPartialState(location).then((entry) => {
        dispatch({ type: ActionTypes.SET_BLOG_ENTRY, payload: { entry } });
      });
    }
  }, [location]);

  // RENDER
  const BlogEntryWrapper = () => h(BlogEntry, { blogEntry });
  return h(
    'main',
    { id: 'content', className: 'content' },
    h(
      Switch,
      null,
      h(Route, { path: '/home', component: Home }),
      h(Route, { path: '/blog', component: Blog }),
      h(Route, { path: '/blog/tag/:tagUrl+', component: BlogTag }),
      h(Route, { path: '/blog/entry/:entryUrl+', component: BlogEntryWrapper }),
    ),
  );
}
