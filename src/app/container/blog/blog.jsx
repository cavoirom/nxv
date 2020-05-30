// eslint-disable-next-line no-unused-vars
import { h, Fragment } from 'preact';
import { useEffect } from 'preact/compat';
import { useAction, useSelector } from '@preact-hooks/unistore';
import BlogEntry from '../../component/blog-entry/blog-entry';
import { fetchBlogAction } from '../../store/action';

export default function Blog() {
  const blog = useSelector((state) => state.blog);

  const fetchBlog = useAction(fetchBlogAction);
  useEffect(() => {
    if (!blog) {
      fetchBlog();
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
