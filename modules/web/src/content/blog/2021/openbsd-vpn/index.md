---
title: OpenBSD's VPN
author: vinh
preview: Setting up my home VPN with OpenBSD
created: 2021-01-14T07:48:59.379+07:00
updated: 2021-07-10T22:28:28.095+07:00
tags: self-hosted, openbsd, iked, vpn
---

I'm going to setup VPN based on [iked](https://man.openbsd.org/iked.8) on OpenBSD.

The iked supports IKEv2 which is suitable for iOS and MacOS without additional client. I need to setup a Public Key Infrastructure (PKI) to use the public key authentication method.

## Prerequisites

* An OpenBSD installation.
* iked is installed by default.

## Step 1 · Generate CA, certificate and keypair in PEM format

I use self-signed CA to create all the certificate needed for this setup:

* CA certificate.
* Server certificate.
* Client certificate.

Generate self-signed Certificate Authority.

```
doas ikectl ca vpn create
```

The CA will be created in `/etc/ssl/vpn`

Install Certificate Authority to `/etc/iked/ca`

```
doas ikectl ca vpn install
```

Generate server certificate

```
doas ikectl ca vpn certificate vpn.cloud.cavoirom.com create
```

Install server certificate

```
doas ikectl ca vpn certificate vpn.cloud.cavoirom.com install
```

Generate client certificate for each client

```
doas ikectl ca vpn certificate miracle-mac.vpn.cloud.cavoirom.com create
```

Install client certificate for each client

```
doas cp /etc/ssl/vpn/miracle-mac@vpn.cloud.cavoirom.com.crt /etc/iked/pubkeys/ufqdn/miracle-mac@vpn.cloud.cavoirom.com
```

Important: all certificates should have `640` permission.

## Step 2 · Configure iked

Enable IP forwarding to let the kernel forward packages destined to other hosts. 

```
doas sysctl net.inet.ip.forwarding=1
doas sh -c 'echo "net.inet.ip.forwarding=1" >> /etc/sysctl.conf'
```

By default, iked is disabled. We will allow iked by adding configuration to `/etc/rc.conf.local`:

```
...
iked_flags=
```

Create a `/etc/iked.conf` with permission `640`, otherwise iked will complain about incorrect permission.

```
ikev2 "Orca VPN" passive esp \
  from 0.0.0.0/0 to 0.0.0.0/0 \
  peer 0.0.0.0/0 \
  ikesa enc aes-256 \
    prf hmac-sha2-256 \
    auth hmac-sha2-256 \
    group modp2048 \
  childsa enc aes-256 \
    auth hmac-sha2-256 \
    group modp2048 \
  srcid vpn.cloud.cavoirom.com \
  lifetime 180m bytes 16G \
  config address 192.168.120.0/24 \
  config name-server 8.8.8.8 \
  config name-server 8.8.4.4 \
  config netmask 255.255.255.0 \
  tag "$name-$id"
```

Check configuration.

```
doas iked -n
```

Start iked.

```
doas rcctl enable iked
```

## Step 3 · Configure firewall

Allow port `500/udp` and `4500/udp`.

## Step 4 · Client configuration

Export the client certificate and transfer to client.

```
doas ikectl ca vpn certificate miracle-mac@vpn.cloud.cavoirom.com export
```

Use Apple Configurator 2 to configure VPN profile.

General

* Name: orca
* Identifier: orca
* Organization: Orca

VPN

* Connection Name: Orca VPN
* Connection Type: IKEv2
* Server: vpn.cloud.cavoirom.com
* Remote Identifier: vpn.cloud.cavoirom.com
* Local Identifier: miracle-mac@vpn.cloud.cavoirom.com
* Machine Authentication: Certificate
* Certificate Type: RSA



Reference:

* <https://www.going-flying.com/blog/protecting-my-macos-and-ios-devices-with-an-openbsd-vpn.html>
* <https://www.jasworks.org/openbsd-ikev2-home-vpn/>
* <https://blog.lambda.cx/posts/openbsd-vpn-gateway/>

