import fs from 'fs';
import path from 'path';
import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import { isEntryUrl, toEntryUrl } from '../app/shared/blog-entries';
import generatePage from './pages';

const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

export class BlogEntryCollector {
  constructor(config) {
    this.config = config;
    this.blogDirectory = `${config.content}/blog`;
  }

  collectPathnames() {
    return this._collectPathnames(this.blogDirectory);
  }

  _collectPathnames(directory) {
    const files = fs.readdirSync(directory);
    let result = [];
    for (const file of files) {
      const child = path.resolve(directory, file);
      if (fs.lstatSync(child).isDirectory()) {
        result = result.concat(this._collectPathnames(child));
      } else if (child.endsWith('.md')) {
        result.push(this._toPathname(child));
      }
    }
    return result;
  }

  _toPathname(markdownPathname) {
    const entryPathname = path.dirname(markdownPathname).substring(this.blogDirectory.length);
    return `/blog/entry${entryPathname}`;
  }
}

export class BlogEntryRouteBuilder {
  constructor(config) {
    this.config = config;
    this.blogDirectory = `${config.content}/blog`;

    const md = new Remarkable();
    md.use(frontMatter);
    md.use(extLink, { host: config.host });
    this.md = md;
  }

  buildRoute(pathname) {
    const markdownPathname = this._toMarkdownPathname(pathname);
    const blogEntry = this._buildBlogEntry(markdownPathname);
    return this._buildBlogEntryRoute(blogEntry);
  }

  isValid(pathname) {
    return isEntryUrl(pathname);
  }

  _toMarkdownPathname(pathname) {
    const entryPathname = pathname.substring('/blog/entry'.length);
    return `${this.blogDirectory + entryPathname}/index.md`;
  }

  _buildBlogEntry(markdownFile) {
    const found = markdownFile.match(ENTRY_PATH_PATTERN);
    const slug = found[4];
    const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
    const env = { frontMatter: undefined };
    const entryHtml = this.md.render(entryMarkdown, env);
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

  _buildBlogEntryRoute(blogEntry) {
    const { defaultState } = this.config;
    const blogEntryPathname = toEntryUrl(blogEntry);
    const blogEntryState = {
      ...defaultState,
      blog: {
        ...defaultState.blog,
        entry: blogEntry,
      },
    };

    return {
      pathname: blogEntryPathname,
      state: blogEntryState,
    };
  }
}

export class BlogEntryPageGenerator {
  constructor(config) {
    this.config = config;
  }

  generatePage(route) {
    // TODO Implement specific generator for Blog Entry.
    generatePage(route);
  }

  isValid(route) {
    return isEntryUrl(route.pathname);
  }
}
