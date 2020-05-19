import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { Switch, Route } from 'react-router-dom';
import Spinner from '../../component/spinner/spinner';

const Home = lazy(() => import('../home/home'));
const Blog = lazy(() => import('../blog/blog'));

export default function Content() {
  return (
    <div id="content" className="content">
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/blog" component={Blog} />
        </Switch>
      </Suspense>
    </div>
  );
}
