import { Fragment, h } from 'preact';
import Header from '../header/header.js';
import Content from '../content/content.js';
import Footer from '../footer/footer.js';
import { log } from '../../shared/logger.js';

export default function App() {
  log.debug('Render App.');

  return h(Fragment, null, h(Header), h(Content), h(Footer));
}
