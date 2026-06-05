---
title: "Lex"
author: "vinh"
preview: "An opinionated Vietnamese input method."
created: "2026-06-05T13:56:13.824+07:00"
updated: "2026-06-05T13:56:13.824+07:00"
tags:
  - "coding-agent"
  - "macos"
  - "open-source"
  - "programming"
  - "software"
---

I build [Lex](https://github.com/cavoirom/lex) as an excuse to learn Zig and the
cross-platform software development. It also fixes some inconvenience while
typing Vietnamese such as:

- Type _w_ will produce _ư_.
- The typing rules are so relaxed that they are not predictable. So I build Lex
  with strict rules. User only can put diacritic right after the vowels. Tone
  can be put at the end of the word. When user hit space, the word is committed,
  they could not backspace and change tone. Word start with non-Vietnamese
  consonents such as _f_, _j_, _w_, _z_ won't get processed.
- I always need to configure tone placement to _òa_ instead of the default _oà_.
- I alawys need to configure the keyboard shortcut.

Lex is built to only benefit me and my convenience, I don't recommend everyone
to use it unless you align with the above preferences. Anyway, I'm happy with
the first custom software that I build and use daily.
