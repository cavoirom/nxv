---
title: Tạo Dynamic Web Project (Eclipse 3.5) từ source-code có sẵn.
author: vinh
preview: Vì vài lý do tui sao lưu source-code và xóa meta-data của Eclipse Project, hậu quả hôm nay import lại project phát hiện không thể convert từ Java Project sang Dynamic Web Project.
created: 2011-10-08T00:00:00.000+07:00
updated: 2011-10-08T00:00:00.000+07:00
tags: eclipse
---

Vì vài lý do tui sao lưu *source-code* và xóa *meta-data* của Eclipse Project, hậu quả hôm nay *import* lại *project* phát hiện không thể *convert* từ Java Project sang Dynamic Web Project.

Chuyện cũng không lớn lắm

* Trước hết bạn tạo *project* mới trùng với tên *project* muốn *import* (ví dụ: Example).
* Mở trình quản lý tập tin bạn thường dùng, chuyển tới thư mục chứa *project* mới tạo. *Copy* thư mục .settings, tập tin .classpath và .project vào thư mục chứa project của bạn.
* Xóa project bạn vừa tạo.
* Vào Eclipse chọn File > Import.. > Existing Projects into Workspace, chọn Next.
* Tại mục Select root directory, chọn thư mục chứa project của bạn.
* *Project* của bạn sẽ hiện ra tại mục Projects, *check* vào nó và chọn Finish.

