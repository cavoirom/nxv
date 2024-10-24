# Preact

## Steps to reproduce

Clone the preact repository at branch `deno`.

```shell
git clone --branch deno git@github.com:cavoirom/preact.git
```

Build core and hooks.

```shell
npm install --dev
npm run build:core
npm run build:hooks
```

Copy bundled files to vendor directory.

```shell
mkdir -p <nxv>/vendor/preact/hooks
cp -r <preact>/dist/preact.module.js <nxv>/vendor/preact/index.js
cp -r <preact>/dist/preact.module.js.map <nxv>/vendor/preact/index.js.map
cp -r <preact>/hooks/dist/hooks.module.js <nxv>/vendor/preact/hooks/index.js
cp -r <preact>/hooks/dist/hooks.module.js.map <nxv>/vendor/preact/hooks/index.js.map
```

Modify the last line of `.js` file to point to correct `.js.map` file.

Modify the `'preact'` JavaScript import to the relative path of preact.
