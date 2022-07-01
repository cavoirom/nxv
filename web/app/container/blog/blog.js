import { Fragment, h } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import action from '../../store/action.js';
const { fetchPartialState } = action;
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry';
import dlv from 'dlv';

export default function Blog() {
  const entries = useSelector((state) => dlv(state, 'blog.entries'));
  const [location] = useLocation();

  log.debug('Render Blog:', entries);

  const fetchBlogAction = useAction((state) => {
    return fetchPartialState(location).then((entries) => {
      return Promise.resolve({
        ...state,
        blog: {
          ...state.blog,
          entries,
        },
      });
    });
  });

  // Set title
  useEffect(() => {
    document.title = 'to be continued';
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!entries || entries.length === 0) {
      fetchBlogAction();
    }
  });

  // RENDER COMPONENT
  if (!entries || entries.length === 0) {
    return h(Fragment);
  }
  const entryItems = entries.map((item) =>
    h(SimpleBlogEntry, { blogEntry: item })
  );
  return h(Fragment, null, entryItems);
}
