function fetchDefaultState() {
  return fetch('/api/default.json').then((response) => response.json());
}

function fetchPartialState(pageUrl) {
  return fetch(toPartialStateUrl(pageUrl)).then((response) => response.json());
}

function toPartialStateUrl(pageUrl) {
  return `/api${pageUrl}.json`;
}

export default {
  fetchDefaultState,
  fetchPartialState,
  toPartialStateUrl,
};
