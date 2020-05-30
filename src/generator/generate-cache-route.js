const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../dist');
const excludedPaths = ['api', 'worker.js', 'worker.js.map', 'CNAME'];
const additionalPaths = [''];

export default function generateCacheRoutes() {
  fs.readdir(directoryPath, (err, fileNames) => {
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }

    const cacheRoutes = fileNames
      .concat(additionalPaths)
      .filter((fileName) => !excludedPaths.includes(fileName))
      .map((fileName) => `"/${fileName}"`)
      .join(',');

    const workerPath = path.resolve(__dirname, '../dist/worker.js');
    const workerText = fs.readFileSync(workerPath, { encoding: 'utf8' });
    fs.writeFileSync(workerPath, workerText.replace('"rout-place-holder"', cacheRoutes), { encoding: 'utf8' });
  });
}
