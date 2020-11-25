import './footer.scss';

import { h } from 'preact';
import { log } from '../../shared/logger';

export default function Footer() {
  log.debug('Render Footer.');

  return (
    <footer id="footer">
      <div className="pure-g">
        <div className="pure-u-1">
          <hr />
          <i>Since 2020</i>
        </div>
      </div>
    </footer>
  );
}
