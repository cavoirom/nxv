import { Fragment, h } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import { fetchPartialState } from '../../store/action.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry';

export default function Blog() {
  const blog = useSelector((state) => state.blog);
  const title = useSelector((state) => state.site.title);
  const [location] = useLocation();

  log.debug('Render Blog:', blog);

  const fetchBlogAction = useAction((state) => {
    return fetchPartialState(location).then((blog) => {
      return Promise.resolve({
        ...state,
        blog,
      });
    });
  });

  // Set title
  useEffect(() => {
    document.title = title;
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!blog || !blog.entries || !blog.entries.length > 0) {
      fetchBlogAction();
    }
  });

  // RENDER COMPONENT
  if (!blog) {
    return h(Fragment);
  }
  const { entries } = blog;
  // const entryItems = entries.map((item) => renderSimpleBlogEntry(item, openBlogEntry, prefetchBlogEntry));
  const entryItems = entries.map((item) => h(SimpleBlogEntry, { blogEntry: item }));
  return h(Fragment, null, entryItems);
}
