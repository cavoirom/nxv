import fs from "fs";
import path from "path";
import {Remarkable} from "remarkable";
import frontMatter from "remarkable-front-matter";
import extLink from "remarkable-extlink";
import config from "./config";

export function buildDefaultRoute(pathname, defaultState) {
  return {
    pathname: pathname,
    state: {
      ...defaultState
    }
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

export const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

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