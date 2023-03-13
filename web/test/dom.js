import { JSDOM } from '../deps/jsdom.js';

export const setupDom = () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><html lang="en"><head></head><body></body></html>`,
    { pretendToBeVisual: true },
  );
  globalThis.document = dom.window.document;
  globalThis.HTMLIFrameElement = dom.window.HTMLIFrameElement;
};

export const tearDownDom = () => {
  delete globalThis.document;
};
