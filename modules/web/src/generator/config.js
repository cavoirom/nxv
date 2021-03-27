import path from 'path';
// TODO We should use standard Node.js for read file.
import defaultState from './default-state.json';

const config = {
  output: path.resolve(process.cwd(), 'build/dist'),
  content: path.resolve(process.cwd(), 'src/content'),
  host: 'nguyenxuanvinh.com',
  static: '',
  defaultPathnames: ['/', '/home'],
  defaultState,
};

export default config;
