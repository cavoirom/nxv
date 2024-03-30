import { h } from '../../../deps/preact.js';
import { Route, Switch, useLocation } from '../../../deps/wouter-preact.js';
import Home from '../home/home.js';
import Blog from '../blog/blog.js';
import BlogEntry from '../../component/blog-entry/blog-entry.js';
import { log } from '../../shared/logger.js';
import BlogTag from '../blog-tag/blog-tag.js';
import { useContext, useEffect } from '../../../deps/preact-hooks.js';
import { ActionTypes, fetchPartialState } from '../../store/action.js';
import { StoreContext } from '../../store/store.js';
import dlv from '../../../deps/dlv.js';
import { isBlogEntryUrl } from '../../shared/blog-entries.js';

export default function Content() {
  // INPUT
  const [location, _setNavigation] = useLocation();
  const [state, dispatch] = useContext(StoreContext);
  const blogEntry = dlv(state, 'blog.entry');

  log.debug('Render Content:', location);

  // EFFECTS
  // If the current location is a blog entry and different from current entry,
  // fetch the blog entry based on location. We need this handling for back/forward navigation.
  useEffect(() => {
    log.debug(`Content: location changed: ${location}`);
    if (isBlogEntryUrl(location) && location !== dlv(blogEntry, 'url')) {
      log.debug('Auto fetch blog entry:', location);
      fetchPartialState(location).then((item) => {
        dispatch({
          'type': ActionTypes.SET_BLOG_ENTRY,
          'payload': { 'entry': item },
        });
      });
    }
  }, [location]);

  // RENDER
  return h(
    'main',
    { id: 'content', className: 'content' },
    h(
      Switch,
      null,
      h(Route, { path: '/home' }, h(Home)),
      h(Route, { path: '/blog' }, h(Blog)),
      h(Route, {
        path: '/blog/tag/:tagUrl+',
      }, h(BlogTag)),
      h(Route, {
        path: '/blog/entry/:entryUrl+',
      }, h(BlogEntry, { blogEntry })),
    ),
  );
}
