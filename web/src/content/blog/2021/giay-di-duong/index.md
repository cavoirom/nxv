---
title: Giấy Đi Đường
author: vinh
preview: Thử ứng dụng Công nghệ Thông tin vào thời sự.
created: 2021-08-25T22:12:43.633+07:00
updated: 2021-08-25T22:12:43.633+07:00
tags: life, saigon, covid-19
---

*Nhân dịp đọc bài viết trên báo VNExpress: [https://vnexpress.net/doanh-nghiep-gap-kho-voi-giay-di-duong-moi-4345490.html (archived)](https://web.archive.org/web/20210824111614/https://vnexpress.net/doanh-nghiep-gap-kho-voi-giay-di-duong-moi-4345490.html)*

Mình làm Kỹ sư Phần mềm được hơn 7 năm. Vấn đề giấy đi đường giống với vấn đề cấp quyền (authorization) cho người dùng truy cập vào phần mềm mà ai làm công nghệ phần mềm điều biết.

**Yêu cầu của hệ thống Giấy đi đường theo mình hiểu sẽ như vầy:**

* Chỉ được cấp bởi cơ quan có thẩm quyền.
* Mỗi giấy cấp cho 1 người duy nhất với họ tên, thời gian hiệu lực, phạm vi di chuyển, mục đích...
* Giấy phải dễ dàng xác minh là thật hay giả, dễ dàng kiểm tra đúng người, đúng địa điểm, đúng mục đích...
* Mỗi lần kiểm tra phải nhanh chóng, tránh ùn tắc.

**Vấn đề cần giải quyết:**

* Giấy giả.
* Cho mượn giấy.
* Dùng sai phạm vi di chuyển (giấy cấp cho đi ở Quận 1 nhưng đi Bình Chánh).
* Dùng giấy hết hạn.
* Nếu dùng nhân lực để kiểm tra thì sau vài trăm lượt kiểm, ngưi kiểm soát sẽ không đủ tỉnh táo để kiếm tra kỹ tất cả tiêu chí kể trên.

Nếu dùng Công nghệ Thông tin để giải quyết thì đây là bài toán cấp quyền mà ai cũng quen và biết làm.

**Hệ thống cấp giấy đi đường:**

* Hệ thống này tương đương với Identity Server (Máy chủ chứa thông tin chứng thực người dùng).
* Ví dụ cụ thể là Keycloak, phần mềm này dễ dàng cài đặt và có thể mở rộng để chịu tải nhiều ngàn lượt truy cập cùng lúc.
* Máy chủ sẽ được quản lý bởi cơ quan có thẩm quyền.
* Các doanh nghiệp cần giấy đi đường sẽ gởi danh sách người cần, cơ quan chức năng sẽ tạo tài khoản cho từng người rồi gởi thông tin đăng nhập theo E-mail hoặc niêm phong như cách làm của ngân hàng khi gởi mã bảo mật qua bưu điện.
* Phát triển nhanh 1 Mobile App / Web App để người dùng đăng nhập vô Keycloak lấy về QR Code. QR Code thực chất là 1 JWT (Keycloak hỗ trợ sẵn, ko cần làm gì thêm), được chứng thực điện tử nên nội dung không thể chỉnh sửa (theo cơ chế Public Key), nếu sửa rất dễ phát hiện. Nội dung QR Code sẽ là:
  - Họ tên người đi đường.
  - Phạm vi di chuyển.
  - Mục đích...
  - Thời gian hiệu lực, cái này quan trọng, tránh trường hợp tài khoản người này bị thu hồi mà QR Code vẫn còn hiệu lực. Thời gian hiệu lực của QR Code nên là 2-3 ngày tới 1 tuần.

**Hệ thống kiểm tra:**

* Phát triển Mobile App để đọc QR Code và xác thực thôn tin trên QR Code. App này nếu làm bằng Flutter thì chỉ mất ít hơn 1 tuần cho cả 2 nền tảng Android / iOS.
* Do "Giấy đi đường" có dùng chữ ký điện tử theo cơ chế Public Key, App chỉ cần tải Public Key (khóa công khai) từ máy chủ của cơ quan chức năng 1 lần trong ngày (máy chủ có cơ chế thay đổi Public Key mỗi ngày để tăng tính bảo mật) là có thể kiểm tra giấy đi đường mà không cần kết nối Internet.
* App sẽ đọc QR Code rồi hiển thị thông tin lên điện thoại của người kiểm soát, người đi đường phải xuất trình giấy tờ khớp với họ tên trên giấy đi đường.
* Hạn sử dụng App có thể kiểm tra tự động.
* Phạm vi di chuyển có thể kiểm tra tự động. Ví dụ trong giấy ghi phạm vi là Quận 1, trong khi chốt kiểm tra đang ở Quận Thủ Đức thì App dễ dàng phát hiện (có thể cài đặt địa điểm của chốt trên App của người kiểm soát).

**Ưu điểm:**

* Không thể làm giả giấy đi đường do tài khoản được cơ quan chức năng kiểm soát và tập trung 1 chỗ.
* Việc cấp tải khoản diễn ra 1 lần, dễ dàng xác thực, dễ dàng thu hồi, dễ dàng truy vết sai phạm.
* Giấy đi đường được cấp tự động thông qua hệ thống.
* Việc kiểm tra giấy đi đường không cần kết nối Internet. Rất tiện cho mọi khu vực, App kiểm tra giấy đi đường không cần quyền gì đặc biệt từ hệ thống, tăng tính bảo mật.
* Hạn chế tiếp xúc, người kiểm soát và người đi đường không cần tiếp xúc vẫn kiểm tra đc. Nếu dùng "giấy thật" thì rất có thể phải cầm lên coi mới biết giấy thật hay giả.
* Có thể mở rộng dễ dàng mà không tốn nhiều chi phí. Hệ thống chỉ cần máy chủ trung tâm được bảo trì tốt, còn lại coi như không tốn gì khác.

Mấy giải pháp này không mới, hy vọng nhà nước tận dụng để tăng hiệu quả công việc.

