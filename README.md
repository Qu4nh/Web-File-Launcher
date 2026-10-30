# Web File Launcher

**Author: qu4nh** · Extension 2.1.0 · Windows · Chrome và Microsoft Edge

Popup nhỏ 400 × 560 px khi bấm biểu tượng tiện ích. Tạo quy tắc website → file/chương trình/thư mục, bật/tắt, mở thử và xem hoạt động ngay trong popup.

## Cài đặt

1. Giải nén toàn bộ gói vào một thư mục cố định. Không di chuyển thư mục sau khi cài.
2. Mở PowerShell tại thư mục gốc vừa giải nén, chạy:

   ```powershell
   .\native-host\install.ps1
   ```

   Đăng ký cầu nối cho cả Chrome và Edge của tài khoản Windows hiện tại; không cần quyền quản trị. Script tạo `native-host/host.json` với đường dẫn trên máy bạn. Nếu chính sách Windows chặn, không tắt hoặc vượt chính sách để chạy.
3. Mở `chrome://extensions` hoặc `edge://extensions`, bật **Developer mode**, bấm **Load unpacked** và chọn thư mục **extension**.
4. Ghim tiện ích nếu muốn, rồi bấm biểu tượng để mở popup. Không có tab cấu hình riêng.
5. Chọn **＋ Thêm mới**, nhập tên và website. Nút **Trang này** dùng website đang mở. Bấm **Chọn file và lưu**, chọn file/thư mục trong hộp thoại Windows.
6. Mở hoặc tải lại website để tự mở file. Nếu cập nhật từ bản trước, thay thư mục và bấm **Reload** trong trang quản lý tiện ích.

Popup có thể đóng khi hộp chọn Windows lấy focus; phần chạy nền tiếp tục lưu kết quả. Mở lại popup sau khi chọn xong. Mỗi quy tắc áp dụng cho toàn bộ origin (giao thức + hostname + cổng), gồm các trang con. Có chờ 15 giây và tùy chọn kiểm tra trùng EXE theo đường dẫn. Tài liệu/thư mục được mở bằng ứng dụng mặc định. Không truyền đối số dòng lệnh.

## Smart App Control

Extension không tự chạy EXE trực tiếp: cần cầu nối Windows đi kèm. **Cầu nối này chưa có chữ ký số tin cậy; Smart App Control có thể chặn.** Gói tối giản không làm thay đổi giới hạn đó. Máy chặn cần bản cầu nối được ký phù hợp hoặc quy trình phê duyệt của quản trị viên. EXE đích cũng có thể bị kiểm tra độc lập. Không tắt Smart App Control để dùng gói này.

UI và logic JavaScript đã qua kiểm thử bằng API giả lập; chưa xác nhận toàn bộ luồng chọn/mở file với cầu nối thật do chính sách Application Control trên máy đóng gói. Windows cần .NET Framework 4.6 trở lên và ứng dụng/phụ thuộc cần thiết để mở file đích.

## Dữ liệu và gỡ bỏ

Quy tắc lưu tại `%LOCALAPPDATA%\WebFileLauncher\rules.json`; bản nháp, cache và nhật ký lưu trong hồ sơ trình duyệt. Không gửi tới máy chủ trung gian. Không chia sẻ `host.json` được tạo sau khi cài hoặc dữ liệu quy tắc riêng; người nhận tự chạy script đăng ký trên máy họ.

Để dừng sử dụng, xóa tiện ích ở trang quản lý extensions của từng trình duyệt. Đăng ký cầu nối còn lại không tự chạy chương trình. Có thể xóa các khóa `io.github.web_file_launcher` do gói này tạo bên dưới `HKEY_CURRENT_USER\Software\Google\Chrome\NativeMessagingHosts` và `HKEY_CURRENT_USER\Software\Microsoft\Edge\NativeMessagingHosts`, rồi xóa thư mục đã giải nén và dữ liệu quy tắc nếu không cần nữa. Không xóa khóa của tiện ích khác. File/chương trình đích không bị gói này xóa.

Gói chỉ gồm **9 file**: 6 file extension, EXE cầu nối, script đăng ký và README này. Không có mã kiểm thử, ảnh preview, package.json hoặc mã nguồn/build của cầu nối.
