import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogEntry from '../../component/blog-entry/blog-entry';
import { createFetchAction, FETCH_BLOG } from '../../store/action';

export default function Blog() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(createFetchAction(FETCH_BLOG));
  }, []);

  const entries = useSelector((state) => state.blog.entries);
  return (
    <>
      {entries.map((entry, index) => (
        <BlogEntry key={index} entry={entry} />
      ))}
    </>
  );
}
