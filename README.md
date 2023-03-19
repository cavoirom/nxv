# ngxv.org

## Introduction

This repository contains the source code of [ngxv.org](https://ngxv.org). The
development is started with _**node.js/npm**_ but was migrated to _**deno**_
because I see _**deno**_ environment is better in terms of consistency,
dependency management.

## Features

- [x] lightweight.
- [x] pages are pre-generated, could work without JavaScript.
- [x] write blog with Markdown.
- [x] support image in blog entry.
- [ ] RSS.
- [ ] lazy load image.

## Todo

- deno-v1.30 is able to use node standard libraries and modules. Try to make the
  test run again with original npm modules. P/s: it's currently not possible
  because some Node.js APIs are not implemented.
- `deno bundle` is deprecated, use `deno_emit` instead.
- Store all code dependencies to `<repo-root>/vendor` to less depend on outside
  source.

## Git workflow

### Branch convention

`main` contains released code.

`feature/<name-of-feature>` contains current developing feature. The branch is
derived from `main` and to be merged to `main`. We should maintain the linear
history of `main`.

`draft/<name-of-blog-entry>` contains draft blog entry. The branch is derived
from `main`. We can publish the entry by merging the branch to `main` with
_**rebase**_ strategy.

`gh-pages` contains generated website, we didn't use GitHub Page since March
2023 and moved to self-hosted server, we keep the branch name for historical
reason. The branch is created by command `<repo-root>/script/publish`.

### Develop new feature

1. Create new `feature/*` from `main`.
2. Develop feature.
3. Test and merge to `main` with _**rebase**_ strategy.

### Write blog entry

1. Create new `draft/*` from `main`.
2. Write blog entry.
3. Test and merge to `main` with _**rebase**_ strategy.

## Development

### Prerequisites

- _**bash/zsh**_: run various scripts during development.
- _**git**_: source version control and release.
- _**deno**_: code format, bundle, run generator...
- _**dart-sass**_: build SCSS.
- _**JDK**_ 8 or later: run Google Closure Compiler.

### Build

```
<repo-root>/script/build-web-prod
```

### Publish

```
<repo-root>/script/publish
```
