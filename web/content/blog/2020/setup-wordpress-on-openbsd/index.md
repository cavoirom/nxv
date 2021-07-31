---
title: Setup Wordpress on OpenBSD
author: vinh
preview: I setup Wordpress using httpd, PHP and MariaDB on OpenBSD
created: 2020-12-21T10:02:20.378+07:00
updated: 2020-12-21T10:02:20.378+07:00
tags: self-hosted, openbsd, httpd, wordpress, mysql, mariadb, php
---

Refer: <https://www.bsdhowto.ch/wordpress.html>

## httpd

```
```

## PHP

### Install PHP

`doas pkg_add -i php-mysqli php-curl php-zip`

Could not install php-gd and pecl74-imagick because x11 is missing.

Select PHP version: 7.4.15

## MariaDB

`doas pkg_add -i mariadb-server`

```
CREATE DATABASE dendongphuong;
CREATE USER 'dendongphuong'@'localhost' IDENTIFIED BY '<password>';
```

## Wordpress
