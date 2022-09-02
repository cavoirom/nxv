---
title: Managing SSH keys with Sekey and Touch ID
author: vinh
preview: I have been using Sekey for more than 4 years
created: 2022-09-02T21:22:27.599+07:00
updated: 2022-09-02T21:22:27.599+07:00
tags: macos, ssh, sekey, git, github
---

I have been using _**Sekey**_ for more than 4 years, I could say the experience
is better than using SSH private key with passphrase. Sekey will ask for Touch
ID authentication every time I use the private key, it serves great as a second
factor when I work with SSH and git. For example: Everytime I push a commit,
Sekey will ask for permission, no script could silently modify git repository
without notice.

Sekey will generate and store SSH keys in Secure Enclave and will not expose
private key. The public key could be export to transfer to remote host, the
Touch ID will be used to authenticate SSH connection instead of private key and
passphrase.

When I first used Sekey, I was confused because Sekey didn't let me see my
private keys, they were stored in Secure Enclave. But it is a feature, we will
not worry of leaking these privated keys.

## Installation

<https://github.com/sekey/sekey#install>

## Authenticating 2 Github accounts

The problem with 2 Github accounts is they are using the same username and
hostname for SSH connection. We need a way to distinguish betwenn accounts.

We will use _**git**_ config to make the hostname of those accounts look
different. Then we will config _**SSH**_ sending identity to remote host.

### Export public keys for SSH config

```bash
sekey --export-key <key-id-1> > ~/.ssh/key_1.pub
sekey --export-key <key-id-2> > ~/.ssh/key_2.pub
```

### `$HOME/.gitconfig`

```
[url "git@github.com-account-1:account-1/"]
    insteadOf = git@github.com:account-1/

[url "git@github.com-account-2:account-2/"]
    insteadOf = git@github.com:account-2/
```

### `$HOME/.ssh/config`

```
Host github.com-account-1
    IdentityFile ~/.ssh/key_1.pub
    IdentitiesOnly yes

Host github.com-account-2
    IdentityFile ~/.ssh/key_2.pub
    IdentitiesOnly yes
```

## Too many failed attempts

When I was using Macbook Pro 2017, the Touch ID was not so accurate, I got many
failed scans because my finger was getting wet. In such case, the Touch ID may
locked. I need to lock the computer and use password or Touch ID to unlock, the
Touch ID will happily work again with Sekey.
