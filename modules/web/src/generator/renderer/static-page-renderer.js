import Renderer from './renderer';

export default class StaticPageRenderer extends Renderer {
  async render(page) {
    this._writePageHtml(page);
    this._writePartialState(page);
  }
}
