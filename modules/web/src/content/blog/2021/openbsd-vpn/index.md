---
title: OpenBSD's VPN
author: vinh
preview: Setting up my home VPN with OpenBSD
created: 2021-01-14T07:48:59.379+07:00
updated: 2021-07-31T17:34:24.227+07:00
tags: self-hosted, openbsd, iked, vpn
---

*Note: I wrote the guideline based on OpenBSD 6.9.*

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

The Geteway is running OpenBSD, I will need 2 services:

* ***pf***: filter and route traffic between network interfaces. `net.inet.ip.forwarding=1` should be set for pf routing.
* ***iked***: manage VPN connections.

PKI plays important role to make sure the VPN connection is established and secured. Because I use ***self-signed Root CA***, the ***Root CA*** should be installed on both iked and clients. Otherwise, the systems will not trust server and client certificates.

## Step 1 · Generate CA, certificate and keypair in PEM format

I use self-signed CA to create all certificates:

* Root CA certificate and intermediate CA.
* Server certificate.
* Client certificate.

I prepared these CAs and keypairs in my Macbook because I don't want to leak my Root CA private key. I use JDK's ***keytool*** for generating CA and keypair.

### Generate self-signed Root Certificate Authority.

I will create a PKCS12 keystore named `root_ca.pfx` to store the self-signed Rooot CA and its private key. The keystore should be secured at all cost to protect the system trusted in it.

```
keytool -keystore root_ca.pfx \
    -storetype pkcs12 \
    -alias example_root_ca \
    -genkeypair \
    -keyalg EC \
    -keysize 256 \
    -sigalg SHA256withECDSA \
    -validity 3654 \
    -ext bc:c
```

Explanation:

* `-keystore root_ca.pfx`: use the keystore `root_ca.pfx`, create new keystore if it's not existed.
* `-storetype pkcs12`: use PKCS12 format which is supported by many softwares, especially Apple Configurator 2.
* `-alias example_root_ca`: the keystore can store many alias, I will store the new Root CA to alias called `example_root_ca`.
* `-genkeypair`: tell keytool to generate a keypair (public key and private key).
* `-keyalg EC`, `keysize 256`: the algorithm used to create the keypair. EC mean ECDSA, a modern algorithm. It's more secure than RSA and the key size is shorter (256 compare to RSA's 2048).
* `-sigalg SHA256withECDSA`: the method to self-sign the Root CA. It should match with `-keyalg`.
* `-validity 3654`: the Root CA will valid for next 10 years.
* `-ext bc:c`: indicate this is Root CA.

When running the above command, keytool ask for information about the Root CA, enter what suitable for you.

* Keystore password: this password will protect all aliases in the keystore.
* First and last name (***Common Name*** of the certificate)?
* Organizational unit?
* Organization?
* City?
* State?
* Country?

### Generate and sign intermediate CA.

I can use the Root CA to sign server & client certificate, but it will risk all systems if the Root CA is compromised. Because our systems will trusted any certificates signed by this Root CA. The good practice is creating an intermediate certificate and using this certificate to sign server & client certificates. If the intermediate certificate is compromised, I will add it to ***Certificate Revocation List*** (CRL) and our systems will not trust it anymore.

I will create `intermediate_ca.pfx`

```
keytool -keystore intermediate.pfx \
    -storetype pkcs12 \
    -alias intermediate_ca \
    -genkeypair \
    -keyalg EC \
    -keysize 256 \
    -sigalg SHA256withECDSA \
    -validity 3650 \
    -ext BC=0
```

Explanation:

* `-ext BC=0`: indicate a CA but not Root CA.

I will create a ***sign request*** for intermediate CA and use the Root CA to sign the intermediate CA. You can read more about how PKI work to know why we should do these steps.

Create sign request.

```
keytool -keystore intermediate.pfx \
    -alias intermediate_ca \
    -certreq -file intermediate_ca.certreq
```

Use Root CA to sign the intermediate certificate.

```
keytool -keystore root_ca.pfx \
    -alias root_ca
    -gencert \
    -rfc \
    -ext BC=0 \
    -infile intermediate_ca.certreq \
    -outfile intermediate_ca.cert
```

Explanation:

* `-alias root_ca`: we will use `root_ca` to sign the intermediate certificate.
* `-gencert`: sign the certificate.
* `-rfc`: use PEM format for the signed certificate.
* `-ext BC=0`: indicate this is intermediate CA.
* `-infile intermediate_ca.certreq`: the sign request of the intermediate certificate.
* `-outfile intermediate_ca.cert`: the intermediate certificate signed by Root CA.

Import the siged certificate to `intermediate_ca.pfx` for storage. We need to import the Root CA first, because the keytool only allow us import the valid certificate. Without the Root CA in keystore, keytool will not trust our self-signed certificates.

```
# Export Root CA from root_ca.pfx.
keytool -keystore root_ca.pfx -alias root_ca -exportcert -rfc -file root_ca.cert
# Import Root CA to intermediate_ca.pfx.
keytool -keystore intermediate_ca.pfx -alias root_ca -importcert -trustcacerts -file root_ca.cert
# Import signed certificate to intermediate_ca.pfx.
keytool -keystore intermediate_ca.pfx -alias intermediate_ca -importcert -file intermediate_ca.cert
```

### Generate VPN server certificate.

I will create the VPN server certificate and store in `vpn_server.pfx`, this certificate will have important `-ext SAN=DNS:<hostname>` option.

```
keytool -keystore vpn_server.pfx \
    -storetype pkcs12 \
    -alias vpn_server \
    -genkeypair \
    -keyalg EC \
    -keysize 256 \
    -sigalg SHA256withECDSA \
    -validity 366 \
    -ext SAN=DNS:vpn.example.com
```

Explanation:

* `-validity 366`: the server certificate will have shorter valid time, to make sure I remember how to manage them.
* `-ext SAN=DNS:vpn.example.com`: the certificate is only valid when using with domain `vpn.example.com`. It's important that the Common Name also use the same value with this option.

I will repeat the previous steps:

* Sign VPN server with intermediate CA.
* Import Root CA to `vpn_server.pfx`.
* Import signed server certificate to `vpn_server.pfx`.

### Generate client certificate.

Generating the client certificate will be similar to server certificate except the option `-ext SAN=DNS:vpn.example.com` is replaced by `-ext SAN=email:user@vpn.example.com`. The `user` is used to identify individual client.

## Step 2 · Setup PKI for iked

I will put all certificates and keypair in the previous steps to iked. It requires some preparation:

* Export Root CA to `root_ca.cert`.
* Export Intermediate CA to `intermediate_ca.cert`.
* Export VPN server certificate to `vpn_server.cert`.
* Export VPN server private key to `vpn_server.key`. Use this command: `openssl pkcs12 -in vpn_server.pfx -nocerts -out vpn_server.key -nodes`

Build the `ca.crt` by combining the `root_ca.cert` and `intermediate_ca.cert`, it will look like:

```
-----BEGIN CERTIFICATE-----
<intermediate-ca>
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<root-ca>
-----END CERTIFICATE-----
```

Copy the certificates and private key to their places:

* Rename `/etc/iked/local.pub` to `/etc/iked/local.pub.original`
* Rename `/etc/iked/private/local.key` to `/etc/iked/private/local.key.original`
* Copy `ca.crt` to `/etc/iked/ca/ca.crt`
* Copy `vpn_server.cert` to `/etc/iked/certs/vpn.example.com.crt`
* Copy `vpn_server.key` to `/etc/iked/private/local.key`

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

![Apple Configurator 2 - General](image/configurator_general.png 'Apple Configurator 2 - General')

Certificates

* Root CA.
* Client certificate.

**Note**: Apple Configurator 2 only allow PKCS12 keystore.

![Apple Configurator 2 - Certificates](image/configurator_certificates.png 'Apple Configurator 2 - Certificates')

VPN

* Connection Name: Example VPN
* Connection Type: IKEv2
* Server: vpn.example.com
* Remote Identifier: vpn.example.com
* Local Identifier: user@vpn.example.com
* Machine Authentication: Certificate
* Certificate Type: ECDSA

![Apple Configurator 2 - VPN 1](image/configurator_vpn_1.png 'Apple Configurator 2 - VPN 1')

![Apple Configurator 2 - VPN 2](image/configurator_vpn_2.png 'Apple Configurator 2 - VPN 2')

## Reference:

* <https://www.going-flying.com/blog/protecting-my-macos-and-ios-devices-with-an-openbsd-vpn.html>
* <https://www.jasworks.org/openbsd-ikev2-home-vpn/>
* <https://blog.lambda.cx/posts/openbsd-vpn-gateway/>
* <https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html>

