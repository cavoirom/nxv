const FETCH_SITE = 'FETCH_SITE';
const FETCH_SITE_SUCCESSFULLY = 'FETCH_SITE_SUCCESSFULLY';
const FETCH_HOME = 'FETCH_HOME';
const FETCH_HOME_SUCCESSFULLY = 'FETCH_HOME_SUCCESSFULLY';
const FETCH_BLOG = 'FETCH_BLOG';
const FETCH_BLOG_SUCCESSFULLY = 'FETCH_BLOG_SUCCESSFULLY';

export {
  FETCH_SITE,
  FETCH_SITE_SUCCESSFULLY,
  FETCH_HOME,
  FETCH_HOME_SUCCESSFULLY,
  FETCH_BLOG,
  FETCH_BLOG_SUCCESSFULLY,
};

export function createFetchAction(fetchType) {
  return {
    type: fetchType,
  };
}

export function createFetchSuccessfullyAction(fetchType, response) {
  return {
    type: fetchType,
    payload: response,
  };
}
