import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { createFetchSiteAction } from '../../store/action';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer';

export default function App() {
  const dispatch = useDispatch();

  // Fetch data for first load
  useEffect(() => {
    dispatch(createFetchSiteAction());
  }, []);

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
