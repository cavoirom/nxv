import { ofType, combineEpics } from 'redux-observable';
import { createFetchSiteSuccessfullyAction, FETCH_SITE } from './action';
import { flatMap, map, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export function initializeEpic(action$) {
  return action$.pipe(
    ofType(FETCH_SITE),
    // eslint-disable-next-line no-unused-vars
    flatMap((action) =>
      ajax.getJSON('/api/site.json').pipe(map((response) => createFetchSiteSuccessfullyAction(response))),
    ),
  );
}

export default function rootEpic(action$, store$, dependencies) {
  return combineEpics(initializeEpic)(action$, store$, dependencies).pipe(
    // catch all error happen in epics
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );
}
