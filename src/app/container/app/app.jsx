import * as React from 'react';
import { useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Header from '../header/header';
import { createFetchSiteAction } from '../../store/action';
import Footer from '../footer/footer';

const Home = lazy(() => import('../home/home'));
const Blog = lazy(() => import('../blog/blog'));

export default function App() {
  const dispatch = useDispatch();

  // Fetch data for first load
  useEffect(() => {
    dispatch(createFetchSiteAction());
  }, []);

  return (
    <>
      <Header />
      <div id="content" className="content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/blog" component={Blog} />
        </Switch>
      </div>
      <Footer />
    </>
  );
}
