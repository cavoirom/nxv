---
title: What I have learned when setting up this page
author: vinh
preview: Being the sole maintainer of the whole system is an interested journey.
created: 2023-03-18T15:24:08.451+07:00
updated: 2023-03-18T15:24:08.451+07:00
tags: self-hosted, to-be-continued
---

**Responsibility** · because I am the sole maintainer of this page, I need to
keep it running. That means having a plan for server upgrade, think twice before
changing the configuration. But I usually made stupid mistakes, so it's fine to
let the page goes down for a couple of hours.

**Reliability** · I select technologies not by their modern but focus on long
term support, simple to maintain and security. It will help me sleep well and
spend less time to maintain the system.

**Dependency** · I'm trying to keep the third party dependencies minimal in the
code base, it helped me when I need to change the runtime platform of the page
from Node.js to Deno.

**Computer networking** · I know how to use SSH,
[IPsec](/blog/entry/2021/01/14/openbsd-vpn), routing... to set up the servers
for this page. The page is not only about writing, it's about having full
control of a computer system from the domain name to the software and hardware.
I learned how to plan a network, choosing devices and made them connected.

**Infrastructure** · the setup requires me to work on a VPS, a Mikrotik router
and a small computer.

**OpenBSD** · using OpenBSD as the platform and tried to use its built-in tools
to set up the web server, the reverse proxy and the IPsec VPN. I could maintain
a long term system with frequent upgrading and maintaining with fewer efforts.
