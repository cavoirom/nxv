---
title: "Dùng bot để code bộ gõ Tiếng Việt"
author: "vinh"
preview: "Từ lâu mình đã muốn viết bộ gõ Tiếng Việt cho riêng mình nhưng không biết bắt đầu từ đâu. Nhờ có bot, mọi chuyện trở nên dễ dàng..."
created: "2026-04-19T18:34:21.634+07:00"
updated: "2026-04-20T22:28:35.180+07:00"
tags:
  - "coding-agent"
  - "macos"
  - "open-source"
  - "programming"
  - "software"
---

![Lex prototype](./image/lex-prototype.avif)

Mình bắt đầu biết gõ Tiếng Việt từ thời Windows 3.1 với bộ gõ VietKey, hồi đó
không biết ngu ngu sao đó lại chọn kiểu gõ Telex để học, và Telex trở thành hành
trang quan trọng để mình theo đuổi nghề múa phím. Thời Windows 3.1 thì để gõ
được Tiếng Việt mọi người phải dùng font VNI và ký tự có dấu thực chất là 2 ký
tự kết hợp lại, nhưng đây là điểm mạnh, font VNI hiển thị Tiếng Việt đúng gần
như mọi nơi nó được dùng. Sau đó Windows XP ra đời, Unicode bắt đầu phổ biến, và
mình cũng tập tành Yahoo! Chat. Một trong những cái hay đem ra khè bọn nhóc cùng
lứa là tao viết được Tiếng Việt...có dấu, thay vi\` phai? vie^'t nhu* the^'
nay\` :)) Lúc này Unikey là vũ khí bí mật và dần trở thành _the winner take all_
trong thế giới bộ gõ trên Windows.

Tầm 2009 mình chuyển dần qua Linux thì khoảng gõ Tiếng Việt không còn là
_problem solved_ như trước, nó không nằm ở bộ gõ, nó nằm ở _input protocol_ của
X11 không đủ tốt để xử lý gõ Tiếng Việt, cho tới giờ (2026) vẫn thế, không biết
sau này Wayland có khá hơn không? Ở Linux thì chắc
[fcitx là framework ổn nhất để gõ Tiếng Việt](https://hi.imnhan.com/fcitx/). Sau
mình chuyển qua dùng macOS thì nhận ra tình cảnh cũng không khá hơn là mấy, bằng
chứng là có rất nhiều bộ gõ cho macOS ([EVKey](https://evkeyvn.com/),
[OpenKey](https://open-key.org/),
[GoTiengViet](https://www.trankynam.com/gotv/), và gần đây mình biết thêm
[Gõkey](https://github.com/huytd/goxkey) :D) cá nhân mình thích GoTiengViet do
cách xử lý dấu của nó vừa ý mình nhất, và mình thích phong cách của tác giả này.
Cũng trong thời gian này mình có tìm hiểu đôi chút về kỹ thuật lập trình bộ gõ
Tiếng Việt, đặc biệt là 2 bài viết
[Vấn đề về IME trên Linux](https://viethung.space/blog/Van-de-ve-IME-tren-Linux/)
và
[Chuyện gõ tiếng Việt trên Linux](https://notes.huy.rocks/posts/go-tieng-viet-linux.html)
nói về khó khăn và những giải pháp (chưa hoàn chỉnh) để có thể gõ đc Tiếng Việt
trên hệ điều hành này (thật trùng hợp cả 2 người đều liên quan tới Gõkey). Đó
cũng là lúc mình có ý định phát triển một bộ gõ cho riêng mình.

Nhưng phải tới gần đây mình mới có thời gian hiện thực hóa mong muốn bấy lâu, vì
hiện tại mình có thời gian, phần vì mấy con bot mới ra làm cho việc thực hiện ý
tưởng nhanh hơn mình tự mò rồi code nhiều. Kế hoạch là dùng bot để làm ra bản
mẫu có thể dùng được rồi dành thời gian hiểu rõ những chủ đề liên quan rồi tự
viết lại bản chính thức. Trong bài viết này mình muốn ghi chú lại cách mình dùng
bot để tìm hiểu, lên ý tưởng, thiết kế và rồi hướng dẫn nó code ra bản mẫu mà
mình dùng để viết bài này. Thông tin liên quan tới việc phát triển bản mẫu mình
có lưu lại ở [Lex](https://github.com/cavoirom/lex) repository.

## Thử nghiệm

Bot (gọi sang là coding agent) có điểm mạnh là rất giỏi ở ngôn ngữ lập trình,
dùng thư viện và hiểu biết về cách lập trình tương đối tốt. Nên nếu mình có ý
tưởng nhưng không biết phải hiện thực thế nào thì dùng bot để kiểm chứng ý tưởng
rất nhanh. Do mình chưa từng viết hay đọc code của bộ gõ nào, việc đầu tiên là
hiểu cách một bộ gõ trên macOS hoạt động thế nào từ khâu tương tác với hệ điều
hành tới khâu xử lý quy luật bỏ dấu, cũng cần nói thêm mình muốn phần xử lý bỏ
dấu độc lập với phần tương tác hệ thống, gần giống với cách Gõkey sử dụng
[vi-rs](https://github.com/ZeroX-DG/vi-rs).

[Prompt](https://github.com/cavoirom/lex/blob/master/agent-threads/2026-04-08-163707__T-019d6df4-60ec-7798-a30c-d786eeb6cbe2__Vietnamese-IME-macOS-integration-points.json#L97):

> I'm going to create a minimal Vietnamese Input for macOS. I won't use the
> native framework from Apple, but will use the common technique used in
> existing Vietnamese Input.
>
> - I'm going to create the engine that decoupled from macOS.
> - I want to know what is the integration point? What kind of trigger and input
>   from macOS that the engine needs to handle, so that I can design the
>   relevant API for the engine.
>
> Consult the Oracle, but prevent the Oracle from providing any example code.
> You should not write any code.

Tất cả thảo luận với bot mình có lưu lại trên
[Lex](https://github.com/cavoirom/lex/tree/master/agent-threads) repository như
là nhật ký phát triển chương trình cũng như là nguồn tham khảo để sau này bot có
thể khai thác.

Sau vài cuộc "trò chuyện" với bot trong ngày 08/04 thì mình dần có ý tưởng:

- Chỉ hỗ trợ kiểu gõ Telex và bảng mã Unicode.
- Nhận input event thông qua _CGEventTap_.
- Dùng backspace giả thay vì pre-edit buffer để bỏ dấu, điểm này mình cũng đã
  tham khảo từ trước khi đọc bài viết của vài tác giả khác.
- Phần tương tác với hệ điều hành sẽ viết bằng Swift để được sự hỗ trợ tốt nhất.
- Phần quy luật bỏ dấu sẽ viết bằng Zig và đóng gói ở dạng 1 thư viện C, Swift
  code sẽ gọi thư viện này thông qua C ABI. Cách này cho phép tái sử dụng thư
  viện cho nhiều nền tảng khác nhau, tương tự vi-rs nhưng viết bằng Zig thay vì
  Rust.

Sau khi có ý tưởng về các thành phần sẽ tương tác với nhau thế nào, mình muốn
kiểm chứng cách làm này, yêu cầu bot viết mình chương trình cơ bản theo cấu trúc
trên, chỉ tập trung vào tích hợp từ đầu tới cuối chứ không quan tâm tiểu tiết,
quy luật bỏ dấu ban đầu, chỉ là có thể thay 1 ký tự đc nhập bằng một ký tự khác.

[Bắt đầu thảo luận với bot](https://github.com/cavoirom/lex/blob/master/agent-threads/2026-04-09-114359__T-019d720e-612a-7598-8650-96da70de43ef__Minimal-macOS-app-with-Zig-keyboard-interception.json#L264),
lúc này vẫn muôn thử là chỉ cần dùng Zig thôi có đc không:

> Discuss with me to come up with a plan to write a minimal macOS application
> with pure Zig programming.
>
> - The application is written in 1 zig file:
>   @lex/playground/minimal-app/minimal.zig
> - Create a shell app in @lex/playground/minimal-app/macos/Minimal.app so that
>   we can copy binary to this app to form a complete application and can do the
>   signing.
> - Interoperate with macOS native framework via C API.
> - Zig will be the entrypoint of the application and call macOS native
>   framework.
> - We will need Accessibility entitlement to work on our functionality.
> - The application won't have any UI, except an icon on menubar. When clicking
>   on the icon, a menu will be displayed with only "Exit" option to quit the
>   application.
> - Consult official documentation: Zig langugage, macOS frameworks...
>
> What the application will do:
>
> - The application will use `CGEventTap` to intercept keyboard event.
> - When the application see the character `a` in the event, replace it with
>   `Ä`. Passthrough other characters.
>
> Come up with the approach, then consult the Oracle for another perspective,
> but prevent the Oracle from producing any example code. You should not write
> any code.

Sau một hồi trao đổi thì thấy để Zig gọi qua Objctive-C framework của macOS quá
phức tạp, nên về với ý tưởng ban đầu dùng Swift:

> Compare this approach with the approach:
>
> - Instead of pure Zig. We only keep the core handling of replacing `a` with
>   `Ä` in Zig as a small C-library.
> - Everything else from application entrypoint to tap the event and call Zig
>   library will use Swift.
> - Could we remove the entitlement completely.

Và đây là (một phần) trả lời từ con bot:

> My Recommendation
>
> **Approach B (Swift + Zig lib) is clearly better** for this project. The
> pure-Zig approach fights macOS at every turn — 90% of the code would be ObjC
> runtime plumbing, not actual functionality. Swift gives you native AppKit,
> CGEventTap, and run loop support for free. The Zig part stays focused on the
> one thing that justifies using Zig: the character transformation logic.
>
> Mitchell Hashimoto (Ghostty) uses exactly this pattern — 93% Zig business
> logic, 4% Swift GUI — and explicitly advises against the pure ObjC-runtime
> approach.
>
> Want to proceed with Approach B?

Sau vài "cuộc trò chuyện" nữa thì bot nó viết ra
[Minimal.app](https://github.com/cavoirom/lex/tree/master/playground/minimal-app)
chạy được và hiện thực được yêu cầu đơn giản phía trên. Tới lúc này mình xác
nhận một số điểm:

- Viết 1 macOS app nhỏ chỉ hiển thị trên thanh Menu.
- Yêu cầu quyền Accessibility để truy cập CGEventTap.
- Thông qua CGEventTap để tương tác và chỉnh sửa CGEvents.
- Viết thư viện bằng Zig và gọi thư viện này trên Swift.
- Tự động hóa quá trình build bằng Zig.

Code con bot viết chắc chắn tệ, nhưng đó sẽ là nguồn tham khảo cần thiết để mình
định huóng quá trình tìm hiểu. Xong phần thử nghiệm mình sẽ đi vô một số chi
tiết chính, việc tiếp theo là xác định cấu trúc thư mục để viết cái app này thế
nào.

## Cấu trúc thư mục

Do mình đã định hướng trước sẽ lấy ý tưởng từ
[Ghostty](https://github.com/ghostty-org/ghostty), vì mình chọn dùng Zig làm thư
viện dùng chung và ở từng nền tảng sẽ viết code tích hợp riêng, mình chuẩn bị
trước một số thư mục và file rồi hỏi con bot:

> Explore the directory structure in @playground/structure-app
>
> This structure is intended to do 2 thing:
>
> - Store a shared library for our input method engine:
>   @playground/structure-app/src
> - Store resource for integration and bundle the app in multiple platform,
>   currently only support macos: @playground/structure-app/macos
>
> Discuss with me the appropriate name for:
>
> - the name of the shared library, our application name is `lex`, we develop
>   the library in Zig and expose its API to the integration layer via C ABI.
> - the filename of the shared library.
> - the filename of the macos application.
> - I intended to have 1 file for app (Swift) and 1 file for shared library
>   (Zig).

Kết quả ra được cấu trúc thư mục thế này, rất trực quan:

```
structure-app/
├── src/
│   ├── liblex.zig          ← Zig library (was lib/minimal.zig)
│   └── liblex.h            ← C bridging header (was include/bridging-header.h)
├── macos/
│   ├── Lex.app/
│   │   └── Contents/
│   │       └── Info.plist   ← app bundle metadata
│   ├── Lex.swift            ← Swift app (was app/main.swift)
│   └── entitlements.plist   ← macOS entitlements
├── build.zig
└── build.zig.zon
```

Mình tiếp tục yêu cầu bot lấy code từ Minimal.app qua Structure.app để xem app
mới có build và chạy đc ko:

> take the source from @playground/minimal-app to new structure
> @playground/structure-app
>
> our goal is to build and run the app successfully in new structure

Kết quả mình có
[Structure.app](https://github.com/cavoirom/lex/tree/master/playground/structure-app)
hoạt động tương tự Minimal.app.

## Cấu trúc dữ liệu và quy luật bỏ dấu

Phần cấu trúc chương trình cũng như cách tương tác giữa các thành phần đã rõ,
mình tập trung vào phần thư viện, mình cần quyết định thư viện nên hoạt động thế
nào, cấu trúc dữ liệu là gì và những quy luật bỏ dấu do mình đặt ra (do mình
muốn kiểu gõ Telex chỉ hoạt động theo một số cách nhất định theo ý mình). Đây là
một số yêu cầu chính:

- Thư viện Zig sẽ không allocate memory, phía gọi thư viện sẽ phải allocate
  memory, thư viện chỉ hoạt động trên vùng nhớ đc cung cấp trước. Điều này giúp
  đơn giản hóa việc quản lý bộ nhớ ở Zig code.
- Thư viện chỉ quan tâm việc bỏ dấu, những phần liên quan tới xử lý event sẽ
  thuộc về app.
- Bỏ dấu kiểu cũ ở vần `òa`, `úy`, ví dụ: `hòa`, `thúy`. Cách bỏ dấu này tạo ra
  chữ nhìn hài hòa hơn.
- Gõ `w` sẽ là `w`, không phải `ư`.
- Nếu từ bắt đầu bằng phụ âm không có trong Tiếng Việt (ví dụ: `w`, `f`, `z`)
  thì sẽ không bỏ dấu cho từ đó.

Phần này mình thảo luận với bot nhiều, có thể tham khảo thêm ở thư mục
[agent-threads](https://github.com/cavoirom/lex/tree/master/agent-threads). Kết
qua là cấu trúc dữ liệu thế này:

- Span: mỗi Span đại diện cho 1 ký tự Tiếng Việt, với đầy đủ dấu.
  - base: chứa ký tự alphabet được nhập từ bàn phím.
  - modifier: chứa dấu của ký tự, ví dụ `w` đại diện cho dấu `ă`...
  - tone: chứa dấu thanh `s` (sắc), `f` (huyền), `r` (hỏi),
  - is_literal: true / false. Quy định ký tự này có đc phép bỏ dấu hay không.
    Khi `is_literal = true` thì những Span sau đó cũng như thế, việc bỏ dấu sẽ
    bị tắt.
- State
  - spans: một chuỗi Span đại diện cho 1 từ đang gõ. Thư viện sẽ chỉnh sử chuỗi
    này để bỏ dấu cho nguyên âm, và dấu thanh.

## Chương trình mẫu

Về phần app mình cũng yêu cầu một số chức năng:

- Chỉ có biểu tượng trên thanh Menu.
- Có thể bật tắt bằng phím tắt `Ctrl + Opt + Space`.
- Khi bật tắt có âm thanh báo hiệu.

Cùng với cấu trúc dữ liệu và quy luật bỏ dấu đã được thảo luận, mình yêu cầu bot
viết chương trình mẫu:

> Discuss with me to create the prototype app of Vietnamese Telex Input Engine
> at @playground/prototype-app
>
> - The directory and application structure inspired by
>   @playground/structure-app
> - The Zig enigne defined by @T-019d847f-368d-7711-9e88-6fa0135798a3
>   @T-019d7ae3-ca0e-758b-a9c9-55c4872e9c57
>   @T-019d777e-677c-726a-af7a-64166a8b55c7
> - Swift will allocate memory for the state, and input to Zig functions.
> - Swift should store the current state and next state, so that it could count
>   how many backspace is needed.
> - Swift should know which character it should replace after backspaces, based
>   on the different between current state and next state.
>
> Am I missing something?
>
> Come up with the approach, then consult the Oracle for another perspective,
> but prevent the Oracle from producing any example code. You should not write
> any code.

Sau một số buổi thảo luận, hướng dẫn thì bot nó code đc
[Lex.app prototype](https://github.com/cavoirom/lex/tree/master/playground/prototype-app)
đủ để mình có thể viết được bài này. Kể ra chi tiết thì dài, bạn có thể dùng bot
để nó đọc thư mục
[agent-threads](https://github.com/cavoirom/lex/tree/master/agent-threads) rồi
tóm tắt lại cách mình đã làm.

Có một kinh nghiệm thú vị là mình đọc nhật ký phát triển Gõkey thì thấy có 1
[bug](https://notes.huy.rocks/posts/devlog-gokey-week-02.html) mà mình đoán là
bộ gõ của mình cũng bị, nên mình kêu bot kiểm tra:

> In this article: https://notes.huy.rocks/posts/devlog-gokey-week-02.html (in
> Vietnamese), the author describe a bug that cause the synthetic events arrive
> out of order. Then the made the fix in Rust (use the Librarian to explore it):
> https://github.com/huytd/goxkey/commit/3022e3086401423eb48ce3e461af71e543defb8b
>
> Analyze our Swift code @macos/Lex.swift to see if it suffers the same issue or
> not?
>
> Come up with the approach, then consult the Oracle for another perspective,
> but prevent the Oracle from producing any example code. You should not write
> any code.

Và con bot fix trong một nốt nhạc. Chi tiết có thể thấy ở
[commit này](https://github.com/cavoirom/lex/commit/9039ced8dc2f1326d9c44128495c184f2d1fb4b5).

Một số thông tin thú vị về Prototype.app:

- Swift: 275 loc.
- Zig: 510 loc.
- Bundle size: 119 KiB.

Tới đây mình đã có một bộ gõ bot trồng, việc tiếp theo là hiểu rõ từng chi tiết
kỹ thuật để tự viết bộ gõ nhà trồng :D.

P/S: lúc viết bài này mình có thử tìm lại thông tin của VietKey thì thấy
`vietkey.com.vn` cho tải VietKey, còn `vietkey.vn` thì cho tải...Unikey :)) nhìn
rất là...shady.

P/SS: đừng ai hỏi mình chi phí dùng bot, vì mình dùng free plan của
[AmpCode](https://ampcode.com/). Bài viết này KHÔNG đc AmpCode tài trợ, nhưng mà
mình dùng free plan của AmpCode XD.
