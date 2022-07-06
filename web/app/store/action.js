export function fetchDefaultState() {
  return fetch('/api/default.json').then((response) => response.json());
}

export function fetchPartialState(pageUrl) {
  return fetch(toPartialStateUrl(pageUrl)).then((response) => response.json());
}

export function toPartialStateUrl(pageUrl) {
  return `/api${pageUrl}.json`;
}

export const ActionTypes = {
  SET_BLOG_ENTRY: 0,
  SET_BLOG_ENTRIES: 1,
  SET_BLOG_ENTRIES_BY_TAG: 2,
};
