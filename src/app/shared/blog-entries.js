const BLOG_ENTRY_URL_PATTERN = /\/blog\/[\w-/]+/;

export function toEntryUrl(entry) {
  if (!entry) {
    throw 'Entry is undefined.';
  }
  const createdDate = new Date(entry.created);
  const year = createdDate.getFullYear();
  const month = String(createdDate.getMonth() + 1).padStart(2, '0');
  const day = String(createdDate.getDate()).padStart(2, '0');
  return `/blog/entry/${year}/${month}/${day}/${entry.slug}`;
}

export function toEntryJsonUrl(entryUrl) {
  if (!isEntryUrl(entryUrl)) {
    throw 'Not an entry url.';
  }
  return `/api${entryUrl}.json`;
}

export function isEntryUrl(entryUrl) {
  return BLOG_ENTRY_URL_PATTERN.test(entryUrl);
}
