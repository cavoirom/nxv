# ngxv.org

[![Publish](https://travis-ci.com/cavoirom/nxv.svg?branch=main "Publish")](https://travis-ci.com/github/cavoirom/nxv)

## Introduction

This repository contains the source code of [ngxv.org](https://ngxv.org). The
development is started with _**node.js/npm**_ but was migrated to _**deno**_
because I see _**deno**_ environment is better in term of consistency,
dependency management.

## Features

- [x] lightweight.
- [x] pages are pre-generated, could work without JavaScript.
- [x] write blog with Markdown.
- [x] support image in blog entry.
- [ ] lazy load image.

## Git Workflow

### Branch Convention

`main` contains released code.

`feature/<name-of-feature>` contains current developing feature, should increase
minor version after create `feature` branch. The branch is derived from `main`
and to be merged to `main`.

`draft/<name-of-blog-entry>` contains draft blog entry. The branch is derived
from `main`. We can publish the entry by merging the branch to `main`.

`gh-pages` contains generated website, Github Page will use this branch. The
branch is created by command `npm run publish`.

### Develop New Feature

1. Create new `feature/*` from `main`.
2. Increase version if it's not increased from previous release.
3. Develop feature.
4. Test and merge to `main`.

### Write Blog Entry

1. Create new `draft/*` from `main`.
2. Write blog entry.
3. Test and merge to `main`.

## Development

### Prerequisites

- _**bash/zsh**_: run various scripts during development.
- _**git**_: source version control and release.
- _**deno**_: code format, bundle, run generator...
- _**dart-sass**_: build SCSS.
- _**JDK**_ 8 or later: run Google Closure Compiler.

### Build

```
bash ./script/build-web-prod
```

### Publish

```
bash ./script/publish
```

## Travis Integration

<https://travis-ci.com/github/cavoirom/nxv>
