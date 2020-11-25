import generatePage from './pages';

export class DefaultCollector {
  constructor(config) {
    this.config = config;
  }

  collectPathnames() {
    return this.config.defaultPathnames;
  }
}

export class DefaultRouteBuilder {
  constructor(config) {
    this.config = config;
  }

  buildRoute(pathname) {
    return {
      pathname,
      state: {
        ...this.config.defaultState,
      },
    };
  }

  isValid(pathname) {
    return this.config.defaultPathnames.includes(pathname);
  }
}

export class DefaultPageGenerator {
  constructor(config) {
    this.config = config;
  }

  generatePage(route) {
    // TODO Implement specific generator for Default Routes.
    generatePage(route);
  }

  isValid(route) {
    return this.config.defaultPathnames.includes(route.pathname);
  }
}
