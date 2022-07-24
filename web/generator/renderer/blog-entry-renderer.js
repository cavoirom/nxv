import Renderer from './renderer.js';
import { copySync } from '../../deps/fs.js';

export default class BlogEntryRenderer extends Renderer {
  render(page) {
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
      // deno-lint-ignore no-unused-vars
    } catch (error) {
      sourceDirectoryExists = false;
    }
    if (sourceDirectoryExists) {
      copySync(sourceDirectory, destinationDirectory);
    }
  }
}
