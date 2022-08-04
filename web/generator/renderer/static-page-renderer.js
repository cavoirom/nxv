import Renderer from './renderer.js';

export default class StaticPageRenderer extends Renderer {
  async render(page) {
    await this._writePageHtml(page);
    await this._writePartialState(page);
  }
}
