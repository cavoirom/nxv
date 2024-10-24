# Preact render to string

## Steps to reproduce

Clone the preact-render-to-string repository at branch `deno`.

```shell
git clone --branch deno git@github.com:cavoirom/preact-render-to-string.git
```

Build.

```shell
npm install --dev
npm run build
```

Copy bundled files to vendor directory.

```shell
mkdir -p <nxv>/vendor/preact-render-to-string
cp -r <preact-render-to-string>/dist/index.module.js <nxv>/vendor/preact-render-to-string/index.js
cp -r <preact-render-to-string>/dist/index.module.js.map <nxv>/vendor/preact-render-to-string/index.js.map
```

Modify the last line of `.js` file to point to correct `.js.map` file.

Modify the `'preact'` JavaScript import to the relative path of preact.
