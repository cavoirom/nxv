import { h } from '../../../deps/preact.js';
import { log } from '../../shared/logger.js';

export default function Footer() {
  log.debug('Render Footer.');

  const separator = h('hr');
  const footerText = h('i', null, 'Since 2020');
  const container = h(
    'div',
    { className: 'pure-g' },
    h('div', { className: 'pure-u-1' }, separator, footerText),
  );
  return h('footer', { id: 'footer' }, container);
}
