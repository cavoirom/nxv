import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

import config from './config';

// Load generated html as template to keep generated js/css file name
const templateText = fs.readFileSync(path.resolve(__dirname, `${config.distPath}/index.html`), 'utf8');
const $ = cheerio.load(templateText);
const head = cheerio.html($('head'));
const scripts = cheerio.html($('body script'));

export default function buildMainTemplate(route, appHtml) {
  return `<!DOCTYPE html>
<html lang="en">
${head}
<body>
<div id="app">${appHtml}</div>
<script>
  window.__STATE__ = fetch('${route}/index.json').then(response => response.json());
</script>
${scripts}
</body>
</html>`;
}
