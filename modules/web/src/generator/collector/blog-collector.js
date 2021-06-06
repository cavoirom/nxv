import CachedPage from '../cache-store/cached-page.js';

export default class BlogCollector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
  }

  async collect() {
    const { defaultState } = this.config;
    const blogEntryPages = await this.cacheStore.findBlogEntryPages();
    // Get blog entry without content.
    const blogEntries = blogEntryPages.map((blogEntryPage) => {
      const { blogEntry } = blogEntryPage;
      return {
        ...blogEntry,
        content: undefined,
      };
    });
    const state = {
      ...defaultState,
      blog: {
        ...defaultState.blog,
        entries: blogEntries,
      },
      pageTitle: defaultState.site.title,
    };

    const page = CachedPage.newBlog('/blog', 'BLOG', state, state.blog.entries);
    return this.cacheStore.addPage(page);
  }
}
