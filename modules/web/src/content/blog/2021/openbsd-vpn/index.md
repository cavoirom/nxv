---
title: OpenBSD's VPN
author: vinh
preview: Setting up my home VPN with OpenBSD
created: 2021-01-14T07:48:59.379+07:00
updated: 2021-07-31T14:19:33.356+07:00
tags: self-hosted, openbsd, iked, vpn
---

I'm going to setup VPN with [iked](https://man.openbsd.org/iked.8), a built-in VPN software from OpenBSD. The main focus of this setup is routing all outbound traffic from clients to my ***Gateway***. The Gateway is running OpenBSD, the clients are Android, iOS, MacOS.

The ***iked*** supports IKEv2 which is suitable for iOS and MacOS without additional client, Android could connect via ***strongSwan***. iked supports authentication with *shared secret*, *keypair* and *certificate*. The *shared secret* is the simplest method but least secure because the whole network is at risk if the *shared secret* is compromised. *Keypair* is the next simplier method, but it requires adding the public key to iked every time we add new client. *Certificate* is the most complicated one, we need to setup a ***Public Key Infrastructure*** (PKI) for our system, later, we only need to issue a valid certificate for new client, no change to the iked. I will use PKI for my iked setup.

## Overview

### Prerequisites

* an OpenBSD installation.
* iked is installed by default.
* a self-signed Root CA.
* a server certificate and keypair.
* a client certificate and keypair.

### Planning the VPN

![Orca VPN](image/orca_vpn.svg 'Orca VPN')

The above diagram shows related components in my setup.

The Geteway is running OpenBSD, we will need 2 services:

* ***pf***: filter and route traffic between network interfaces. `net.inet.ip.forwarding=1` should be set for pf routing.
* ***iked***: manage VPN connections.

PKI plays important role to make sure the VPN connection is established and secured. Because we use ***self-signed Root CA***, the ***Root CA*** should be installed on both iked and clients. Otherwise, the systems will not trust server and client certificates.

## Step 1 · Generate CA, certificate and keypair in PEM format

I use self-signed CA to create all certificates:

* Root CA certificate and intermediate CA.
* Server certificate.
* Client certificate.

I prepared these CAs and keypairs in my Macbook because I don't want to leak my Root CA private key. I use JDK's ***keytool*** for generating CA and keypair.

### Generate self-signed Root Certificate Authority.

```

```

### Generate and sign intermediate CA.

```

```

### Generate VPN server certificate.

```

```

### Generate client certificate.

```

```

## Step 2 · Setup PKI for iked

```
/etc/iked/ca/ca.crt
/etc/iked/certs/vpn.example.com.crt
/etc/iked/private/vpn.example.com.key
```

**Important**: all certificates should have `640` permission.

## Step 3 · Configure iked

### Enable iked

iked is disabled by default, I will enable it.

```
rcctl enable iked
```

### iked configuration

Create a `/etc/iked.conf` with permission `640`, otherwise iked will complain about incorrect permission.

```
ikev2 "Example VPN" passive esp \
  from dynamic to any \
  from any to dynamic \
  peer any \
  ikesa enc aes-256 \
    prf hmac-sha2-256 \
    auth hmac-sha2-256 \
    group modp2048 \
  childsa enc aes-256 \
    auth hmac-sha2-256 \
    group modp2048 \
  srcid vpn.example.com \
  lifetime 180m bytes 16G \
  config address 192.168.120.0/24 \
  config name-server 8.8.8.8 \
  config name-server 8.8.4.4 \
  tag "$name-$id"
```

Explanation:

* `from dynamic to any`: traffic from VPN IP to any host will match with this configuration.
* `from any to dynamic`: traffic from any host reponse to VPN IP will match with this configuration.
* `peer any`: the peer (client) can connect to Gateway from any IP address.
* `srcid vpn.example.com`: will tell iked to use the certificate / private key `vpn.example.com`.
* `config address 192.168.120.0/24`: the network of VPN, required to use `dynamic` keyword.

Check configuration.

```
iked -n
```

Start iked.

```
rcctl enable iked
```

## Step 4 · Configure pf

### Enable IP forwarding to let the kernel forward packages destined to other hosts.

```
doas sysctl net.inet.ip.forwarding=1
doas sh -c 'echo "net.inet.ip.forwarding=1" >> /etc/sysctl.conf'
```

### pf configuration

Allow port `500/udp` and `4500/udp`, NAT source address from VPN to public address.

```
/etc/pf.conf
---
wan = vio0
vpn = enc0
...
match out on $wan inet nat-to ($wan:0)
pass in quick on $wan inet proto udp from any to ($wan:0) port {500, 4500} keep state label ipsec
pass in quick on $vpn inet keep state (if-bound)
```

Reload pf rules

```
pfctl -f /etc/pf.conf
```

## Step 5 · Client configuration

Use ***Apple Configurator 2*** to configure VPN profile for Apple devices.

General

* Name: Example
* Identifier: example
* Organization: Example

Certificates

* Root CA.
* Client certificate.

**Note**: Apple Configurator 2 only allow PKCS12 keystore.

VPN

* Connection Name: Example VPN
* Connection Type: IKEv2
* Server: vpn.example.com
* Remote Identifier: vpn.example.com
* Local Identifier: user@vpn.example.com
* Machine Authentication: Certificate
* Certificate Type: ECDSA

## Reference:

* <https://www.going-flying.com/blog/protecting-my-macos-and-ios-devices-with-an-openbsd-vpn.html>
* <https://www.jasworks.org/openbsd-ikev2-home-vpn/>
* <https://blog.lambda.cx/posts/openbsd-vpn-gateway/>
* <https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html>

