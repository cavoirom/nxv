import Collector from './collector.js';
import CachedPage from '../cache-store/cached-page.js';

export default class BlogTagCollector extends Collector {
  async collect() {
    const tags = await this.cacheStore.findBlogEntryTags();
    const storedPages = [];
    for (const tag of tags) {
      const { defaultState } = this.config;
      const blogEntryPages = await this.cacheStore.findBlogEntriesByTag(tag);
      // Get blog entry without content.
      const blogEntriesByTag = blogEntryPages.map((blogEntryPage) => {
        const { blogEntry } = blogEntryPage;
        return {
          ...blogEntry,
          content: undefined,
        };
      });
      const state = {
        ...defaultState,
        site: {
          title: `tag: ${tag} - to be continued`,
          path: `/blog/tag/${tag}`,
        },
        blog: {
          ...defaultState.blog,
          entriesByTag: blogEntriesByTag,
        },
      };
      const page = CachedPage.newBlog(
        `/blog/tag/${tag}`,
        'BLOG_TAG',
        state,
        state.blog.entriesByTag,
      );
      const storedPage = await this.cacheStore.addPage(page);
      storedPages.push(storedPage);
    }
    return storedPages;
  }
}
