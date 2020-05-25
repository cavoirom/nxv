import { h } from 'preact';

export default function BlogEntry({ entry }) {
  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <h3>{entry.title}</h3>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: entry.content }} />
      </div>
    </div>
  );
}
