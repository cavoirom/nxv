import * as path from 'path';
import * as fs from 'fs';

function findBlogEntry(directory) {
  const files = fs.readdirSync(directory);
  let result = [];
  for (const file of files) {
    const child = path.resolve(directory, file);
    if (fs.lstatSync(child).isDirectory()) {
      result = result.concat(findBlogEntry(child));
    } else if (child.endsWith('.md')) {
      result.push(child);
    }
  }
  return result;
}

export default findBlogEntry;
