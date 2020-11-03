// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import dlv from 'dlv';
import { isEntryUrl, toEntryJsonUrl, toEntryUrl } from '../../shared/blog-entries';
import { fetchBlogEntry } from '../../store/action';

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const [location] = useLocation();
  const fetchEntry = useAction((state) => {
    if (!isEntryUrl(location)) {
      console.log('The location is not an entry url: ', location);
      return state;
    }
    return fetchBlogEntry(toEntryJsonUrl(location)).then((entry) =>
      Promise.resolve({ ...state, blog: { ...state.blog, entry } }),
    );
  });
  useEffect(() => {
    // Only fetch entry if the current entry is not relevant to the url
    if (!entry || location !== toEntryUrl(entry)) {
      fetchEntry();
    }
  }, [location]);

  if (!entry) {
    return <></>;
  }

  return (
    <div className="blog-entry pure-g">
      <div className="pure-u-1">
        <h3 className="blog-entry__title">{entry.title}</h3>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="blog-entry__content" dangerouslySetInnerHTML={{ __html: entry.content }} />
      </div>
    </div>
  );
}
