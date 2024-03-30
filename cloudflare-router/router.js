const REDIRECT_ROUTES = new Map();
REDIRECT_ROUTES.set('/blog/index.html', '/blog');
REDIRECT_ROUTES.set('/blog/', '/blog');
REDIRECT_ROUTES.set('/home/index.html', '/home');
REDIRECT_ROUTES.set('/home/', '/home');
// DEFAULT ROUTE IS /blog
REDIRECT_ROUTES.set('/index.html', '/blog');
REDIRECT_ROUTES.set('/', '/blog');

// Should redirect /blog/**/index.html
const REDIRECT_BLOG_CHILD_PATTERN =
  /(?:(\/blog\/[\w-\/]+[\d\/]+[\w-]+)(\/(?:index\.html)?))$/;

const REWRITE_ROUTES = new Map();
REWRITE_ROUTES.set('/blog', '/blog/index.html');
REWRITE_ROUTES.set('/home', '/home/index.html');

// Should rewrite /blog/**
const REWRITE_BLOG_CHILD_PATTERN = /(?:\/blog\/[\w-\/]+[\d\/]+[\w-]+)$/;

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

// deno-lint-ignore require-await
async function handleRequest(request) {
  const url = new URL(request.url);

  // Try to do simple url mapping without RegEx for common urls
  if (REDIRECT_ROUTES.has(url.pathname)) {
    return Response.redirect(
      url.origin + REDIRECT_ROUTES.get(url.pathname),
      301,
    );
  } else if (REWRITE_ROUTES.has(url.pathname)) {
    return fetch(url.origin + REWRITE_ROUTES.get(url.pathname));
  } else if (REDIRECT_BLOG_CHILD_PATTERN.test(url.pathname)) {
    const result = REDIRECT_BLOG_CHILD_PATTERN.exec(url.pathname);
    return Response.redirect(result[1], 301);
  } else if (REWRITE_BLOG_CHILD_PATTERN.test(url.pathname)) {
    return fetch(url.href + '/index.html');
  }

  return fetch(request);
}
