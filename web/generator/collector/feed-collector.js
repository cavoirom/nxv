import CachedPage from '../cache-store/cached-page.js';
import Collector from './collector.js';

export default class FeedCollector extends Collector {
  async collect() {
    const { defaultState } = this.config;
    const blogEntryPages = await this.cacheStore.findBlogEntryPages();
    const blogEntries = blogEntryPages.map((blogEntryPage) =>
      blogEntryPage.blogEntry
    );
    const updated = blogEntries.map((item) => item.updated).sort((a, b) =>
      b.localeCompare(a)
    ).find((_item) => true);
    const state = {
      ...defaultState,
      site: {
        ...defaultState.site,
        title: 'to be continued',
        path: '/blog/atom.xml',
      },
      blog: {
        ...defaultState.blog,
        updated: updated,
        entries: blogEntries,
      },
    };
    const page = CachedPage.newBlog('/blog/atom.xml', 'FEED', state, undefined);
    return this.cacheStore.addPage(page);
  }
}
