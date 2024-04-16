import { h } from '../../deps/preact.js';
import Renderer from './renderer.js';
import render from '../../deps/preact-render-to-string.js';
import Feed from '../../app/component/feed/feed.js';
import { ensureDir } from '../../deps/fs.js';
import { dirname } from '../../deps/path.js';

export default class FeedRenderer extends Renderer {
  async render(page) {
    const feedXml = '<?xml version="1.0" encoding="UTF-8"?>' +
      render(h(Feed, { state: page.state }, null));
    const pageDirectory = dirname(this.config.output + page.url);
    await ensureDir(pageDirectory);
    await Deno.writeTextFile(this.config.output + page.url, feedXml);
  }
}
