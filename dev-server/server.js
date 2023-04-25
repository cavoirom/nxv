import { serve as httpServe } from './deps/http.js';
import { extname, resolve } from './deps/path.js';
import { mimeTypes } from './mime-types.js';

async function serve(port = 8080, directory = './web/dist') {
  const root = resolve(directory);
  const handler = async (request) => {
    const url = new URL(request.url);
    console.log(`Path: ${url.pathname}`);

    const expectedPath = resolve(root, `.${url.pathname}`);
    console.log(`Expected path: ${expectedPath}`);

    let realPath;
    // serve the file if existed.
    if (await fileExists(expectedPath)) {
      realPath = expectedPath;
    }

    // looking for index in the directory
    const indexPath = resolve(expectedPath, './index.html');
    if (await directoryExists(expectedPath) && await fileExists(indexPath)) {
      realPath = indexPath;
    }

    // fallback to /index.html
    const rootIndexPath = resolve(root, './index.html');
    if (realPath === undefined && await fileExists(rootIndexPath)) {
      realPath = resolve(root, './index.html');
    }

    console.log(`Real path: ${realPath}`);
    if (realPath) {
      const content = await Deno.readFile(realPath);
      const ext = extname(realPath).toLowerCase();
      const contentType = mimeTypes[ext] !== undefined
        ? mimeTypes[ext]
        : 'application/octet-stream';
      return new Response(content, {
        headers: { 'Content-Type': contentType },
        status: 200,
      });
    }

    return new Response('Not found.', { status: 404 });
  };

  console.log(
    `HTTP webserver running. Access it at: http://localhost:${port}/`,
  );
  console.log(`Serve files from directory: ${root}`);
  await httpServe(handler, { port });
}

// Taken from: https://stackoverflow.com/questions/56658114/how-can-one-check-if-a-file-or-directory-exists-using-deno
async function fileExists(path) {
  try {
    const fileInfo = await Deno.stat(path);
    return fileInfo.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      console.log(`File not found: ${path}`);
      return false;
    }
    throw error;
  }
}

async function directoryExists(path) {
  try {
    const directoryInfo = await Deno.stat(path);
    return directoryInfo.isDirectory;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      console.log(`Directory not found: ${path}`);
      return false;
    }
    throw error;
  }
}

await serve();
