import cheerio from 'cheerio';
import fs from 'fs';
import config from './config';

// Load generated html as template to keep generated js/css file name
const templateText = fs.readFileSync(`${config.output}/index.html`, 'utf8');
const $ = cheerio.load(templateText);

const scripts = cheerio.html($('body script'));

export default function buildMainTemplate(pathname, appHtml, title) {
  const $head = $('head');
  $head.find('title').text(title);
  const headHtml = cheerio.html($head);
  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body>
<div id="app">${appHtml}</div>
<script>
  window.__STATE__ = fetch('${pathname}/index.json').then(response => response.json());
</script>
${scripts}
</body>
</html>`;
}
