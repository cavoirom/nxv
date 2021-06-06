import sqlite3 from 'sqlite3';
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

  constructor(sqliteDatabase) {
    this.sqliteDatabase = sqliteDatabase;

    const sqlite = sqlite3.verbose();
    console.log(`Create database connection: ${this.sqliteDatabase}`);
    this.connection = new sqlite.Database(this.sqliteDatabase);

    // Close connection when exit.
    process.on('SIGINT', () => {
      console.log(`Close database connection: ${this.sqliteDatabase}`);
    });

    this.pageRepo = new CachedPageRepository(this.connection);
    this.fileRepo = new CachedFileRepository(this.connection);
  }

  initialize() {
    const self = this;
    this.connection.serialize(function () {
      self.connection.exec(CacheStore.INITIALIZE_STATEMENTS);
    });
  }

  /**
   * Add a page to cache store.
   * @param {CachedPage} page
   * @returns {Promise<CachedPage>}
   */
  async addPage(page) {
    const storedPage = await this.pageRepo.add(page);
    const storedFiles = [];
    for (const file of storedPage.files) {
      const storedFile = await this.fileRepo.add(file);
      storedFiles.push(storedFile);
    }
    storedPage.files = storedFiles;
    return storedPage;
  }

  // eslint-disable-next-line no-unused-vars
  async updatePage(page) {
    // TODO update page.
  }

  // eslint-disable-next-line no-unused-vars
  async removePage(pageId) {
    // TODO remove page by id.
  }

  async findAllPages() {
    const pages = await this.pageRepo.findAll();
    for (const page of pages) {
      page.files = await this.fileRepo.findByPageId(page.id);
    }
    return pages;
  }

  async findBlogEntryPages() {
    return this.pageRepo.findBlogEntries();
  }

  async findBlogEntryTags() {
    return this.pageRepo.findBlogEntryTags();
  }

  async findBlogEntriesByTag(tag) {
    return this.pageRepo.findBlogEntriesByTag(tag);
  }
}
