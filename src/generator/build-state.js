import * as path from 'path';
import * as fs from 'fs';
import { isEntryUrl } from '../app/shared/blog-entries';

export default function buildState(route) {
  const site = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/site.json'), 'utf8'));
  const home = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/home.json'), 'utf8'));
  const blog = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'api/blog.json'), 'utf8'));
  if (route === '' || route === '/blog' || route === '/home') {
    return { site, home, blog };
  } else if (isEntryUrl(route)) {
    blog.entry = JSON.parse(fs.readFileSync(path.resolve(__dirname, `api${route}.json`), 'utf8'));
    return { site, home, blog };
  }
  return {};
}
