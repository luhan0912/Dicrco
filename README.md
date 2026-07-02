# Discord Bot 110 Hồ Sơ Tự Động Chat - Tiếng Việt

Bot Discord tự động gửi tin nhắn từ file và xóa chúng sau 0.5 giây với 110 hồ sơ giả mạo độc lập.

## 🚀 Tính Năng

- ✅ 110 Hồ sơ độc lập (55 Máy tính + 55 Điện thoại)
- ✅ Đọc nội dung từ file `text.txt`
- ✅ Hỗ trợ proxy
- ✅ Xóa tin nhắn sau 0.5 giây
- ✅ Giả mạo thông tin thiết bị hoàn chỉnh
- ✅ Embed message đẹp với icon tiếng Việt
- ✅ Gửi liên tục theo chu kỳ

## 📊 Thông Tin Được Giả Mạo

Mỗi hồ sơ bao gồm:
- 💻 Độ phân giải màn hình ngẫu nhiên
- 🕐 Múi giờ ngẫu nhiên
- 🖥️ Nền tảng (Windows/Mobile)
- 🎨 Canvas Fingerprint
- 🔷 WebGL Vendor/Renderer
- 💾 Device Memory (2GB-32GB)
- ⚙️ Hardware Concurrency (1-16 nhân)
- 👆 Hỗ trợ cảm ứng
- 🆔 ID Phiên độc lập
- 🌐 User-Agent thực tế

## 📋 Chuẩn Bị

### 1. Cài đặt Node.js
Tải từ: https://nodejs.org/

### 2. Cài đặt Dependencies
```bash
npm install
```

### 3. Lấy Discord Bot Token
- Vào: https://discord.com/developers/applications
- Tạo "Ứng dụng mới"
- Tab "Bot" → "Thêm Bot"
- Copy token từ phần "TOKEN"
- Paste vào `token.txt`

### 4. Thêm Bot vào Server
- Tab "OAuth2" → "URL Generator"
- Chọn: `bot`
- Quyền: 
  - ✅ Send Messages
  - ✅ Read Messages
  - ✅ Manage Messages
- Copy URL → Mở trình duyệt → Thêm vào server

## 📝 Cấu Hình File

### `token.txt` - Danh sách token bot
```
token_bot_1
token_bot_2
token_bot_3
```

### `proxy.txt` - Danh sách proxy (tùy chọn)
```
http://proxy1:port
http://proxy2:port
```

### `text.txt` - Nội dung tin nhắn tiếng Việt
```
Xin chào mọi người!
Chúc bạn một ngày tốt lành!
Bot đang hoạt động!
```

## 🏃 Chạy Bot

```bash
npm start
```

hoặc

```bash
node bot.js
```

## ⚙️ Cấu Hình Tốc Độ

Trong `bot.js`, thay đổi:

```javascript
const SEND_INTERVAL = 10000;  // Gửi mỗi 10 giây
const DELETE_DELAY = 500;     // Xóa sau 0.5 giây
```

## 📊 Cấu Trúc Hồ Sơ

**55 Hồ sơ Máy Tính (Windows) - Màu xanh**
- User-Agent: Chrome, Firefox, Edge, Opera, Brave
- Màn hình: 1024x768 đến 3840x2160
- Nền tảng: Win32

**55 Hồ sơ Điện Thoại (Mobile) - Màu đỏ**
- User-Agent: iPhone, Android, iPad
- Màn hình: Kích thước điện thoại
- Nền tảng: iOS, Android

## 🔗 Tìm Channel ID

Từ URL Discord:
```
https://discord.com/channels/SERVER_ID/CHANNEL_ID
```

Thay đổi trong `bot.js`:
```javascript
const TARGET_CHANNEL_ID = 'CHANNEL_ID_CỦA_BẠN';
```

## 🛠️ Khắc Phục Sự Cố

**Bot không online:**
- Kiểm tra token đúng chưa
- Kiểm tra quyền bot
- Kiểm tra kết nối internet

**Lỗi proxy:**
- Kiểm tra định dạng proxy
- Kiểm tra proxy có hoạt động không

**Tin nhắn không gửi được:**
- Kiểm tra bot có quyền ở phòng không
- Kiểm tra Channel ID đúng không
- Kiểm tra tin nhắn trong `text.txt` không rỗng

## 📄 License

MIT

## ⚠️ Lưu Ý Quan Trọng

- **Tuân thủ Điều khoản Dịch vụ Discord**: Bot chỉ dùng cho mục đích hợp lệ
- **Bảo mật Token**: Đừng chia sẻ token với bất kỳ ai
- **Proxy Tùy chọn**: Nếu không dùng proxy, để trống `proxy.txt`
