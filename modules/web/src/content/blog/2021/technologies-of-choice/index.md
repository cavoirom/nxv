---
title: My technologies of choice
author: vinh
preview: I prioritize performance, efficiency and security when choosing hardware, software and service...
created: 2021-06-22T21:06:48.431+07:00
updated: 2021-06-22T21:06:48.431+07:00
tags: software, hardware, platform, macbook, macos, openbsd
---

This blog entry is expected to be very long. I tried to explain in detail about my choice in every piece of technology. Those are what I'm using every day.

In any technology, performance, efficiency and security are three top focus points I would like to consider. I'm willing to give up convenience, beautiful, feature rich to achieve some of those goals.

## Platform

When I talk about a platform, I mean hardware and operating system in combination to provide a base working environment.

### Macbook M1 & MacOS

* Daily working environment.
* Good development environment and tools, consistent with other Unix-like system.
* Good GUI.
* Good built-in applications.
* Security done right.
* Good cloud integration.
* The best hardware and software integration.
* Very good performance.
* The best trackpad.
* Screen, keyboard, overall design are very good.
* Long batter duration.

### VPS & OpenBSD

* Server environment.
* No GUI, just text base interface.
* Security focused.
* Good old Unix tools.
* Good built-in applications: relayd, httpd, acme-client...
* Simple to manage and upgrade.

## Daily usage

### Window Tiling · Amethyst / Yabai

* I needs these applications only for maximize the windows automatically, to focus on single task at a time.
* Amethyst: easy to use.
* Yabai: flexible, more control.

### Browser · Safari / Firefox / Chrome

* Safari: private use.
* Firefox / Chrome: development.

### Apple Notes

* Personal task management.
* Note taking.

### Apple Calendar

* Work meeting and schedule.
* Person schedule and sharing with family.

### Apple Dictionary

* Quick lookup when writing.

### Password Manager · MacPass / Enpass

* Enpass: only for my wife because it's easy to use and sync with iCloud.
* Macpass
  * KeePass format compatible.
  * Native implementation for MacOS.

## Development

### Monospace Font · Fira Code

* Monospace Font is very important because I'm looking at those character more than 8 hours/day, on terminal, text editor, IDE...
* Very nice looking font.
* Support ligature.

### Apple Terminal

* Best built-in terminal.
* Don't trust me? Read <https://danluu.com/term-latency/>
* Low latency.
* Very good GUI.
* Just work.

### Shell · zsh

* Bash compatible. Use zsh, you don't need to learn Bash at work again.
* Work very well with: key-bindings.zsh (taken from oh-my-zsh project), zsh-autosuggestions, fzf.
* Say no to plugin frameworks, they will let you down.
* The final setup give me a fast shell, auto suggestions based on history, history fuzzy search.

### SSH Agent · Sekey

* Use built-in secure enclave to generate private/public key.
* The private key will never expose to any party.
* Use Touch ID for authentication.

### Source code version control system · git

* VCS is not something I could choose, because it's based on the project I'm working on. But I choose git whenever it's possible.
* Best of its kind.
* Best when using in shell.

### Package Manager · MacPorts

* Why *MacPorts*? Why not *Homebrew*? Because I'm old. I had worked with *Portage* on Gentoo, pacman on Archlinux. I found I'm home when I'm using *MacPorts*.
* Most of command line tools are available.
* Can build application from source code.

### Simple Text Editor · vim / Sublime Text

#### vim

* When working on shell.
* Very good key bindings and features.
* Keyboard focused.
* Power user focused.
* Built-in on most Unix-like system.

#### Sublime Text

* Nice trial software.
* Native implementation for MacOS.
* Good GUI.
* Good plugins.

### IDE · IntelliJ and brothers

* Best Java IDE.
* Premium user experience.
* Good plugins.
* Good performance despite being built on Java Platform.
* Why not Visual Studio Code? No thanks, the developers behind Visual Studio Code had done a great work, but I don't prefer WebApp when it's an application which I use every day, every millisecond matter.

