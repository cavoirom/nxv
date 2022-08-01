import CachedFile from './cached-file.js';
import Repository from './repository.js';

export default class CachedFileRepository extends Repository {
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
    super(connection);
  }

  find(fileId) {
    const result = this.oneEntry(CachedFileRepository.FIND_STATEMENT, {
      fileId,
    });
    return CachedFileRepository.toFile(result);
  }

  findByPageId(pageId) {
    const rows = this.allEntries(
      CachedFileRepository.FIND_BY_PAGE_ID_STATEMENT,
      { pageId },
    );
    return rows.map(CachedFileRepository.toFile);
  }

  add(file) {
    const params = CachedFileRepository.toParams(file);
    const addedFileId = this.addEntry(
      CachedFileRepository.ADD_STATEMENT,
      params,
    );
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
    this.execute(CachedFileRepository.REMOVE_STETEMENT, { fileId });
  }

  removeByPageId(pageId) {
    this.execute(CachedFileRepository.REMOVE_BY_PAGE_ID_STATEMENT, { pageId });
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
