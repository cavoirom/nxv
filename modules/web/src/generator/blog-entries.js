import fs from 'fs';
import path from 'path';
import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import { isEntryUrl, toEntryUrl } from '../app/shared/blog-entries.js';
import generatePage from './pages.js';
import customRemarkable from './remarkable-rules.js';

const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

/**
 * Convert absolute path of markdown file to public url of blog entry
 */
function toPathname(blogDirectory, markdownPathname) {
  const entryPathname = path.dirname(markdownPathname).substring(blogDirectory.length);
  return `/blog/entry${entryPathname}`;
}

/**
 * Convert public url of blog entry to absolute path of markdown file
 */
function toMarkdownPathname(blogDirectory, pathname) {
  const entryPathname = pathname.substring('/blog/entry'.length);
  return `${blogDirectory + entryPathname}/index.md`;
}

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
        result.push(toPathname(this.blogDirectory, child));
      }
    }
    return result;
  }
}

export class BlogEntryRouteBuilder {
  constructor(config) {
    this.config = config;
    this.blogDirectory = `${config.content}/blog`;
  }

  buildRoute(pathname) {
    const markdownPathname = toMarkdownPathname(this.blogDirectory, pathname);
    const blogEntry = this._buildBlogEntry(markdownPathname);
    return this._buildBlogEntryRoute(blogEntry);
  }

  isValid(pathname) {
    return isEntryUrl(pathname);
  }

  _buildBlogEntry(markdownFile) {
    const pathname = toPathname(this.blogDirectory, markdownFile);

    const md = new Remarkable();
    md.use(frontMatter);
    md.use(extLink, { host: this.config.host });
    md.use(customRemarkable, { pathname, classes: 'blog-entry__image' });

    const found = markdownFile.match(ENTRY_PATH_PATTERN);
    const slug = found[4];
    const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
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
      title: blogEntry.title,
    };
  }
}

export class BlogEntryPageGenerator {
  constructor(config) {
    this.config = config;
  }

  generatePage(route) {
    generatePage(route);
    // copy image to output directory
    const sourceDirectory = `${path.dirname(toMarkdownPathname(`${this.config.content}/blog`, route.pathname))}/image`;
    if (fs.existsSync(sourceDirectory)) {
      const destinationDirectory = `${this.config.output + route.pathname}/image`;
      fs.mkdirSync(destinationDirectory, { recursive: true });

      const images = fs.readdirSync(sourceDirectory);
      images.forEach((image) => {
        fs.copyFileSync(path.join(sourceDirectory, image), path.join(destinationDirectory, image));
      });
    }
  }

  isValid(route) {
    return isEntryUrl(route.pathname);
  }
}
