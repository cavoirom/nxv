import render from '../../deps/preact-render-to-string.js';
import cheerio from '../../deps/cheerio.js';
import { StoreProvider } from '../../app/store/store.js';
import { h } from '../../deps/preact.js';
import { Router } from '../../deps/wouter-preact.js';
import staticLocationHook from '../../deps/wouter-preact-static-location.js';
import App from '../../app/container/app/app.js';
import { ensureDirSync } from '../../deps/fs.js';
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

  _buildHeadHtml(pageTitle) {
    const $head = this.$generatedIndex('head');
    $head.find('title').text(pageTitle);
    return cheerio.html($head);
  }

  _buildPageHtml(page) {
    const location = staticLocationHook(page.url);
    // Pre-render app html.
    const appHtml = render(
      h(
        StoreProvider,
        { state: page.state },
        h(Router, { hook: location }, h(App, null, null)),
      ),
    );
    // const appHtml = render(
    //     h(
    //         StoreProvider,
    //         { state: page.state },
    //         h(App, null, null),
    //     ),
    // );
    // Build head with title and generated css.
    const headHtml = this._buildHeadHtml(page.state.pageTitle);
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

  _writePageHtml(page) {
    // Build Page's HTML
    const pageHtml = this._buildPageHtml(page);
    // Create directory corresponding to url
    const pageDirectory = `${this.config.output}${page.url}`;
    ensureDirSync(pageDirectory);
    // Write html to url/index.html file
    Deno.writeTextFileSync(`${pageDirectory}/index.html`, pageHtml);
    // Write state to pathname/index.json file
    Deno.writeTextFileSync(
      `${pageDirectory}/index.json`,
      JSON.stringify(page.state),
    );
  }

  _writePartialState(page) {
    const outputJson = `${this.config.output}/api${page.url}.json`;
    const outputDirectory = dirname(outputJson);
    ensureDirSync(outputDirectory);
    Deno.writeTextFileSync(
      outputJson,
      JSON.stringify(page.partialState),
    );
  }
}
