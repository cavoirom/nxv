import { ofType, combineEpics } from 'redux-observable';
import {
  createFetchSuccessfullyAction,
  FETCH_BLOG,
  FETCH_BLOG_SUCCESSFULLY,
  FETCH_HOME,
  FETCH_HOME_SUCCESSFULLY,
  FETCH_SITE,
  FETCH_SITE_SUCCESSFULLY,
} from './action';
import { flatMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const fetchSiteEpic = (action$) =>
  action$.pipe(
    ofType(FETCH_SITE),
    flatMap(() =>
      ajax
        .getJSON('/api/site.json')
        .pipe(map((response) => createFetchSuccessfullyAction(FETCH_SITE_SUCCESSFULLY, response))),
    ),
  );

const fetchHomeEpic = (action$) =>
  action$.pipe(
    ofType(FETCH_HOME),
    flatMap(() =>
      ajax
        .getJSON('/api/home.json')
        .pipe(map((response) => createFetchSuccessfullyAction(FETCH_HOME_SUCCESSFULLY, response))),
    ),
  );

const fetchBlogEpic = (action$) =>
  action$.pipe(
    ofType(FETCH_BLOG),
    flatMap(() =>
      ajax
        .getJSON('/api/blog.json')
        .pipe(map((response) => createFetchSuccessfullyAction(FETCH_BLOG_SUCCESSFULLY, response))),
    ),
  );

export default function rootEpic(action$, store$, dependencies) {
  return combineEpics(fetchSiteEpic, fetchHomeEpic, fetchBlogEpic)(action$, store$, dependencies).pipe(
    // catch all error happen in epics
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
}
