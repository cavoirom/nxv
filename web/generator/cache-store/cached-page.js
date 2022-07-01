export default class CachedPage {
  constructor(
    id,
    url,
    type,
    state,
    partialState,
    files,
    hash,
    tags,
    blogEntryDirectory,
    blogEntry,
  ) {
    this.id = id;
    this.url = url;
    this.type = type;
    this.state = state;
    this.partialState = partialState;
    this.hash = hash;
    this.files = files;
    this.tags = tags;
    this.blogEntryDirectory = blogEntryDirectory;
    this.blogEntry = blogEntry;
  }

  static newBlogEntry(
    url,
    type,
    state,
    partialState,
    files = [],
    hash = 0,
    tags = [],
    blogEntryDirectory = undefined,
    blogEntry,
  ) {
    return new CachedPage(
      undefined,
      url,
      type,
      state,
      partialState,
      files,
      hash,
      tags,
      blogEntryDirectory,
      blogEntry,
    );
  }

  static newStatic(url, type, state, partialState) {
    return new CachedPage(
      undefined,
      url,
      type,
      state,
      partialState,
      [],
      0,
      [],
      undefined,
      undefined,
    );
  }

  static newBlog(url, type, state, partialState) {
    return new CachedPage(
      undefined,
      url,
      type,
      state,
      partialState,
      [],
      0,
      [],
      undefined,
      undefined,
    );
  }
}
