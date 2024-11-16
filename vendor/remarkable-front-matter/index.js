import { parse as yamlParse } from 'yaml';

export default function FrontMatterPlugin(md) {
  md.block.ruler.before('code', 'front-matter',
      (state, startLine, endLine) => {
        function get(line) {
          const pos = state.bMarks[line];
          const max = state.eMarks[line];

          return state.src.substr(pos, max - pos);
        }
        if (startLine > 0 || state.blkIndent > 0) { return false; }
        if (state.tShift[startLine] < 0) { return false; }
        if (!get(startLine).match(/^---$/)) { return false; }

        const data = [];

        let line;
        for (line = startLine + 1; line < endLine; line++) {
          const str = get(line);
          if (str.match(/^---$/)) { break; }
          if (state.tShift[line] < 0) { break; }
          data.push(str);
        }

        if (line >= endLine) { return false; }

        state.env.frontMatter = yamlParse(data.join('\n')) || {};

        state.line = ++line;

        return true;
      }, {});
};
