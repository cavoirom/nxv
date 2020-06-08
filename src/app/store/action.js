export function fetchSite() {
  return fetch('/api/site.json').then((response) => response.json());
}

export function fetchBlog() {
  return fetch('/api/blog.json').then((response) => response.json());
}

export function fetchHome() {
  return fetch('/api/home.json').then((response) => response.json());
}

export function fetchBlogEntry(jsonUrl) {
  return fetch(jsonUrl).then((response) => response.json());
}
