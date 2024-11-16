var DEFAULT_OPTIONS = {
  target: '_blank',
  rel: 'nofollow noreferrer noopener'
};

/**
 * Defines link is internal.
 * @param host {String} Site hostname.
 * @param href {Object} Parsed url object.
 * @return {Boolean}
 */
function isInternal(host, href) {
  try {
    const linkUrl = new URL(href);
    return linkUrl.host === host || (!linkUrl.protocol && !linkUrl.host && (linkUrl.pathname || linkUrl.hash));
  } catch (_error) {
    // Invalid or relative link is considered internal.
    return true;
  }
};

export default function remarkableExtLink(md, options) {
  var config = Object.assign({}, DEFAULT_OPTIONS, options);

  // Save original method to invoke.
  var originalRender = md.renderer.rules.link_open;

  md.renderer.rules.link_open = function() {
    var result;

    // Invoke original method first.
    result = originalRender.apply(null, arguments);

    // Regex to find href in the rendered output.
    var regexp = /href="([^"]*)"/;

    var href = regexp.exec(result)[1];

    if (!isInternal(config.host, href)) {
      result = result.replace('>', ' target="' + config.target + '" rel="' + config.rel + '">');
    }

    return result;
  };
};
