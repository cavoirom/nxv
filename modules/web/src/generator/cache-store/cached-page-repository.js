import CachedPage from './cached-page.js';
import CachedFile from './cached-file.js';

export default class CachedPageRepository {
  static ADD_STATEMENT = `INSERT INTO CachedPage ( url, type, state, partialState, hash, tags, blogEntryDirectory, blogEntry )
      VALUES ( $url, $type, json($state), json($partialState), $hash, json($tags), $blogEntryDirectory, json($blogEntry) );`;
  static FIND_ALL_STATEMENT = `SELECT * FROM CachedPage;`;
  static FIND_BLOG_ENTRIES_STATEMENT = `SELECT *, json_extract(blogEntry, '$.updated') as updated FROM CachedPage WHERE type = 'BLOG_ENTRY' ORDER BY updated DESC`;
  static FIND_BLOG_ENTRY_TAGS_STATEMENT = `SELECT DISTINCT value as tag FROM cachedPage, json_each(cachedPage.tags)WHERE cachedPage.type = 'BLOG_ENTRY' ORDER BY tag;`;
  static FIND_BLOG_ENTRIES_BY_TAG_STATEMENT = `SELECT cachedPage.*, json_extract(cachedPage.blogEntry, '$.updated') as updated FROM cachedPage, json_each(cachedPage.tags) WHERE cachedPage.type = 'BLOG_ENTRY' AND json_each.value = $tag ORDER BY updated DESC;`;

  constructor(connection) {
    this.connection = connection;
  }

  async add(page) {
    const params = CachedPageRepository.toParams(page);
    const result = new Promise((resolve, reject) => {
      this.connection.run(CachedPageRepository.ADD_STATEMENT, params, function (error) {
        if (error) {
          reject(error);
          return;
        }
        const updatedFiles = page.files.map(
          (file) => new CachedFile(file.id, this.lastID, file.relativePath, file.hash)
        );
        const storedPage = new CachedPage(
          this.lastID,
          page.url,
          page.type,
          page.state,
          page.partialState,
          updatedFiles,
          page.hash,
          page.tags,
          page.blogEntryDirectory
        );
        resolve(storedPage);
      });
    });
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  async update(page) {}

  // eslint-disable-next-line no-unused-vars
  async remove(page) {}

  async findAll() {
    const result = new Promise((resolve, reject) => {
      this.connection.all(CachedPageRepository.FIND_ALL_STATEMENT, function (error, rows) {
        if (error) {
          reject(error);
          return;
        }
        const pages = rows.map(CachedPageRepository.toPage);
        resolve(pages);
      });
    });
    return result;
  }

  async findBlogEntries() {
    const result = new Promise((resolve, reject) => {
      this.connection.all(CachedPageRepository.FIND_BLOG_ENTRIES_STATEMENT, function (error, rows) {
        if (error) {
          reject(error);
          return;
        }
        const pages = rows.map(CachedPageRepository.toPage);
        resolve(pages);
      });
    });
    return result;
  }

  async findBlogEntryTags() {
    const result = new Promise((resolve, reject) => {
      this.connection.all(CachedPageRepository.FIND_BLOG_ENTRY_TAGS_STATEMENT, function (error, rows) {
        if (error) {
          reject(error);
          return;
        }
        const tags = rows.map((row) => row.tag);
        resolve(tags);
      });
    });
    return result;
  }

  async findBlogEntriesByTag(tag) {
    const result = new Promise((resolve, reject) => {
      this.connection.all(
        CachedPageRepository.FIND_BLOG_ENTRIES_BY_TAG_STATEMENT,
        { $tag: tag },
        function (error, rows) {
          if (error) {
            reject(error);
            return;
          }
          const pages = rows.map(CachedPageRepository.toPage);
          resolve(pages);
        }
      );
    });
    return result;
  }

  static toParams(page) {
    return {
      $url: page.url,
      $type: page.type,
      $state: JSON.stringify(page.state),
      $partialState: JSON.stringify(page.partialState),
      $hash: page.hash,
      $tags: JSON.stringify(page.tags),
      $blogEntryDirectory: page.blogEntryDirectory,
      $blogEntry: JSON.stringify(page.blogEntry),
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
      JSON.parse(row.blogEntry)
    );
  }
}
