import { Fragment, h } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import action from '../../store/action.js';
const { fetchPartialState } = action;
import { log } from '../../shared/logger.js';
import { SimpleBlogEntry } from '../blog-entry/blog-entry';
import dlv from 'dlv';

const BLOG_TAG_URL_PATTERN = /\/blog\/tag\/([\w-/]+)/;

export default function BlogTag() {
  // VARIABLES
  const entriesByTag = useSelector((state) => dlv(state, 'blog.entriesByTag'));
  const [location] = useLocation();
  const tag = location.match(BLOG_TAG_URL_PATTERN)[1];
  const title = useSelector((state) => `${state.site.title} - tag:${tag}`);

  log.debug('Render Blog Tag:', entriesByTag);

  // EVENT HANDLERS
  const fetchBlogTagAction = useAction((state) => {
    return fetchPartialState(location).then((entriesByTag) => {
      return Promise.resolve({
        ...state,
        blog: {
          ...state.blog,
          entriesByTag,
        },
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
    if (!entriesByTag || entriesByTag.length === 0) {
      fetchBlogTagAction();
    }
  });

  // RENDER COMPONENT
  if (!entriesByTag || entriesByTag.length <= 0) {
    return h(Fragment);
  }

  const titleItem = h(
    'div',
    { className: 'pure-g' },
    h('div', { className: 'pure-u-1' }, h('h1', { className: 'content__title' }, tag))
  );
  const entryItems = entriesByTag.map((item) => h(SimpleBlogEntry, { blogEntry: item }));
  return h(Fragment, null, titleItem, entryItems);
}

export function isBlogTagUrl(blogTagUrl) {
  return BLOG_TAG_URL_PATTERN.test(blogTagUrl);
}
