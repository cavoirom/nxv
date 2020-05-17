const FETCH_SITE = 'FETCH_SITE';
const FETCH_SITE_SUCCESSFULLY = 'FETCH_SITE_SUCCESSFULLY';

export { FETCH_SITE, FETCH_SITE_SUCCESSFULLY };

export function createFetchSiteAction() {
  return {
    type: FETCH_SITE,
  };
}

export function createFetchSiteSuccessfullyAction(response) {
  return {
    type: FETCH_SITE_SUCCESSFULLY,
    payload: response,
  };
}
