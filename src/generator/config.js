import defaultState from './default-state.json';
import * as path from 'path';

const config = {
  output: path.resolve(process.cwd(), 'build/dist'),
  content: path.resolve(process.cwd(), 'src/content'),
  host: 'nguyenxuanvinh.com',
  static: '',
  defaultPathnames: ['/', '/home'],
  defaultState,
};

export default config;
