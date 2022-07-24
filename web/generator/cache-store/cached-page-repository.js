import CachedPage from './cached-page.js';
import CachedFile from './cached-file.js';

export default class CachedPageRepository {
  static ADD_STATEMENT =
    `INSERT INTO CachedPage ( url, type, state, partialState, hash, tags, blogEntryDirectory, blogEntry )
      VALUES ( :url, :type, json(:state), json(:partialState), :hash, json(:tags), :blogEntryDirectory, json(:blogEntry) );`;
  static FIND_ALL_STATEMENT = `SELECT * FROM CachedPage;`;
  static FIND_BLOG_ENTRIES_STATEMENT =
    `SELECT *, json_extract(blogEntry, '$.updated') as updated FROM CachedPage WHERE type = 'BLOG_ENTRY' ORDER BY updated DESC`;
  static FIND_BLOG_ENTRY_TAGS_STATEMENT =
    `SELECT DISTINCT value as tag FROM cachedPage, json_each(cachedPage.tags) WHERE cachedPage.type = 'BLOG_ENTRY' ORDER BY tag;`;
  static FIND_BLOG_ENTRIES_BY_TAG_STATEMENT =
    `SELECT cachedPage.*, json_extract(cachedPage.blogEntry, '$.updated') as updated FROM cachedPage, json_each(cachedPage.tags) WHERE cachedPage.type = 'BLOG_ENTRY' AND json_each.value = :tag ORDER BY updated DESC;`;

  constructor(connection) {
    this.connection = connection;
    this.addCachedPageQuery = this.connection.prepareQuery(
      CachedPageRepository.ADD_STATEMENT,
    );
    this.findAllCachedPageQuery = this.connection.prepareQuery(
      CachedPageRepository.FIND_ALL_STATEMENT,
    );
    this.findBlogEntriesQuery = this.connection.prepareQuery(
      CachedPageRepository.FIND_BLOG_ENTRIES_STATEMENT,
    );
    this.findBlogEntryTagsQuery = this.connection.prepareQuery(
      CachedPageRepository.FIND_BLOG_ENTRY_TAGS_STATEMENT,
    );
    this.findBlogEntriesByTagQuery = this.connection.prepareQuery(
      CachedPageRepository.FIND_BLOG_ENTRIES_BY_TAG_STATEMENT,
    );
  }

  close() {
    this.addCachedPageQuery.finalize();
    this.findAllCachedPageQuery.finalize();
    this.findBlogEntriesQuery.finalize();
    this.findBlogEntryTagsQuery.finalize();
    this.findBlogEntriesByTagQuery.finalize();
  }

  add(page) {
    const params = CachedPageRepository.toParams(page);
    this.addCachedPageQuery.execute(params);
    const addedCachedPageId = this.connection.lastInsertRowId;
    const updatedFiles = page.files.map(
      (file) =>
        new CachedFile(
          file.id,
          addedCachedPageId,
          file.relativePath,
          file.hash,
        ),
    );
    const addedCachedPage = new CachedPage(
      addedCachedPageId,
      page.url,
      page.type,
      page.state,
      page.partialState,
      updatedFiles,
      page.hash,
      page.tags,
      page.blogEntryDirectory,
    );
    return addedCachedPage;
  }

  // deno-lint-ignore no-unused-vars
  update(page) {}

  // deno-lint-ignore no-unused-vars
  remove(page) {}

  findAll() {
    const rows = this.findAllCachedPageQuery.allEntries();
    const pages = rows.map(CachedPageRepository.toPage);
    return pages;
  }

  findBlogEntries() {
    const rows = this.findBlogEntriesQuery.allEntries();
    const pages = rows.map(CachedPageRepository.toPage);
    return pages;
  }

  findBlogEntryTags() {
    const rows = this.findBlogEntryTagsQuery.allEntries();
    const tags = rows.map((row) => row.tag);
    return tags;
  }

  findBlogEntriesByTag(tag) {
    const rows = this.findBlogEntriesByTagQuery.allEntries({ tag });
    const pages = rows.map(CachedPageRepository.toPage);
    return pages;
  }

  static toParams(page) {
    return {
      url: page.url,
      type: page.type,
      state: JSON.stringify(page.state),
      partialState: JSON.stringify(page.partialState),
      hash: page.hash,
      tags: JSON.stringify(page.tags),
      blogEntryDirectory: page.blogEntryDirectory,
      blogEntry: JSON.stringify(page.blogEntry),
    };
  }

  static toPage(row) {
    return new CachedPage(
      row.id,
      row.url,
      row.type,
      JSON.parse(row.state),
      JSON.parse(row.partialState),
      [],
      Number.parseInt(row.hash, 10),
      JSON.parse(row.tags),
      row.blogEntryDirectory,
      JSON.parse(row.blogEntry),
    );
  }
}
