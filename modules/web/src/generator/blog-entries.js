import fs from 'fs';
import path from 'path';
import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import { isEntryUrl, toEntryUrl } from '../app/shared/blog-entries.js';
import generatePage from './pages.js';
import customRemarkable from './remarkable-rules.js';

const PATHNAME_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)$/;
const MARKDOWN_PATTERN = /(\d{4})\/([\w-]+)\/index\.md$/;

/**
 * Convert absolute path of markdown file to public url of blog entry
 */
function toPathname(blogDirectory, markdownPathname) {
  // TODO refactor the whole generator process to prevent reading markdown many times.

  // Get created date to generate pathname
  const md = new Remarkable();
  md.use(frontMatter);
  const env = { frontMatter: undefined };
  const entryMarkdown = fs.readFileSync(markdownPathname, 'utf8');
  md.render(entryMarkdown, env);
  const createdDate = new Date(env.frontMatter.created);
  const year = createdDate.getUTCFullYear();
  const month = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(createdDate.getUTCDate()).padStart(2, '0');

  // Get slug to generate pathname
  const found = markdownPathname.match(MARKDOWN_PATTERN);
  const slug = found[2];

  return `/blog/entry/${year}/${month}/${day}/${slug}`;
}

/**
 * Convert public url of blog entry to absolute path of markdown file
 */
function toMarkdownPathname(blogDirectory, pathname) {
  // const entryPathname = pathname.substring('/blog/entry'.length);
  const found = pathname.match(PATHNAME_PATTERN);
  const year = found[1];
  const slug = found[4];
  return `${blogDirectory}/${year}/${slug}/index.md`;
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

    const found = markdownFile.match(MARKDOWN_PATTERN);
    const slug = found[2];
    const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
    const env = { frontMatter: undefined };
    const entryHtml = md.render(entryMarkdown, env);

    return {
      title: env.frontMatter.title,
      slug,
      author: env.frontMatter.author,
      preview: env.frontMatter.preview,
      created: env.frontMatter.created,
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
