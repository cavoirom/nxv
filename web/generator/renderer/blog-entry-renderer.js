import Renderer from './renderer.js';
import { copy } from '../../deps/fs.js';

export default class BlogEntryRenderer extends Renderer {
  async render(page) {
    await this._writePageHtml(page);
    await this._writePartialState(page);
    await this._copyImages(page);
  }

  async _copyImages(page) {
    // copy image to output directory
    const sourceDirectory =
      `${this.config.content}/${page.blogEntryDirectory}/image`;
    const destinationDirectory = `${this.config.output + page.url}/image`;

    let sourceDirectoryExists = false;
    try {
      const sourceDirectoryInfo = await Deno.stat(sourceDirectory);
      sourceDirectoryExists = sourceDirectoryInfo.isDirectory;
      // deno-lint-ignore no-unused-vars
    } catch (error) {
      sourceDirectoryExists = false;
    }
    if (sourceDirectoryExists) {
      await copy(sourceDirectory, destinationDirectory);
    }
  }
}
