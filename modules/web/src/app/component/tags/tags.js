import { h } from 'preact';
import { useStore } from '@preact-hooks/unistore';
import { fetchPartialState } from '../../store/action';
import { log } from '../../shared/logger';
import { useLocation } from 'wouter-preact';

// eslint-disable-next-line no-unused-vars
export default function Tags({ children, tags }) {
  // VARIABLES
  const store = useStore();
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  // EVENT HANDLERS
  function openTag(ev) {
    const tagUrl = ev.target.getAttribute('href');
    fetchPartialState(tagUrl).then((entriesByTag) => {
      const state = store.getState();
      store.setState({ ...state, blog: { ...state.blog, entriesByTag } });
      setLocation(tagUrl);
      // Scroll page to top, otherwise the blog entry will be opened in the middle.
      document.documentElement.scrollTop = 0;
      log.debug(`Blog tag ${tagUrl} is opened:`, entriesByTag);
    });
    ev.preventDefault();
  }

  // RENDER COMPONENT
  return h(
    'ul',
    { className: 'blog-entry__tags' },
    ...tags.map((tag) => {
      const tagLink = h('a', { href: `/blog/tag/${tag}`, onClick: openTag }, tag);
      return h('li', { className: 'blog-entry__tag' }, tagLink);
    })
  );
}
