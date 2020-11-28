import { h } from 'preact';
import { Switch, Route } from 'wouter-preact';
import Home from '../home/home';
import Blog from '../blog/blog';
import BlogEntry from '../blog-entry/blog-entry';
import { log } from '../../shared/logger';

export default function Content() {
  log.debug('Render Content.');

  return (
    <div id="content" className="content">
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:entryUrl+" component={BlogEntry} />
      </Switch>
    </div>
  );
}
