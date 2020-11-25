# nguyenxuanvinh.com

## Introduction

## Git Workflow

### Branch Convention

`main` contains released code.

`dev` contains developing code, to be merged to `main` when release new version.

`feature/<name-of-feature>` contains current developing feature, should increase minor version after create `feature` branch. The branch is derived from `dev` and to be merged to `dev`.

`draft/<name-of-blog-entry>` contains draft blog entry. The branch is derived from `main`. We can publish the entry by merging the branch to `main`.

`gh-pages` contains generated website, Github Page will use this branch. The branch is created by command `npm run publish`.

### Develop New Feature

1. Create new `feature/*` from `dev`.
2. Increase version if it's not increased from previous release.
3. Develop feature.
4. Test and merge to `dev`.

### Write Blog Entry

1. Create new `draft/*` from `main`.
2. Write blog entry.
3. Test and merge to `main`.
4. Run `npm run publish` to publish the blog entry.

## Development

### Build

```
npm run build
```

### Develop

```
npm run serve
```

### Publish

```
npm run publish
```

## Travis Integration

*(to be defined)*
