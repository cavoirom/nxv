import * as React from 'react';
import { useSelector } from 'react-redux';
import BlogEntry from '../../component/blog-entry/blog-entry';

export default function Blog() {
  const entries = useSelector((state) => state.blog.entries);
  return (
    <>
      {entries.map((entry, index) => (
        <BlogEntry key={index} entry={entry} />
      ))}
    </>
  );
}
