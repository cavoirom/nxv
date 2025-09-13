import CachedPage from '../cache-store/cached-page.js';
import Collector from './collector.js';

export default class BlogCollector extends Collector {
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
    const updated = blogEntries.map((item) => item.updated).sort((a, b) =>
      b.localeCompare(a)
    ).find((_item) => true);
    const state = {
      ...defaultState,
      site: {
        title: 'to be continued',
        path: '/blog',
      },
      blog: {
        ...defaultState.blog,
        updated: updated,
        entries: blogEntries,
      },
    };

    const page = CachedPage.newBlog('/blog', 'BLOG', state, state.blog.entries);
    return this.cacheStore.addPage(page);
  }
}
