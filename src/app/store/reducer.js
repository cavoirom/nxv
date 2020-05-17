import { FETCH_SITE_SUCCESSFULLY } from './action';

export default function rootReducer(state, action) {
  if (action.type === FETCH_SITE_SUCCESSFULLY) {
    return action.payload;
  }
  return state;
}
