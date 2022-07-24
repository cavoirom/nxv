import Renderer from './renderer.js';
import { copySync, ensureDirSync } from '../../deps/fs.js';

export default class BlogEntryRenderer extends Renderer {
  async render(page) {
    this._writePageHtml(page);
    this._writePartialState(page);
    this._copyImages(page);
  }

  _copyImages(page) {
    // copy image to output directory
    console.log();
    const sourceDirectory =
      `${this.config.content}/${page.blogEntryDirectory}/image`;
    const destinationDirectory = `${this.config.output + page.url}/image`;

    let sourceDirectoryExists = false;
    try {
      const sourceDirectoryInfo = Deno.statSync(sourceDirectory);
      sourceDirectoryExists = sourceDirectoryInfo.isDirectory;
    } catch (error) {
      sourceDirectoryExists = false;
    }
    if (sourceDirectoryExists) {
      copySync(sourceDirectory, destinationDirectory);
    }
  }
}
