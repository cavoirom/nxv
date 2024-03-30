# ngxv.org

## Introduction

This repository contains the source code of [ngxv.org](https://ngxv.org). The
development is started with _**node.js/npm**_ but was migrated to _**deno**_
because I see _**deno**_ environment is better in terms of consistency,
dependency management.

_**ngxv.org**_ is a small website for my home page and blog. On the home page, I
listed the company that I worked and some stuffs I did over the years. The blog
contains my writings about the things I'm interesting and what I believe.

### Requirements Overview

#### Features

- [x] Home page: short introduction about the author, stuffs he created,
      companies he worked.
- [x] Blog: the author's writings about the things he's interesting and what he
      believes. Reader could read the blog in chronological order or filter by
      tags.
- [ ] RSS: user with RRS reader could subscribe easily.

#### Non-Functional Requirements

- Lightweight: the website should be minimal, it works best on modern browser
  but also works when JavaScript is disabled.
- Secure: the website is pre-generated, no backend needed.
- The blog entry is written in Markdown, it supports image.
- Store all code dependencies to `<repo-root>/vendor` to less depend on outside
  source.

### Architecture Constraints

#### Technical Constraints

- Programming language: JavaScript, HTML, SCSS, Bash script.
- Platform: deno 1.35 or later.
- Framework: preact 10.13.2.
- IDE: IntelliJ IDEA 2023 or later.
- Source version control: git, GitHub.
- Development tools.
  - _**bash/zsh**_: run various scripts during development.
  - _**git**_: source version control and release.
  - _**deno**_ 1.35 or later: code format, bundle, run generator...
  - _**dart-sass**_ 1.57 or later: build SCSS.
  - _**JDK**_ 8 or later: run Google Closure Compiler.
- Development environment: macOS.
- Production environment: OpenBSD, httpd.

#### Conventions

- Architecture documentation: [arc42](https://arc42.org/).

### System Scope and Context

#### Business Context

- User: a person who visits the website.
- Author: the person who created the website's source code and its content.

#### Technical Context

_(to be updated: drow a diagram to visualize the deployment)_

### Solution Strategy

_(to be defined)_

### Building Block View

_(to be defined)_

### Runtime View

_(to be defined)_

### Deployment View

_(to be defined)_

### Concepts

_(to be defined)_

#### Todo

- List of dependencies that are not support ES module.
  - remarkable-front-matter 1.0.0.
- Could not run tests because `jsdom` is facing error:
  `Error: Not implemented: isContext`. Reference:
  <https://github.com/denoland/deno/issues/18315>. We should give deno some
  time.

#### Git workflow

##### Branch convention

`trunk` contains released code.

`feature/<name-of-feature>` contains current developing feature. The branch is
derived from `trunk` and to be merged to `trunk`. We should maintain the linear
history of `trunk`.

`draft/<name-of-blog-entry>` contains draft blog entry. The branch is derived
from `trunk`. We can publish the entry by merging the branch to `trunk` with
_**rebase**_ strategy.

`gh-pages` contains generated website, we didn't use GitHub Page since March
2023 and moved to self-hosted server, we keep the branch name for historical
reason. The branch is created by command `<repo-root>/script/publish`.

##### Develop new feature

1. Create new `feature/*` from `trunk`.
2. Develop feature.
3. Test and merge to `trunk` with _**rebase**_ strategy.

##### Write blog entry

1. Create new `draft/*` from `trunk`.
2. Write blog entry.
3. Test and merge to `trunk` with _**rebase**_ strategy.

#### Building the website

On the development machine, run the following command to build the website:

```
<repo-root>/script/build-web-prod
```

#### Publishing the website

```
<repo-root>/script/publish
```

The static files are generated and saved to branch `gh-pages`.

Login to the server, clone the repository (skip if already cloned).

```
git clone git@github.com:cavoirom/nxv.git
```

Run the deploy script to publish the website.

```
<repo-root>/script/httpd-deploy
```

### Design Decisions

- We will stop `wouter-preact` at `2.x` version, because the newer version is
  becoming bloated.

#### Troubleshooting

##### Error when generating the website (preact 10.16.0): `Uncaught TypeError: Cannot read properties of undefined (reading '__H')`

It's because of multiple versions of preact are used. The solution is defining
the same preact version all dependencies.

##### Closure Compiler could not work with `dangerouslySetInnerHTML`

When we try to use _**ADVANCE**_ of Closure compiler, the compiler causes
`dangerouslySetInnerHTML` not working. We don't know how to fix.

Reference:
<https://github.com/preactjs/preact/issues/3657#issuecomment-1242715259>

### Quality Requirements

- [ ] Have at least 1 test case for each component.

### Risks and Technical Debts

_(to be defined)_

### Glossary

_(to be defined)_
