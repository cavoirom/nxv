import { Fragment, h } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import { fetchPartialState } from '../../store/action.js';
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry';

const BLOG_TAG_URL_PATTERN = /\/blog\/tag\/([\w-/]+)/;

export default function BlogTag() {
  // VARIABLES
  const blog = useSelector((state) => state.blog);
  const [location] = useLocation();
  const tag = location.match(BLOG_TAG_URL_PATTERN)[1];
  const title = useSelector((state) => `${state.site.title} - tag:${tag}`);

  log.debug('Render Blog Tag:', blog);

  // EVENT HANDLERS
  const fetchBlogTagAction = useAction((state) => {
    return fetchPartialState(location).then((blog) => {
      return Promise.resolve({
        ...state,
        blog,
      });
    });
  });

  // EFFECTS
  // Set title
  useEffect(() => {
    document.title = title;
  });

  // Initialize blog if it's undefined
  useEffect(() => {
    if (!blog || !blog.entriesByTag || !blog.entriesByTag.length > 0) {
      fetchBlogTagAction();
    }
  });

  // RENDER COMPONENT
  if (!blog) {
    return h(Fragment);
  }

  const { entriesByTag } = blog;
  const titleItem = h(
    'div',
    { className: 'pure-g' },
    h('div', { className: 'pure-u-1' }, h('h1', { className: 'content__title' }, tag))
  );
  const entryItems = entriesByTag.map((item) => h(SimpleBlogEntry, { blogEntry: item }));
  return h(Fragment, null, titleItem, entryItems);
}