// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useSelector } from '@preact-hooks/unistore';
import { useLocation } from 'wouter-preact';
import dlv from 'dlv';
import { toEntryUrl } from '../../shared/blog-entries';
import { log } from '../../shared/logger';

export default function BlogEntry() {
  const entry = useSelector((state) => dlv(state, 'blog.entry'));
  const entryUrl = toEntryUrl(entry);
  const [location] = useLocation();

  log.debug('Render BlogEntry:', `url: ${location}`, '| entry: ', entry);

  if (!entry || location !== entryUrl) {
    return <></>;
  }

  return (
    <div className="blog-entry pure-g">
      <div className="pure-u-1">
        <h1 className="blog-entry__title">{entry.title}</h1>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="blog-entry__content" dangerouslySetInnerHTML={{ __html: entry.content }} />
      </div>
    </div>
  );
}
