import CachedFile from './cached-file.js';

export default class CachedFileRepository {
  static FIND_STATEMENT = `SELECT * FROM CachedFile WHERE id = :fileId;`;
  static FIND_BY_PAGE_ID_STATEMENT =
    `SELECT * FROM CachedFile WHERE pageId = :pageId;`;
  static ADD_STATEMENT =
    `INSERT INTO CachedFile ( pageId, relativePath, hash ) VALUES ( :pageId, :relativePath, :hash );`;
  static UPDATE_STATEMENT =
    `UPDATE CachedFile SET ( hash = :hash ) WHERE id = :fileId;`;
  static REMOVE_STETEMENT = `DELETE FROM CachedFile WHERE id = :fileId;`;
  static REMOVE_BY_PAGE_ID_STATEMENT =
    `DELETE FROM CachedFile WHERE pageId = :pageId;`;

  constructor(connection) {
    this.connection = connection;
    this.findCachedFileQuery = this.connection.prepareQuery(
      CachedFileRepository.FIND_STATEMENT,
    );
    this.findCachedFileByPageIdQuery = this.connection.prepareQuery(
      CachedFileRepository.FIND_BY_PAGE_ID_STATEMENT,
    );
    this.addCachedFileQuery = this.connection.prepareQuery(
      CachedFileRepository.ADD_STATEMENT,
    );
    this.removeCachedFileQuery = this.connection.prepareQuery(
      CachedFileRepository.REMOVE_STETEMENT,
    );
    this.removeCachedFileByPageIdQuery = this.connection.prepareQuery(
      CachedFileRepository.REMOVE_BY_PAGE_ID_STATEMENT,
    );
  }

  close() {
    this.findCachedFileQuery.finalize();
    this.findCachedFileByPageIdQuery.finalize();
    this.addCachedFileQuery.finalize();
    this.removeCachedFileQuery.finalize();
    this.removeCachedFileByPageIdQuery.finalize();
  }

  find(fileId) {
    const result = this.findCachedFileQuery.oneEntry({ fileId });
    return CachedFileRepository.toFile(result);
  }

  findByPageId(pageId) {
    const rows = this.findCachedFileByPageIdQuery.allEntries({ pageId });
    return rows.map(CachedFileRepository.toFile);
  }

  add(file) {
    const params = CachedFileRepository.toParams(file);
    this.addCachedFileQuery.execute(params);
    const addedFileId = this.connection.lastInsertRowId;
    const addedFile = new CachedFile(
      addedFileId,
      file.pageId,
      file.relativePath,
      file.hash,
    );
    return addedFile;
  }

  // deno-lint-ignore no-unused-vars
  update(file) {}

  remove(fileId) {
    this.removeCachedFileQuery.execute({ fileId });
  }

  removeByPageId(pageId) {
    this.removeCachedFileByPageIdQuery.execute({ pageId });
  }

  static toParams(file) {
    return {
      pageId: file.pageId,
      relativePath: file.relativePath,
      hash: file.hash,
    };
  }

  static toFile(row) {
    return new CachedFile(
      row.id,
      row.pageId,
      row.relativePath,
      Number.parseInt(row.hash, 10),
    );
  }
}
