import { CTOR_KEY, DOMImplementation } from '../deps/deno-dom.js';

export const setupDom = () => {
  const dom = new DOMImplementation(CTOR_KEY);
  const document = dom.createHTMLDocument('Deno Test');
  globalThis.document = document;
};

export const tearDownDom = () => {
  delete globalThis.document;
};
