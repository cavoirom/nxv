export function fetchDefaultState() {
  return fetch('/api/default.json').then((response) => response.json());
}

export function fetchPartialState(pageUrl) {
  return fetch(toPartialStateUrl(pageUrl)).then((response) => response.json());
}

export function toPartialStateUrl(pageUrl) {
  return `/api${pageUrl}.json`;
}
