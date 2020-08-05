import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import * as fs from 'fs';
import config from './config';

const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

function buildBlogEntry(markdownFile) {
  const found = markdownFile.match(ENTRY_PATH_PATTERN);
  const slug = found[4];
  const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
  const md = new Remarkable();
  md.use(frontMatter);
  md.use(extLink, { host: config.host });
  const env = { frontMatter: undefined };
  const entryHtml = md.render(entryMarkdown, env);
  return {
    title: env.frontMatter.title,
    slug,
    author: env.frontMatter.author,
    preview: env.frontMatter.preview,
    created: new Date(env.frontMatter.created),
    updated: env.frontMatter.updated,
    content: entryHtml,
  };
}

export default buildBlogEntry;
