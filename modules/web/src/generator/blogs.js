import generatePage from './pages.js';
import { BlogEntryCollector, BlogEntryRouteBuilder } from './blog-entries.js';

const BLOG_PATHNAME = '/blog';

export class BlogCollector {
  constructor(config) {
    this.config = config;
  }

  collectPathnames() {
    return [BLOG_PATHNAME];
  }
}

export class BlogRouteBuilder {
  constructor(config) {
    this.config = config;

    this.blogEntryCollector = new BlogEntryCollector(config);
    this.blogEntryRouteBuilder = new BlogEntryRouteBuilder(config);
  }

  buildRoute(pathname) {
    const blogEntryPathnames = this.blogEntryCollector.collectPathnames();
    const blogEntryRoutes = blogEntryPathnames.map((blogEntryPathname) =>
      this.blogEntryRouteBuilder.buildRoute(blogEntryPathname)
    );
    const previewBlogEntries = blogEntryRoutes
      .map((blogEntryRoute) => blogEntryRoute.state.blog.entry)
      .map((blogEntry) => (({ content, ...rest }) => rest)(blogEntry))
      .sort((a, b) => b.updated - a.updated);
    const { defaultState } = this.config;
    return {
      pathname,
      state: {
        ...defaultState,
        blog: {
          ...defaultState.blog,
          entries: previewBlogEntries,
        },
      },
      title: defaultState.site.title,
    };
  }

  isValid(pathname) {
    return BLOG_PATHNAME === pathname;
  }
}

export class BlogPageGenerator {
  constructor(config) {
    this.config = config;
  }

  generatePage(route) {
    generatePage(route);
  }

  isValid(route) {
    return BLOG_PATHNAME === route.pathname;
  }
}
