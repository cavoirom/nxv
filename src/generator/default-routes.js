import config from "./config";

export function buildDefaultRoute(pathname, defaultState) {
  return {
    pathname,
    state: {
      ...defaultState,
    },
  };
}

export function buildBlogRoute(defaultState, blogEntries) {
  const route = {
    pathname: '/blog',
    state: {
      ...defaultState,
      blog: {
        ...defaultState.blog,
        entries: []
      }
    }
  };
  blogEntries.forEach((entry) => {
    const previewBlogEntry = (({ content, ...rest }) => rest)(entry);
    route.state.blog.entries.push(previewBlogEntry);
  });
  return route;
}