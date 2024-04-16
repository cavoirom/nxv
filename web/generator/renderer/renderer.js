import render from '../../deps/preact-render-to-string.js';
import cheerio from '../../deps/cheerio.js';
import { StoreProvider } from '../../app/store/store.js';
import { h } from '../../deps/preact.js';
import { Router } from '../../deps/wouter-preact.js';
import App from '../../app/container/app/app.js';
import { ensureDir } from '../../deps/fs.js';
import { dirname } from '../../deps/path.js';

export default class Renderer {
  constructor(config) {
    this.config = config;
    // Load generated html as template to know generated js/css file name.
    const generatedIndex = Deno.readTextFileSync(
      `${config.output}/index.html`,
    );
    // The $ indicate it's cheerio object, just like jQuery object.
    this.$generatedIndex = cheerio.load(generatedIndex);
    this.$scripts = cheerio.html(this.$generatedIndex('body script'));
  }

  _buildHeadHtml(siteTitle) {
    const $head = this.$generatedIndex('head');
    $head.find('title').text(siteTitle);
    return cheerio.html($head);
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
    // Build head with title and generated css.
    const headHtml = this._buildHeadHtml(page.state.site.title);
    return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body>
<div id="app">${appHtml}</div>
<script>
  window.__STATE__ = fetch('${page.url}/index.json').then(response => response.json());
</script>
${this.$scripts}
</body>
</html>
`;
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
