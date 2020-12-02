export function fetchDefaultState() {
  return fetch('/api/default.json').then((response) => response.json());
}

export function fetchBlogEntry(jsonUrl) {
  return fetch(jsonUrl).then((response) => response.json());
}

export function fetchBlog() {
  return fetch('/api/blog.json').then((response) => response.json());
}
