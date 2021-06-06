import CachedFile from './cached-file.js';

export default class CachedFileRepository {
  static FIND_STATEMENT = `SELECT * FROM CachedFile WHERE id = $fileId;`;
  static FIND_BY_PAGE_ID_STATEMENT = `SELECT * FROM CachedFile WHERE pageId = $pageId;`;
  static ADD_STATEMENT = `INSERT INTO CachedFile ( pageId, relativePath, hash ) VALUES ( $pageId, $relativePath, $hash );`;
  static UPDATE_STATEMENT = `UPDATE CachedFile SET ( hash = $hash ) WHERE id = $fileId;`;
  static REMOVE_STETEMENT = `DELETE FROM CachedFile WHERE id = $fileId;`;
  static REMOVE_BY_PAGE_ID_STATEMENT = `DELETE FROM CachedFile WHERE pageId = $pageId;`;

  constructor(connection) {
    this.connection = connection;
  }

  async find(fileId) {
    const result = new Promise((resolve, reject) => {
      this.connection.get(CachedFileRepository.FIND_STATEMENT, { $fileId: fileId }, function (error, row) {
        if (error) {
          reject(error);
          return;
        }
        if (row === undefined) {
          reject(new Error(`File not found with ID: ${fileId}.`));
        }
        resolve(CachedFileRepository.toFile(row));
      });
    });
    return result;
  }

  async findByPageId(pageId) {
    const result = new Promise((resolve, reject) => {
      this.connection.get(CachedFileRepository.FIND_BY_PAGE_ID_STATEMENT, { $pageId: pageId }, function (error, row) {
        if (error) {
          reject(error);
          return;
        }
        if (row === undefined) {
          resolve([]);
          return;
        }
        resolve(CachedFileRepository.toFile(row));
      });
    });
    return result;
  }

  async add(file) {
    const params = CachedFileRepository.toParams(file);
    const result = new Promise((resolve, reject) => {
      this.connection.run(CachedFileRepository.ADD_STATEMENT, params, function (error) {
        if (error) {
          reject(error);
          return;
        }
        const storedFile = new CachedFile(this.lastID, file.pageId, file.relativePath, file.hash);
        resolve(storedFile);
      });
    });
    return result;
  }

  // eslint-disable-next-line no-unused-vars
  async update(file) {}

  async remove(fileId) {
    const result = new Promise((resolve, reject) => {
      this.connection.run(CachedFileRepository.REMOVE_STETEMENT, { $fileId: fileId }, function (error) {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    return result;
  }

  async removeByPageId(pageId) {
    const result = new Promise((resolve, reject) => {
      this.connection.run(CachedFileRepository.REMOVE_BY_PAGE_ID_STATEMENT, { $pageId: pageId }, function (error) {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
    return result;
  }

  static toParams(file) {
    return {
      $pageId: file.pageId,
      $relativePath: file.relativePath,
      $hash: file.hash,
    };
  }

  static toFile(row) {
    return new CachedFile(row.id, row.pageId, row.relativePath, Number.parseInt(row.hash, 10));
  }
}
