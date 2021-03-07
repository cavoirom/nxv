import { h } from 'preact';
import { Switch, Route } from 'wouter-preact';
import Home from '../home/home';
import Blog from '../blog/blog';
import BlogEntry from '../blog-entry/blog-entry';
import { log } from '../../shared/logger';

export default function Content() {
  log.debug('Render Content.');

  return h(
    'main',
    { id: 'content', className: 'content' },
    h(
      Switch,
      null,
      h(Route, { path: '/home', component: Home }),
      h(Route, { path: '/blog', component: Blog }),
      h(Route, { path: '/blog/:entryUrl+', component: BlogEntry }),
    ),
  );
}
