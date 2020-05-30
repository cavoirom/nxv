import config from './config';
import * as path from 'path';
import * as fs from 'fs';

const directoryPath = path.join(__dirname, config.distPath);
const excludedPaths = ['api', 'worker.js', 'worker.js.map', 'CNAME'];
const additionalPaths = [''];

export default function generateCacheRoutes() {
  // List all files in /build/dist folder
  const fileNames = fs.readdirSync(directoryPath);

  // Create routes to be caches in local
  const cacheRoutes = fileNames
    .concat(additionalPaths)
    .filter((fileName) => !excludedPaths.includes(fileName))
    .map((fileName) => `"/${fileName}"`)
    .join(',');

  // Replace the place holder routes array with real informations
  const workerPath = path.resolve(__dirname, `${config.distPath}/worker.js`);
  const workerText = fs.readFileSync(workerPath, 'utf8');
  fs.writeFileSync(workerPath, workerText.replace('"rout-place-holder"', cacheRoutes), { encoding: 'utf8' });
}
