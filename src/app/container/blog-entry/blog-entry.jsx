// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useAction, useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import { useEffect } from 'preact/hooks';
import dlv from 'dlv';
import { isEntryUrl, toEntryJsonUrl, toEntryUrl } from '../../shared/blog-entries';
import { fetchBlogEntry } from '../../store/action';
import { log } from '../../shared/logger';

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const entryUrl = toEntryUrl(entry);
  const [location] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  const fetchEntry = useAction((state) => {
    if (!isEntryUrl(location)) {
      log.debug('The location is not an entry url: ', location);
      return state;
    }
    return fetchBlogEntry(toEntryJsonUrl(location)).then((entry) =>
      Promise.resolve({ ...state, blog: { ...state.blog, entry } }),
    );
  });

  useEffect(() => {
    // Only fetch entry if the current entry is not relevant to the url
    if (!entry || location !== entryUrl) {
      fetchEntry();
    }
  }, [location, entry, fetchEntry]);

  if (!entry || location !== entryUrl) {
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
