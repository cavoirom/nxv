export default class CachedFile {
  constructor(id, pageId, relativePath, hash) {
    this.id = id;
    this.pageId = pageId;
    this.relativePath = relativePath;
    this.hash = hash;
  }
}
