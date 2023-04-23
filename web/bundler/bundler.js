import esbuild from '../deps/esbuild.js';
import { denoPlugin } from '../deps/esbuild-deno-loader.js';
import { toFileUrl } from '../deps/path.js';
import { argsParse } from '../deps/flags.js';

async function main(args) {
  const argsParseOptions = {
    string: ['importMap', 'entrypoint', 'outFile'],
    alias: {
      importMap: 'import-map',
      outFile: 'out-file',
    },
  };

  const parsedArgs = argsParse(args, argsParseOptions);
  const { importMap, entrypoint, outFile } = parsedArgs;

  const result = await esbuild.build({
    plugins: [
      denoPlugin({
        importMapURL: new URL(
          toFileUrl(importMap),
        ),
      }),
    ],
    entryPoints: [entrypoint],
    outfile: outFile,
    bundle: true,
    format: 'esm',
  });

  console.log(result);

  esbuild.stop();
}

try {
  await main(Deno.args);
} catch (error) {
  console.log(error);
  Deno.exit(1);
}
