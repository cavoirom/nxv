import { h, Fragment } from 'preact';
import Header from '../header/header';
import Content from '../content/content';
import Footer from '../footer/footer';
import { log } from '../../shared/logger';

export default function App() {
  log.debug('Render App.');

  return h(Fragment, null, Header(), Content(), Footer());
}
