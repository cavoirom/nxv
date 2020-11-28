import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import extLink from 'remarkable-extlink';
import { isEntryUrl, toEntryUrl } from '../app/shared/blog-entries';
import generatePage from './pages';

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

    const md = new Remarkable();
    md.use(frontMatter);
    md.use(extLink, { host: config.host });
    this.md = md;
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
    const found = markdownFile.match(ENTRY_PATH_PATTERN);
    const slug = found[4];
    const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
    const env = { frontMatter: undefined };
    const entryHtml = this.md.render(entryMarkdown, env);

    // Change relative image path to public url and store information to copy image later
    const $ = cheerio.load(entryHtml);
    const pathname = toPathname(this.blogDirectory, markdownFile);
    const images = [];
    $('img').each((_, value) => {
      const $img = $(value);
      const relativeImagePathname = $img.attr('src');
      if (relativeImagePathname.startsWith('image/')) {
        const absoluteImagePathname = `${path.dirname(markdownFile)}/${relativeImagePathname}`;
        const publicImagePathname = `${pathname}/${relativeImagePathname}`;
        $img.attr('src', publicImagePathname);
        $img.addClass('blog-entry__image');
        images.push({
          source: absoluteImagePathname,
          destination: `${this.config.output}${publicImagePathname}`,
        });
      }
    });
    const content = $('body').html();
    console.log(`Processed Blog Entry HTML:\n${content}`);

    return {
      title: env.frontMatter.title,
      slug,
      author: env.frontMatter.author,
      preview: env.frontMatter.preview,
      created: new Date(env.frontMatter.created),
      updated: env.frontMatter.updated,
      content,
      images,
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
      images: blogEntry.images,
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
    route.images.forEach((image) => {
      const destinationDirectory = path.dirname(image.destination);
      fs.mkdirSync(destinationDirectory, { recursive: true });
      fs.copyFileSync(image.source, image.destination);
    });
  }

  isValid(route) {
    return isEntryUrl(route.pathname);
  }
}
