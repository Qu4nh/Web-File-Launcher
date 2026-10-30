# Web File Launcher

Tự mở file, chương trình hoặc thư mục trên máy khi bạn truy cập một website đã chọn.

Ví dụ: mở **coding.uet.edu.vn** → tự chạy **python_server.exe** của bạn. Mọi thao tác quản lý nằm trong popup nhỏ khi bấm biểu tượng tiện ích.

**Tác giả:** qu4nh · **Phiên bản:** 2.1.0 · **Trình duyệt:** Chrome, Microsoft Edge · **Hệ điều hành:** Windows 10/11

> **Trước khi cài:** nhấp đúp **`install.cmd` một lần** để kết nối tiện ích với Windows. File này gọi `install.ps1` và giữ cửa sổ mở để bạn đọc kết quả. File `WebFileLauncher.Host.exe` chưa có chức năng tự cài khi nhấp đúp và chưa có chữ ký số tin cậy. Nếu Smart App Control chặn cầu nối, tiện ích chưa thể mở file trên máy đó. Xem phần xử lý lỗi bên dưới.

## 1. Tải và giải nén

1. Trên trang GitHub này, bấm **Code → Download ZIP**.
2. Giải nén toàn bộ ZIP vào nơi bạn muốn giữ lâu dài.
3. Mở thư mục chứa `README.md`, `extension` và `native-host`.

Không chạy trực tiếp trong ZIP. Giữ nguyên vị trí thư mục sau khi cài; không cần di chuyển hay chép file mục tiêu vào thư mục tiện ích.

## 2. Kết nối với Windows — chỉ làm một lần

Tiện ích cần một chương trình nhỏ gọi là **cầu nối** để mở file trên máy. Bước này đăng ký cầu nối cho **cả Chrome và Edge**, không cần quyền quản trị.

1. Trong File Explorer, mở thư mục chứa `README.md`.
2. Nhấp đúp **`install.cmd`**. Cửa sổ cài đặt sẽ giữ nguyên sau khi chạy.
3. Khi thấy **Registered for Chrome and Edge** và **Installation completed**, chuyển sang bước 3 bên dưới.
4. Nếu thấy lỗi, giữ cửa sổ đó để chụp hoặc chép nguyên thông báo. Nhật ký nằm ở `%TEMP%\WebFileLauncher-install.log`. Nhấn phím bất kỳ khi muốn đóng.

Nếu `install.cmd` cũng bị Windows chặn, mở PowerShell từ thư mục này bằng cách gõ `powershell` vào thanh địa chỉ File Explorer, rồi chạy:

```powershell
.\native-host\install.ps1
```

Cửa sổ PowerShell mở sẵn sẽ không tự đóng khi script lỗi. Đây vẫn là cùng script cài đặt, tuân theo chính sách Windows hiện tại.

Sau bước này, bạn không cần mở PowerShell mỗi lần sử dụng. Script tạo file cấu hình `native-host/host.json` theo đường dẫn trên máy bạn; không gửi file đó cho người khác.

Nếu Windows báo chặn script hoặc chương trình, xem **Khi gặp lỗi**. Đăng ký thành công chưa bảo đảm Windows cho phép cầu nối chạy.

## 3. Thêm tiện ích vào trình duyệt

| Bạn dùng | Nhập vào thanh địa chỉ |
| --- | --- |
| Google Chrome | `chrome://extensions` |
| Microsoft Edge | `edge://extensions` |

1. Mở trang quản lý tiện ích tương ứng trong bảng trên.
2. Bật **Developer mode / Chế độ nhà phát triển**.
3. Bấm **Load unpacked / Tải tiện ích đã giải nén**.
4. Chọn thư mục **extension** trong gói vừa giải nén.
5. Bấm biểu tượng mảnh ghép trên thanh công cụ, tìm **Web File Launcher** rồi ghim/hiển thị tiện ích nếu muốn.

Dùng cả hai trình duyệt hoặc nhiều hồ sơ? Lặp lại bước 3 trong từng trình duyệt/hồ sơ muốn dùng. Tiện ích không tự mở tab cấu hình riêng.

## 4. Chọn website và file cần mở

1. Bấm biểu tượng **Web File Launcher** để mở popup.
2. Kiểm tra dòng **Đã kết nối**. Có thể bấm nút **↻** để kiểm tra lại.
3. Chọn **＋ Thêm mới**.
4. Nhập tên dễ nhớ, ví dụ **Python Server cho UET**.
5. Nhập website, ví dụ `https://coding.uet.edu.vn/`. Nút **Trang này** lấy địa chỉ website đang mở.
6. Chọn **File / chương trình** hoặc **Thư mục**, rồi bấm **Chọn file và lưu**.
7. Chọn file hoặc thư mục thật trên máy trong hộp thoại Windows.
8. Mở hoặc tải lại website để thử. Bạn cũng có thể bấm **Mở thử** trong mục **Quy tắc**.

**Popup có thể đóng khi bạn chuyển sang hộp chọn Windows.** Chọn xong rồi bấm lại biểu tượng tiện ích; kết quả vẫn được lưu bởi phần chạy nền.

## Sử dụng hằng ngày

Chỉ cần mở website đã cấu hình. Các mục trong popup:

| Mục | Bạn có thể làm gì? |
| --- | --- |
| **Quy tắc** | Bật/tắt, mở thử, chọn lại file hoặc xóa một quy tắc. |
| **＋ Thêm mới** | Kết nối một website với file/thư mục khác. |
| **Hoạt động** | Xem 30 hoạt động tự mở gần nhất và xóa nhật ký. |

- Một quy tắc áp dụng cho website đó và mọi trang con. Ví dụ, nhập `https://coding.uet.edu.vn/problem/1` vẫn áp dụng cho toàn bộ `https://coding.uet.edu.vn`.
- HTTP, HTTPS, tên miền phụ và cổng khác nhau được coi là các website khác nhau.
- Có thời gian chờ **15 giây** giữa các lần mở cùng quy tắc. Tùy chọn tránh mở trùng áp dụng cho chương trình `.exe` đang chạy từ cùng đường dẫn; tài liệu/thư mục chỉ áp dụng thời gian chờ.
- Nếu bạn đóng chương trình trong lúc vẫn ở website, hãy tải lại trang hoặc bấm **Mở thử** để mở lại.
- Đóng website không tự đóng chương trình đã mở. File tài liệu dùng ứng dụng mặc định của Windows; không hỗ trợ đối số dòng lệnh.
- Các hồ sơ trình duyệt dùng chung quy tắc của cầu nối Windows. Mở lại popup để đồng bộ sau khi thay đổi ở hồ sơ khác.

## Khi gặp lỗi

### Popup báo chưa kết nối

Kiểm tra đã giải nén toàn bộ gói, chạy thành công bước 2 và giữ nguyên vị trí thư mục. Sau đó bấm **↻** trong popup. Nếu đã di chuyển thư mục, chạy lại `install.ps1` từ vị trí mới và nạp lại thư mục `extension` trong trình duyệt.

### PowerShell báo không cho chạy script

Máy có thể đang áp dụng chính sách hạn chế script. `install.cmd` cũng dùng PowerShell và không loại bỏ giới hạn này. Bản hiện tại chưa có bộ cài không dùng PowerShell. Nếu không được phép chạy, cần bản cài được tổ chức cho phép hoặc hỗ trợ từ quản trị viên; hướng dẫn này không yêu cầu tắt chính sách hay chạy lệnh bypass.

### Smart App Control / Application Control chặn

Cầu nối đi kèm **chưa được ký số tin cậy** nên có thể bị Windows chặn. Đổi sang extension hoặc đăng ký lại không tự giải quyết việc này. Cần bản cầu nối được ký phù hợp và được Windows cho phép; máy do tổ chức quản lý cần làm theo chính sách của quản trị viên.

Không tắt Smart App Control để chạy gói này. Chương trình/file bạn muốn mở cũng được Windows kiểm tra độc lập.

### Có kết nối nhưng file không mở

- Bấm **Mở thử** để đọc thông báo cụ thể.
- Kiểm tra file còn ở vị trí cũ; dùng **Chọn lại** nếu file đã đổi chỗ.
- Thử mở trực tiếp file đó trong Windows để kiểm tra ứng dụng/phụ thuộc cần thiết.
- Nếu vừa mở gần đây, chờ đủ 15 giây rồi thử lại.
- Windows cần **.NET Framework 4.6 trở lên** để chạy cầu nối.

## Cập nhật và gỡ bỏ

**Cập nhật:** đóng hộp chọn file đang mở, giải nén bản mới vào vị trí cố định, chạy lại bước 2 nếu đường dẫn cầu nối thay đổi, rồi bấm **Reload / Tải lại** của tiện ích ở `chrome://extensions` hoặc `edge://extensions`.

**Dừng sử dụng:** xóa **Web File Launcher** ở trang quản lý tiện ích của từng trình duyệt. Đăng ký cầu nối còn lại không tự chạy chương trình; file/chương trình mục tiêu được giữ nguyên.

Nếu muốn dọn sạch, có thể xóa thư mục đã giải nén và dữ liệu quy tắc ở `%LOCALAPPDATA%\WebFileLauncher`. Người có kinh nghiệm hoặc quản trị viên có thể xóa riêng khóa `io.github.web_file_launcher` do gói này tạo tại hai vị trí sau, không xóa các khóa của tiện ích khác:

```text
HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts
HKEY_CURRENT_USER\Software\Microsoft\Edge\NativeMessagingHosts
```

## Dữ liệu và trạng thái bản phát hành

Quy tắc lưu tại `%LOCALAPPDATA%\WebFileLauncher\rules.json`. Cache, bản nháp và nhật ký lưu trong hồ sơ trình duyệt; tiện ích không gửi chúng tới máy chủ trung gian. Mỗi người tự chọn file và đăng ký cầu nối trên máy mình.

UI và logic JavaScript đã qua kiểm thử bằng API giả lập. **Chưa xác nhận toàn bộ luồng chọn/mở file với cầu nối thật** do Application Control trên máy đóng gói. Đây chưa phải bản phát hành đã ký số và kiểm thử đầy đủ trên mọi máy.
