import { utils } from '../deps/remarkable.js';
import { imageDimensionsFromData } from '../deps/image-dimensions.js';

const { escapeHtml, unescapeMd, replaceEntities } = utils;

function _isURL(imagePath) {
  try {
    new URL(imagePath);
    return true;
  } catch (_error) {
    return false;
  }
}

function _getImageDimensions(imagePath) {
  try {
    const imageContent = Deno.readFileSync(imagePath);
    return imageDimensionsFromData(imageContent);
  } catch (_error) {
    return;
  }
}

export default function customRemarkable(md, pluginOptions) {
  /**
   * images
   */
  // deno-lint-ignore no-unused-vars
  md.renderer.rules.image = ((pluginOptions) => (tokens, idx, options, env) => {
    // TODO: the implementation will fail when `src` is a URL.
    const src = ` src="${
      pluginOptions.pathname ? `${escapeHtml(pluginOptions.pathname)}/` : ''
    }${
      escapeHtml(
        tokens[idx].src,
      )
    }"`;
    const dimensions = _isURL(tokens[idx].src)
      ? undefined
      : _getImageDimensions(`${env.markdownDirectory}/${tokens[idx].src}`);
    const width = dimensions ? ` width="${dimensions.width}"` : '';
    const height = dimensions ? ` height="${dimensions.height}"` : '';
    const title = tokens[idx].title
      ? ` title="${escapeHtml(replaceEntities(tokens[idx].title))}"`
      : '';
    const alt = ` alt="${
      tokens[idx].alt
        ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt)))
        : ''
    }"`;
    const classes = ` class="${
      pluginOptions.classes
        ? escapeHtml(replaceEntities(pluginOptions.classes))
        : ''
    }"`;
    const suffix = options.xhtmlOut ? ' /' : '';
    return `<img${src}${width}${height}${alt}${title}${classes}${suffix}>`;
  })(pluginOptions);
}
