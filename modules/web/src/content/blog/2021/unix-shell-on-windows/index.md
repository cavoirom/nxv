---
title: Setup Unix Shell on Windows
author: vinh
preview: I used Cygwin, zsh, oh-my-zsh to have better Shell in Windows.
created: 2021-06-13T12:21:47.525+07:00
updated: 2021-06-13T15:44:13.219+07:00
tags: shell, unix, windows, cygwin, zsh, oh-my-zsh, development, java, nodejs
---

## The Commandline Environment

I see new developers are usually struggling with Commandline just because they are using Windows, it makes them distance from the community who are using Linux and Unix-like systems, and end up with tutorials which is not working on Windows because it included Linux command or Bash script.

For a Unix shell on Windows, we have plenty options: Git Bash, WSL, WSL2, MinGW. But I found them incomplete and un-natural to work with (sorry I don't want to go more detail about their issues, you could find them on the internet).

In this *entry*, let's try a more classical way: [Cygwin](https://cygwin.com/install.html).

**It's about the environment, not the tools ·** Cygwin tries to provide the POSIX-compliant development and run-time environment [\[1\]](https://en.wikipedia.org/wiki/POSIX#POSIX_for_Microsoft_Windows) while retains the speed of native Windows application. The POSIX-compliant is what make it feel the same with other Unix-like environment. It also comes with trade off: every program runs on Cygwin must be compiled for Cygwin. Thankfully, most of common commandline tools supported Cygwin.

**The Terminal ·** When working with commandline, Terminal is the entry point for everything. Most of Windows users don't have nice memories with Terminal just because of cmd.exe. Cygwin bundled with Mintty which is very good. Read more about how a slow Terminal could affect your working experience: <https://danluu.com/term-latency/>

![Mintty screenshot from official home page](image/mintty.png 'Mintty screenshot from official home page')

**Shell ·** If the Terminal provides the nice interface to interact with the system, the Shell provides API and tools to command the system. The natural choice is Bash, I recommend zsh because it's Bash-compliant with nicer features such as auto-completion, you also want to install oh-my-zsh to enhance your experience. 

**Package Manager ·** The package manager in Cygwin is minimal and easy to use, its interface is not super nice but I found it's useful and straightforward.

## Installation

**Step 1 ·** Install Cygwin and essential packages:

* Download Cygwin 64-bit installer: <https://cygwin.com/install.html>
* Run command to setup Cygwin without Administrator permission: `setup-x86_64.exe --no-admin`
* Choose directory for Cygwin installation and packages.
* Choose a mirror to download packages. Linux users are familiar with mirrors for packages, technically, it's a file server hosting Cygwin packages voluntarily.
* Select essential packages:
  * zsh: a nice Shell replacement for Bash.
  * git: who don't need git today?
* After finished the installation, don't delete the Cygwin installer, you will need it to install new package.

**Step 2 ·** Configure zsh and Mintty:

* Choose zsh as default Shell for Mintty.
* Install [Fira Code](https://github.com/tonsky/FiraCode) font and use it as default in Mintty. This is a nice font for coding in general, it supported [ligatures](https://en.wikipedia.org/wiki/Ligature_(writing)).

**Step 3 ·** Configure oh-my-zsh, plugins and themes. The [installation guideline](https://ohmyz.sh/#install) in oh-my-zsh home page is applicable for Cygwin. I only need to add plugins: git, [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) and the theme [classyTouch](https://github.com/yarisgutierrez/classyTouch_oh-my-zsh).

**Step 4 ·** Git. The only important note is using Git from Cygwin package manager. Git will not work properly if you use the offical Git for Windows package because Git depends on Cygwin API to work with POSIX environment.

## Java

The easiest way to manage many JDK version is using the zip package:

* Download JDK from: <https://adoptopenjdk.net/releases.html>
* Add `JAVA_HOME` environment variable to `~/.zshrc`: `export JAVA_HOME=/cygdrive/d/devtool/jdk-11`
* Add JDK binaries to `PATH`: `export PATH=$PATH:$JAVA_HOME/bin`
* Restart Mintty. Note that this configuration only affects to Cygwin environment.

## Node.js

Node.js also provides zip package, the installation is similar to Java, and you can manage many versions without problem:

* Download 64-bit zip binary: <https://nodejs.org/en/download/>
* Add Node.js binaries (node, npm..) to `PATH` in `~/.zshrc`: `export PATH=$PATH:/cygdrive/d/devtool/node-v14`
* Restart Mintty. Note that this configuration only affects to Cygwin environment.

## Final Thought

The goal of this *entry* is setting a consistent environment between Windows, MacOS, Linux and other Unix-like systems. When you have the same POSIX-compliant environment and use the same tools, you will get better support from the community and your colleagues. You can write a Bash script on your Windows machine that could run successfully on Linux server, you can receive a script from 20 years Unix experience guy and run without error on your machine, that is a big win for both.

