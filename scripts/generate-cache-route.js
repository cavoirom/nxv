const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../dist');
const excludedPaths = ['api', 'worker.js', 'worker.js.map', 'CNAME'];
const additionalPaths = [''];

fs.readdir(directoryPath, (err, fileNames) => {
  if (err) {
    return console.log(`Unable to scan directory: ${err}`);
  }

  const cacheRoutes = fileNames
    .concat(additionalPaths)
    .filter((fileName) => !excludedPaths.includes(fileName))
    .map((fileName) => `"/${fileName}"`)
    .join(',');
  console.log(cacheRoutes);
});
