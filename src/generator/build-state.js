import * as path from 'path';
import * as fs from 'fs';

export default function buildState(route) {
  const site = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/site.json'), 'utf8'));
  if (route === '' || route === '/blog') {
    const blog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/blog.json'), 'utf8'));
    return { site, blog };
  } else if (route === '/home') {
    const home = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/home.json'), 'utf8'));
    return { site, home };
  }
  return {};
}
