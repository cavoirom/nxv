export default class Collector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
  }

  // deno-lint-ignore require-await
  async collect() {
    throw new Error('Method not implemented.');
  }
}
