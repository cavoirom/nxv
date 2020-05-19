import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { createFetchAction, FETCH_SITE } from '../../store/action';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer';

export default function App() {
  const dispatch = useDispatch();

  // Fetch site data for first load
  useEffect(() => {
    dispatch(createFetchAction(FETCH_SITE));
  }, []);

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
