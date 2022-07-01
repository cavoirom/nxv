import render from 'preact-render-to-string';
import fs from 'fs';
import cheerio from 'cheerio';
import { configureStore } from '../../app/store/store.js';
import { h } from 'preact';
import { StoreProvider as Provider } from '@preact-hooks/unistore';
import { Router } from 'wouter-preact';
import staticLocationHook from 'wouter-preact/static-location';
import App from '../../app/container/app/app.js';
import path from 'path';

export default class Renderer {
  constructor(config) {
    this.config = config;
    // Load generated html as template to know generated js/css file name.
    const generatedIndex = fs.readFileSync(`${config.output}/index.html`, 'utf8');
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
    // Create store.
    const store = configureStore(page.state);
    // Pre-render app html.
    const appHtml = render(h(Provider, { value: store }, h(Router, { hook: staticLocationHook(page.url) }, h(App))));
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
    fs.mkdirSync(pageDirectory, { recursive: true });
    // Write html to url/index.html file
    const writeOptions = { encoding: 'utf8' };
    fs.writeFileSync(`${pageDirectory}/index.html`, pageHtml, writeOptions);
    // Write state to pathname/index.json file
    fs.writeFileSync(`${pageDirectory}/index.json`, JSON.stringify(page.state), writeOptions);
  }

  _writePartialState(page) {
    const outputJson = `${this.config.output}/api${page.url}.json`;
    const outputDirectory = path.dirname(outputJson);
    const writeOptions = { encoding: 'utf8' };
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(outputJson, JSON.stringify(page.partialState), writeOptions);
  }
}
