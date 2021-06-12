---
title: OpenBSD
author: vinh
preview: I experiment with OpenBSD as my server OS
created: 2020-12-21T07:52:11.829+07:00
updated: 2021-06-12T16:57:23.265+07:00
tags: self-hosted, openbsd, httpd, relayd, vim, doas
---

I am moving my internet services from cloud to my controlled servers, to take back my data into my hands.

My servers will run:

* Reverse proxy and HTTP server with Let's Encrypt: host static webside and Wordpress.
* VPN and Firewall: secure inbound & outbound traffic.

I recently interested in OpenBSD because of its security focus and strictly free. I had a long time using Linux at work and home, there was nothing to complain about Linux (especially Gentoo and Archlinux) except the UI is sometime not so nice compare to Windows. Then I got a Macbook and suddenly the UI issues were solved, now the only use case I could think about other OS is running a server, and OpenBSD seems fit my requirement: free, secure, stable and doesn't change so fast.

## Installation

In my use case, I will install OpenBSD on DigitalOcean server. I use the smallest droplet with only $5/month and OpenBSD 6.8.

**Step 1 ·** Prepare the droplet. Because DigitalOcean does not support OpenBSD, we will find a workaround.

* Create a FreeBSD droplet, don't need to care about file system and version because we will replace them with OpenBSD.
* After created the droplet, power it off.

**Step 2 ·** Boot the droplet and start OpenBSD installation.

* Open DigitalOcean web console, select the droplet, then go to Recovery > Boot from Recovery ISO.
* Boot the droplet, and select option 6 in the boot menu for a shell.
* Fetch the OpenBSD Installer: <https://cdn.openbsd.org/pub/OpenBSD/6.8/amd64/miniroot68.img>
* Write the Installer to the first hard disk: `dd if=miniroot68.img of=/dev/vda bs=512k`
* Power off the droplet.
* Go to Recovery > Boot from Hard Drive. Now the Hard Drive already have OpenBSD Installer.
* Power on and the Installer will start.

**Step 3 ·** Take note at some configuration.

* Keyboard layout: default
* Hostname: <hostname>
* Network configuration:
  - Interface: `vio0`
  - Tag: `vio0:none`
  - IPv4 address: `<public-ip-address>`
  - Netmask: `<given-netmask>`
  - IPv6 address: `none`
  - Default IPv4 route: `<given-gateway>`
* File sets:
  - bsd
  - bsd.rd
  - base68.tgz
  - man68.tgz

**Step 4 ·** After the installation finished, it's recommended to read [afterboot](https://man.openbsd.org/afterboot) after the installation. It helped me configure the newly installed host.

The above step is taken from this post <https://www.going-flying.com/blog/openbsd-on-digitalocean.html>.

## Essential tools

### `vim`

Because this is a server, I will install `vim` with *no_x11* favor.

```
pkg_add vim-8.2.1805-no_x11
```

### `doas`

`doas` could be used as a replacement of `sudo` in Linux world. It's included in the base, I only need to configure it.

Because I am the only one log into these servers, I will explicit allow my username has root privilege.

```
/etc/doas.conf
                              
...
permit persist <my-username>
...
```

## Webserver

Running a webserver is one of the main purpose of this server, I will setup a Webserver with TLS based on [this guideline](https://www.alexander-pluhar.de/openbsd-webserver.html), using built-in `relayd`, `httpd`, `acme` (for Let's Encrypt).

Because the `httpd` is running behind `relayd`, I need to refine the configuration to keep actual source address instead the address of `relayd`, following [a post on bsdhowto.ch](https://www.bsdhowto.ch/forwarded.html).

---
*Entry History*

* 2020-12-21 · Created.
* 2021-05-12 · Updated the Installation steps.
