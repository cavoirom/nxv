// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useSelector } from '@preact-hooks/unistore';
import { Link } from 'wouter-preact';
import { toEntryUrl } from '../../shared/blog-entries';

export default function Blog() {
  const blog = useSelector((state) => state.blog);

  if (!blog) {
    return <></>;
  }

  const { entries } = blog;
  return (
    <>
      {entries.map((entry) => (
        <div key={toEntryUrl(entry)} className="blog-entry pure-g">
          <div className="pure-u-1">
            <h3 className="blog-entry__title">
              <Link href={toEntryUrl(entry)}>{entry.title}</Link>
            </h3>
            <div className="blog-entry__content">
              <p>{entry.preview}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
