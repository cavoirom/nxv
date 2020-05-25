import { h } from 'preact';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '../home/home';
import Blog from '../blog/blog';

export default function Content() {
  return (
    <div id="content" className="content">
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/blog" component={Blog} />
        <Redirect from="/" to="/blog" exact={true} />
      </Switch>
    </div>
  );
}
