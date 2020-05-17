import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../../component/header/header';
import Content from '../../component/content/content';
import { createFetchSiteAction } from '../../store/action';
import Footer from '../../component/footer/footer';

function App() {
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

export default App;
