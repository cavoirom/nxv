import render from '../../deps/preact-render-to-string.js';
import { StoreProvider } from '../../app/store/store.js';
import { h } from '../../deps/preact.js';
import { Router } from '../../deps/wouter-preact.js';
import App from '../../app/container/app/app.js';
import { ensureDir } from '../../deps/fs.js';
import { dirname } from '../../deps/path.js';

export default class Renderer {
  constructor(config) {
    this.config = config;
    // Load index template to fill the generated data.
    this.indexTemplate = Deno.readTextFileSync(
      `${config.output}/index.html`,
    );
  }

  _buildPageHtml(page) {
    // Pre-render app html.
    const appHtml = render(
      h(
        StoreProvider,
        { state: page.state },
        h(Router, { ssrPath: page.url }, h(App, null, null)),
      ),
    );
    const index = this.indexTemplate
        .replace(`<title>vinh</title>`, `<title>${page.state.site.title}</title>`)
        .replace(`<div id="app"></div>`, `<div id=\"app\">${appHtml}</div>`)
        .replace(`window.__STATE__ = undefined;`, `window.__STATE__ = fetch('${page.url}/index.json').then(response => response.json());`);
    return index;
  }

  async _writePageHtml(page) {
    // Build Page's HTML
    const pageHtml = this._buildPageHtml(page);
    // Create directory corresponding to url
    const pageDirectory = `${this.config.output}${page.url}`;
    await ensureDir(pageDirectory);
    // Write html to url/index.html file
    await Deno.writeTextFile(`${pageDirectory}/index.html`, pageHtml);
    // Write state to pathname/index.json file
    await Deno.writeTextFile(
      `${pageDirectory}/index.json`,
      JSON.stringify(page.state),
    );
  }

  async _writePartialState(page) {
    const outputJson = `${this.config.output}/api${page.url}.json`;
    const outputDirectory = dirname(outputJson);
    await ensureDir(outputDirectory);
    await Deno.writeTextFile(
      outputJson,
      JSON.stringify(page.partialState),
    );
  }
}
