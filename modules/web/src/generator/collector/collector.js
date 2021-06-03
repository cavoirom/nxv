export default class Collector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
  }

  async collect() {
    throw new Error('Method not implemented.');
  }
}
