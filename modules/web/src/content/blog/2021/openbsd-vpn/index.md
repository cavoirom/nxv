---
title: OpenBSD's VPN
author: vinh
preview: Setting up my home VPN with OpenBSD
created: 2021-01-14T07:48:59.379+07:00
updated: 2021-01-14T07:48:59.379+07:00
tags: blog, self-hosted, openbsd, iked, vpn
---

Reference: <https://www.going-flying.com/blog/protecting-my-macos-and-ios-devices-with-an-openbsd-vpn.html>

1. `iked` is installed by default.
2. generate Certificate Authority (CA), certificate, key pair in PEM format.
3. Use FQDN for key name.
4. Path:
    * CA: `/etc/iked/ca/ca.crt`
    * Certificate: `/etc/iked/certs/vpn.nguyenxuanvinh.com`
    * Private key: `/etc/iked/private/private.key`
5. Setup `pf` to route the traffic to `iked`
