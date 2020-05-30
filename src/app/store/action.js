export function fetchSiteAction() {
  return fetch('/api/site.json')
    .then((response) => response.json())
    .then((data) => Promise.resolve({ site: data }));
}

export function fetchBlogAction() {
  return fetch('/api/blog.json')
    .then((response) => response.json())
    .then((data) => Promise.resolve({ blog: data }));
}

export function fetchHomeAction() {
  return fetch('/api/home.json')
    .then((response) => response.json())
    .then((data) => Promise.resolve({ home: data }));
}
