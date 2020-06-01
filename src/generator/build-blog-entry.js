import { Remarkable } from 'remarkable';
import frontMatter from 'remarkable-front-matter';
import * as fs from 'fs';

const ENTRY_PATH_PATTERN = /(\d{4})\/(\d{2})\/(\d{2})\/([\w-]+)\/index\.md/;

function buildBlogEntry(markdownFile) {
  const found = markdownFile.match(ENTRY_PATH_PATTERN);
  const year = found[1];
  const month = found[2];
  const day = found[3];
  const slug = found[4];
  const entryUrl = `/${year}/${month}/${day}/${slug}.json`;
  const entryMarkdown = fs.readFileSync(markdownFile, 'utf8');
  const md = new Remarkable({ linkTarget: '_blank' });
  md.use(frontMatter);
  const env = { frontMatter: undefined };
  const entryHtml = md.render(entryMarkdown, env);
  const entry = {
    title: env.frontMatter.title,
    author: env.frontMatter.author,
    createdDate: env.frontMatter.createdDate,
    modifiedDate: env.frontMatter.modifiedDate,
    content: entryHtml,
  };
  return [entryUrl, entry];
}

export default buildBlogEntry;
