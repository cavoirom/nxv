import path from 'path';
import fs from 'fs';

const defaultStateJson = fs.readFileSync(
  path.resolve(process.cwd(), 'src/generator/default-state.json'),
  'utf8',
);
const defaultState = JSON.parse(defaultStateJson);

const config = {
  output: path.resolve(process.cwd(), 'build/dist'),
  content: path.resolve(process.cwd(), 'src/content'),
  host: 'ngxv.org',
  defaultState,
};

export default config;
