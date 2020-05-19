import { h, Fragment } from 'preact';
import { useEffect } from 'preact/compat';
import { useDispatch, useSelector } from 'react-redux';
import BlogEntry from '../../component/blog-entry/blog-entry';
import { createFetchAction, FETCH_BLOG } from '../../store/action';

export default function Blog() {
  const blog = useSelector((state) => state.blog);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!blog) {
      dispatch(createFetchAction(FETCH_BLOG));
    }
  }, []);

  if (!blog) {
    return <></>;
  }

  const { entries } = blog;
  return (
    <>
      {entries.map((entry, index) => (
        <BlogEntry key={index} entry={entry} />
      ))}
    </>
  );
}
