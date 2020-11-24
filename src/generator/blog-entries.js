import { toEntryUrl } from '../app/shared/blog-entries';
import config from './config';
import fs from 'fs';
import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import path from 'path';

export const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

export function buildBlogEntryRoute(blogEntry) {
  const { defaultState } = config;
  const blogEntryPathname = toEntryUrl(blogEntry);
  const blogEntryState = {
    ...defaultState,
    blog: {
      entries: defaultState.blog.entries,
      entry: blogEntry,
    },
  };

  return {
    pathname: blogEntryPathname,
    state: blogEntryState,
  };
}

export function buildBlogEntry(markdownFile) {
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

export function findBlogEntryPaths(directory) {
  const files = fs.readdirSync(directory);
  let result = [];
  for (const file of files) {
    const child = path.resolve(directory, file);
    if (fs.lstatSync(child).isDirectory()) {
      result = result.concat(findBlogEntryPaths(child));
    } else if (child.endsWith('.md')) {
      result.push(child);
    }
  }
  return result;
}
