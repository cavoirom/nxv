import { DB } from '../../deps/sqlite.js';
import CachedPageRepository from './cached-page-repository.js';
import CachedFileRepository from './cached-file-repository.js';

export default class CacheStore {
  /*
   * Use this query to initialize the cache database.
   * The query only tested in SQLite.
   */
  static INITIALIZE_STATEMENTS = `CREATE TABLE IF NOT EXISTS CachedPage (
      id INTEGER PRIMARY KEY,
      url TEXT UNIQUE,
      type TEXT,
      state TEXT,
      partialState TEXT,
      hash TEXT,
      tags TEXT,
      blogEntryDirectory TEXT,
      blogEntry TEXT
    );

    CREATE TABLE IF NOT EXISTS CachedFile (
      id INTEGER PRIMARY KEY,
      pageId INT,
      relativePath TEXT,
      hash TEXT,
      FOREIGN KEY (pageId) REFERENCES CachedPage(id)
    );`;

  constructor(db) {
    console.log(`Create cache store: ${db}`);
    this.db = db;
    this.connection = new DB(this.db);
    this.initialize();
    this.pageRepo = new CachedPageRepository(this.connection);
    this.fileRepo = new CachedFileRepository(this.connection);
  }

  initialize() {
    this.connection.execute(CacheStore.INITIALIZE_STATEMENTS);
  }

  close() {
    this.connection.close();
  }

  /**
   * Add a page to cache store.
   * @param {CachedPage} page
   * @returns {Promise<CachedPage>}
   */
  addPage(page) {
    const storedPage = this.pageRepo.add(page);
    const storedFiles = [];
    for (const file of storedPage.files) {
      const storedFile = this.fileRepo.add(file);
      storedFiles.push(storedFile);
    }
    storedPage.files = storedFiles;
    return storedPage;
  }

  // deno-lint-ignore no-unused-vars
  async updatePage(page) {
    // TODO update page.
  }

  // deno-lint-ignore no-unused-vars
  async removePage(pageId) {
    // TODO remove page by id.
  }

  findAllPages() {
    const pages = this.pageRepo.findAll();
    for (const page of pages) {
      page.files = this.fileRepo.findByPageId(page.id);
    }
    return pages;
  }

  findBlogEntryPages() {
    return this.pageRepo.findBlogEntries();
  }

  findBlogEntryTags() {
    return this.pageRepo.findBlogEntryTags();
  }

  findBlogEntriesByTag(tag) {
    return this.pageRepo.findBlogEntriesByTag(tag);
  }
}
