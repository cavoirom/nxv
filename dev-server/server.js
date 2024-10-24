import { serve as httpServe } from './deps/http.js';
import { extname, resolve } from './deps/path.js';
import { mimeTypes } from './mime-types.js';
import { argsParse } from './deps/flags.js';

async function serve(port = 8080, webRootPath = './web/dist') {
  const root = resolve(webRootPath);
  const handler = async (request) => {
    const url = new URL(request.url);
    console.log(`Requested path: ${url.pathname}`);

    const expectedPath = resolve(root, `.${url.pathname}`);
    console.log(`Expected path: ${expectedPath}`);

    let realPath;
    // serve-prod the file if existed.
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

async function main(args) {
  const argsParseOptions = {
    string: ['webRoot'],
    alias: {
      webRoot: 'web-root',
    },
  };

  const parsedArgs = argsParse(args, argsParseOptions);
  const { webRoot } = parsedArgs;
  await serve(undefined, webRoot);
}

try {
  await main(Deno.args);
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
