import Renderer from './renderer.js';
import fs from 'fs';
import path from 'path';

export default class BlogEntryRenderer extends Renderer {
  async render(page) {
    this._writePageHtml(page);
    this._writePartialState(page);
    this._copyImages(page);
  }

  _copyImages(page) {
    // copy image to output directory
    const sourceDirectory = `${this.config.content}/${page.blogEntryDirectory}/image`;
    const destinationDirectory = `${this.config.output + page.url}/image`;
    if (fs.existsSync(sourceDirectory)) {
      fs.mkdirSync(destinationDirectory, { recursive: true });
      const images = fs.readdirSync(sourceDirectory);
      images.forEach((image) => {
        fs.copyFileSync(path.join(sourceDirectory, image), path.join(destinationDirectory, image));
      });
    }
  }
}
