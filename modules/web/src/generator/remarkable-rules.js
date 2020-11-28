import { utils } from 'remarkable';

const { escapeHtml, unescapeMd, replaceEntities } = utils;

export default function customRemarkable(md, pluginOptions) {
  /**
   * images
   */
  md.renderer.rules.image = ((pluginOptions) => (tokens, idx, options, env) => {
    console.log(pluginOptions);
    const src =
      ' src="' +
      (pluginOptions.pathname ? escapeHtml(pluginOptions.pathname) + '/' : '') +
      escapeHtml(tokens[idx].src) +
      '"';
    const title = tokens[idx].title ? ' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"' : '';
    const alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt))) : '') + '"';
    const classes =
      ' class="' + (pluginOptions.classes ? escapeHtml(replaceEntities(pluginOptions.classes)) : '') + '"';
    const suffix = options.xhtmlOut ? ' /' : '';
    return '<img' + src + alt + title + classes + suffix + '>';
  })(pluginOptions);
}
