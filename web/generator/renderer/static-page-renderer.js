import Renderer from './renderer.js';

export default class StaticPageRenderer extends Renderer {
  render(page) {
    this._writePageHtml(page);
    this._writePartialState(page);
  }
}
