---
title: "Forking SeKey"
author: "vinh"
preview: "I fork SeKey to build it for macOS 26 on Apple Silicon."
created: "2026-04-03T18:51:28.663+07:00"
updated: "2026-04-03T18:51:28.663+07:00"
tags:
  - "software"
  - "macos"
---

I'm using [SeKey](https://github.com/sekey/sekey) for storing SSH private keys in Secure Enclave. It has worked well since 2018 but has also not been updated since then. Recently, macOS 26 threatened me about this because macOS 26 is the last version supporting Rosetta 2, which is used to run SeKey on Apple Silicon.

Now I have some spare time to keep the lights on. I will [fork SeKey](https://github.com/cavoirom/sekey) and create a build for macOS 26 on Apple Silicon. I don't have Apple Development Membership yet, the first thing I will do is making the build easier and an instruction to build and sign the application for anyone wishes to do it themself. I will also try to get these updates merged to SeKey original repository, I hope that its author will take a look. That's the happy case. Otherwise, I will continue maintaining my fork as long as possible.

