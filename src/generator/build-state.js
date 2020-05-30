const site = require('../static/api/site.json');
const blog = require('../static/api/blog.json');
const home = require('../static/api/home.json');
export default function buildState(route) {
  if (route === '' || route === '/blog') {
    return { site, blog };
  } else if (route === '/home') {
    return { site, home };
  }
  return {};
}
