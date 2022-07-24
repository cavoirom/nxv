import CachedPage from '../cache-store/cached-page.js';

export default class HomeCollector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
  }

  // deno-lint-ignore require-await
  async collect() {
    const { defaultState } = this.config;
    const state = { ...defaultState, pageTitle: defaultState.site.title };
    const page = CachedPage.newStatic('/home', 'STATIC', state, state.home);
    return this.cacheStore.addPage(page);
  }
}
