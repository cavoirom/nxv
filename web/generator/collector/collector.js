import { resolve } from '../../deps/path.js';

export default class Collector {
  constructor(cacheStore, config) {
    this.cacheStore = cacheStore;
    this.config = config;
    this.content = resolve(`${config.workingDirectory}/${config.content}`);
  }

  // deno-lint-ignore require-await
  async collect() {
    throw new Error('Method not implemented.');
  }
}
