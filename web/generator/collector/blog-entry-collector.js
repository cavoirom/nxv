import { Remarkable } from '../../deps/remarkable.js';
import frontMatter from '../../deps/remarkable-front-matter.js';
import extLink from '../../deps/remarkable-extlink.js';
import customRemarkable from '../remarkable-rules.js';
import CachedPage from '../cache-store/cached-page.js';
import { expandGlobSync } from '../../deps/fs.js';
import { dirname } from '../../deps/path.js';

const SLUG_PATTERN = /(\d{4})\/([\w-]+)\/index\.md$/;

export default class BlogEntryCollector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
    this.blogDirectory = `${config.content}/blog`;
  }

  async collect() {
    const blogEntryDirectories = this._scanBlogEntryDirectories(
      this.blogDirectory,
    );
    const pages = [];
    for (const blogEntryDirectory of blogEntryDirectories) {
      const blogEntry = this._buildBlogEntry(`${blogEntryDirectory}/index.md`);
      // Construct state
      const { defaultState } = this.config;
      const state = {
        ...defaultState,
        pageTitle: blogEntry.title,
        blog: {
          ...defaultState.blog,
          entry: blogEntry,
        },
      };
      // Build URL
      const createdDate = new Date(blogEntry.created);
      const year = createdDate.getUTCFullYear();
      const month = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(createdDate.getUTCDate()).padStart(2, '0');
      const url = `/blog/entry/${year}/${month}/${day}/${blogEntry.slug}`;
      // Blog Entry Page
      const blogEntryDirectoryRelativePath = blogEntryDirectory.substring(
        this.config.content.length + 1,
      );
      const page = CachedPage.newBlogEntry(
        url,
        'BLOG_ENTRY',
        state,
        state.blog.entry,
        [],
        0,
        blogEntry.tags,
        blogEntryDirectoryRelativePath,
        blogEntry,
      );
      const storedPage = await this.cacheStore.addPage(page);
      pages.push(storedPage);
    }
    return pages;
  }

  _scanBlogEntryDirectories(blogDirectory) {
    const result = [...expandGlobSync(`${blogDirectory}\/**\/*.md`)].map((
      item,
    ) => item.path).map(dirname);
    return result;
  }

  _buildBlogEntry(markdownFile) {
    const found = markdownFile.match(SLUG_PATTERN);
    const slug = found[2];
    const blogEntryMarkdown = Deno.readTextFileSync(markdownFile);
    const env = { frontMatter: undefined };

    const md = new Remarkable();
    md.use(frontMatter);
    md.use(extLink, { host: this.config.host });
    md.use(customRemarkable, {
      pathname: `./${slug}`,
      classes: 'blog-entry__image',
    });

    const entryHtml = md.render(blogEntryMarkdown, env);
    const tags = env.frontMatter.tags
      .split(',')
      .map((tag) => tag.trim())
      .sort();
    const url = this._toBlogEntryUrl(slug, env.frontMatter.created);

    return {
      title: env.frontMatter.title,
      url,
      slug,
      author: env.frontMatter.author,
      preview: env.frontMatter.preview,
      created: env.frontMatter.created,
      updated: env.frontMatter.updated,
      content: entryHtml,
      tags,
    };
  }

  _toBlogEntryUrl(slug, created) {
    if (!created) {
      throw new Error(
        'Could not create blog entry url because blog entry is null.',
      );
    }
    const createdDate = new Date(created);
    const year = createdDate.getUTCFullYear();
    const month = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(createdDate.getUTCDate()).padStart(2, '0');
    return `/blog/entry/${year}/${month}/${day}/${slug}`;
  }
}
