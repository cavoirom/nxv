import { h } from 'preact';

export default function BlogEntry({ entry }) {
  return (
    <div className="pure-g">
      <div className="pure-u-1">
        <h3>{entry.title}</h3>
        <p>{entry.content}</p>
      </div>
    </div>
  );
}
