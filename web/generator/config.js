import { resolve } from '../deps/path.js';

const defaultStateJson = Deno.readTextFileSync(
  'web/generator/default-state.json',
);
const defaultState = JSON.parse(defaultStateJson);

const config = {
  output: resolve(Deno.cwd(), './web/build/dist'),
  content: resolve(Deno.cwd(), './web/content'),
  host: 'ngxv.org',
  defaultState,
};

export default config;
