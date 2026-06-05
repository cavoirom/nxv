import { resolve } from './deps/path.js';
import { argsParse } from './deps/cli.js';
import { exists } from './deps/fs.js';
import { serveFile } from './deps/http.js';

const createHandler = (root) => (async (request) => {
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
  if (
    realPath === undefined && await directoryExists(expectedPath) &&
    await fileExists(indexPath)
  ) {
    realPath = indexPath;
  }

  // fallback to /index.html
  const rootIndexPath = resolve(root, './index.html');
  if (realPath === undefined && await fileExists(rootIndexPath)) {
    realPath = resolve(root, './index.html');
  }

  console.log(`Real path: ${realPath}`);
  if (realPath) {
    return serveFile(request, realPath);
  }

  return new Response('Not found.', { status: 404 });
});

async function fileExists(path) {
  if (await exists(path, { isFile: true })) {
    return true;
  } else {
    console.log(`File not found: ${path}`);
    return false;
  }
}

async function directoryExists(path) {
  if (await exists(path, { isDirectory: true })) {
    return true;
  } else {
    console.log(`Directory not found: ${path}`);
    return false;
  }
}

function main(args) {
  const argsParseOptions = {
    string: ['webRoot', 'hostname'],
    number: ['port'],
    alias: {
      webRoot: 'web-root',
    },
    default: { hostname: '0.0.0.0', port: 8080, webRoot: './web/dist' },
  };

  const parsedArgs = argsParse(args, argsParseOptions);
  const { webRoot, hostname, port } = parsedArgs;

  const root = resolve(webRoot);
  console.log(
    `HTTP webserver running. Access it at: http://${hostname}:${port}/`,
  );
  console.log(`Serve files from directory: ${root}`);
  Deno.serve({ hostname, port }, createHandler(root));
}

try {
  main(Deno.args);
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
