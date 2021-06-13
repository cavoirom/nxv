---
title: Arch Linux - Nếu một ngày không có Windows
author: vinh
preview: Cái giả thuyết Windows ngày nào đó sẽ biến mất thật xa vời, nhưng ít ra, tôi đã không dùng nó từ 2 năm nay, công việc cũng như cá nhân.
created: 2017-05-29T00:00:00.000+07:00
updated: 2017-05-29T00:00:00.000+07:00
tags: gui, linux, privacy, unix
---

Cái giả thuyết Windows ngày nào đó sẽ biến mất thật xa vời, nhưng ít ra, tôi đã không dùng nó từ 2 năm nay, công việc cũng như cá nhân. Dù sao tôi vẫn mong mọi người cứ xài Windows bởi một lý do ích kỷ: thị trường Windows còn lớn thì hacker sẽ tập trung vào nó mà chừa Linux ra, cứ mong vậy đi, như dân làng Vũ Đại tin anh Chí có chửi chắc vẫn chừa mình ra. Nhưng đó ko hẳn là lý do tôi gắn bó với hệ điều hành Chim cụt cánh..à Cánh Cụt này. Mọi thứ bắt đầu từ ngày đẹp trời nọ..

Ngày ấy vào khoản năm 2005, lần đầu tôi nghe những tên tuổi sau này đã là huyền thoại chưa bao giờ được kể: VietKey Linux, Hacao Linux..số phận trớ trêu sao tôi chẳng thử em nào trong số đó, chắc do tâm lính sính ngoại bẩm sinh. Và tôi biết tới Gentoo, như lời quảng cáo của đàn anh trong GameVN là bản Linux chạy nhanh nhất, khó cài nhất, và sẽ rất oai nếu mày cài được, mày sẽ vỗ ngực tự đắc "tao đây đã cài Gentoo từ stage1" (bọn bạn tôi chưa bao giờ biết Gentoo là gì, đến tận giờ vẫn ko biết).

Cài Gentoo là trải nghiệm tuyệt vời (hay tồi tệ nhất) của việc cài 1 hệ điều hành..Nếu ko có cái handbook của nó thì đố mà xong được, Gentoo có cái hay (cũng là cái dở) là phải compile mọi thứ, nên tất nhiên cài xong sẽ hiểu rõ hệ thống của mình, hiểu từng configuration của từng phần mềm, nói chung để học thì hay, để dùng hàng ngày rất hại não vì mỗi lần update là mỗi lần compile vài chục tiếng, máy nóng như chảo chiên trứng..có lẽ vì thế con Laptop đầu tiên của tôi ra đi khi mang trên mình Gentoo Linux. Đó là lúc tôi nghĩ đến bài toán cân bằng giữa tính linh hoạt và sự phức tạp của hệ thống, tôi tìm ra Arch Linux.

Với một hệ điều hành sử dụng hàng ngày cần

* Miễn nhiễm với virus
* Duyệt Web
* Giao diện đơn giản, nhẹ
* Phần mềm Office
* Gõ tiếng Việt
* Dễ nâng cấp, sao lưu
* Ổn định

Trong danh sách đó, chuyện ko nhiễm Virus là không thể, dù sao Arch Linux không phải hệ điều hành phổ biến nên chuyện lây nhiễm có hạn chế đôi phần, cần nói thêm dù có cài Anti-Virus cũng không làm máy an toàn hơn là bao nên tôi ko bao giờ cài Anti-Virus trên máy mình, rất tốn tài nguyên. Trở lại lý luận ban đầu, Virus sẽ không nhắm vào môi trường ít người sử dụng vì tốc độ lây lan thấp.

Phần web browser, tôi có nhiều lựa chọn: Chromium, Opera, Firefox..tất cả đều ngon.

Giao diện là điều tôi thích nhất ở Arch Linux, không như đa số Distro cho người dùng cuối cài sẵn giao diện Gnome hoặc KDE, Arch Linux dành phần giao diện cho người dùng "lắp ráp" theo ý mình, đây là phần hấp dẫn nhất mỗi khi nhắc tới một hệ điều hành. Tôi luôn hướng tới một giao diện đơn giản, nhiều phím tắt, nhẹ, ổn định và cũng không kém phần đẹp mắt. Dưới đây là những gì tôi đã cài cho phần giao diện, cho bạn nào thích vọc:

* Display Server: X.org
* No graphical login
* Window Manager: Openbox
* Wallpaper: Nitrogen
* Taskbar: Tint2 with customize configuration
* Lock Screen: i3lock
* Launcher: Albert
* Terminal: rxvt-unicode

![Arch Linux với OpenBox và một số công cụ khác](image/my-archlinux.png 'Arch Linux với OpenBox và một số công cụ khác')

Điểm khó khăn nhất với tôi khi dùng Linux là bộ Office, Microsoft làm Office quá tốt, cũng đúng thôi, họ làm nó còn trước cả Windows mà. Tôi vẫn không vừa ý sản phẩm Office Open Source nào, nên dùng tạm Google Docs vậy.

Gõ tiếng Việt không quá khó cũng không hoàn hảo, hãy thử fcitx thay vì ibus, bạn sẽ thấy cuộc sống dễ dàng hơn. [Có một bài viết hướng dẫn tại đây](http://www.nerdyweekly.com/posts/ibus-is-dead-to-me-use-fcitx-instead-vi/).

Về khoản nâng cấp Arch Linux rất dễ, chỉ một dòng lệnh là đủ. Sao lưu cả hệ điều hành và khôi phục chỉ đơn giản là copy/paste. Sẽ ko cần Ghost hay "Phantom" gì đó như Windows đã từng.

Ổn định thì ko phải nói nhiều nhỉ, bạn đang chạy hệ điều hành thiết kế cho server rồi.

Ở bài này tôi muốn giới thiệu làm cách nào thay thế Windows bằng Linux trong cuộc sống hàng ngày, bạn sẽ không thể làm được nếu chưa có kiến thức về Linux, nhưng hy vọng tôi đã cung cấp đủ keyword để bạn bắt đầu cài hệ điều hành cho riêng mình, tôi sẽ viết về từng chủ đề trong những bài tới. Try for your privacy.

