export function buildDefaultRoute(pathname, defaultState) {
  return {
    pathname,
    state: {
      ...defaultState,
    },
  };
}
