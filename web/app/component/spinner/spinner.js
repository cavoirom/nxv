import { h } from '../../../deps/preact.js';

export default function Spinner() {
  const loading = h('div', { className: 'pure-u-1' }, 'Loading..');
  return h('div', { className: 'pure-g' }, loading);
}
