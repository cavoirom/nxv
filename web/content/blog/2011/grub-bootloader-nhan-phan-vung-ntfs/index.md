---
title: Grub bootloader nhận phân vùng NTFS
author: vinh
preview: "Lỗi: Filesystem Type Unknown, Partition Type 0x7"
created: 2011-09-23T00:00:00.000+07:00
updated: 2011-09-23T00:00:00.000+07:00
tags: linux, grub
---

Lỗi: Filesystem Type Unknown, Partition Type 0x7

Lỗi này thường xảy ra trên hệ thống dual boot Linux/Windows, cụ thể trường hợp
tui gặp là Windows XP. Bình thường chạy tốt, bỗng 1 ngày đẹp trời không vào
được. Tui cài Windows XP trên phân vùng Extended.

Phân vùng

```
sda1: boot
sda2: swap
sda3: gentoo
sda4: Extended
sda5: windows
...
```

Boot Entry

```
title Windows XP Professional
root (hd0,4)
chainloader +1
```

Tui hong hiểu và cũng hong biết sửa thế nào! Nên đành cài Windows XP trên phân
vùng primary. Chậc.
