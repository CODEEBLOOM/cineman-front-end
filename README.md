# Cineman App

Frontend web cho hệ thống quản lý rạp phim, đặt vé, chọn ghế, thanh toán và quản trị vận hành. Dự án được xây dựng bằng `React 18`, `Vite`, `Redux Toolkit`, `React Router`, `MUI` và `Tailwind CSS`.

File mô tả cấu trúc source đã được bổ sung tại [PROJECT_STRUCTURE.md](/d:/1.FPT-College/DATN/setup/cineman-app/PROJECT_STRUCTURE.md).

## Tính năng chính

- Trang client cho danh sách phim, chi tiết phim và lịch chiếu.
- Luồng đặt vé gồm chọn ghế, chọn combo, thanh toán và callback sau thanh toán.
- Đăng nhập thường, đăng nhập Google và quản lý phiên bằng refresh token.
- Trang tài khoản khách hàng.
- Khu vực admin cho hóa đơn, phim, suất chiếu, phòng chiếu và sơ đồ ghế.
- Kết nối realtime qua WebSocket cho một số tác vụ chọn ghế.

## Công nghệ sử dụng

- `React 18` + `Vite 6`
- `React Router DOM 7`
- `Redux Toolkit` + `redux-persist`
- `Axios`
- `MUI`, `Tailwind CSS`, `Sass`
- `react-hook-form` + `yup`
- `@stomp/stompjs` cho realtime

## Yêu cầu môi trường

- `Node.js 20 LTS` trở lên
- `npm 10` trở lên

## Cài đặt và chạy local

1. Cài dependencies:

```bash
npm install
```

2. Tạo file môi trường từ mẫu:

```bash
cp .env.example .env
```

3. Cập nhật các biến môi trường cho đúng backend của bạn.

4. Chạy môi trường development:

```bash
npm run dev
```

5. Mở ứng dụng tại `http://localhost:3000`.

## Biến môi trường

Bạn có thể tham khảo file [`.env.example`](/d:/1.FPT-College/DATN/setup/cineman-app/.env.example).

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_HOST` | Base URL của backend API. |
| `VITE_REALTIME` | WebSocket URL cho realtime seat/booking. |
| `VITE_STORAGES` | Base URL để đọc ảnh đã upload. |
| `VITE_CONVERSION_FACTOR_REDEEM_POINT` | Tỷ lệ quy đổi điểm sang tiền. |
| `VITE_DOMAIN` | Domain public của frontend, dùng cho callback/link QR. |

Ví dụ production:

```env
VITE_HOST=https://api.example.com/api/v01
VITE_REALTIME=wss://api.example.com/cineman-ws
VITE_STORAGES=https://api.example.com/api/v01/storages/photo
VITE_CONVERSION_FACTOR_REDEEM_POINT=1
VITE_DOMAIN=https://app.example.com
```

## Scripts

- `npm run dev`: chạy local bằng Vite dev server.
- `npm run build`: build production ra thư mục `dist/`.
- `npm run preview`: preview bản build local.
- `npm run lint`: kiểm tra ESLint.

## Kiến trúc route

- Public client:
  - `/`
  - `/movie`
  - `/showtimes`
  - `/detail-movie/:id`
- Auth:
  - `/auth/login`
  - `/auth/google/callback`
- Protected:
  - `/choose-seat`
  - `/payment`
  - `/payment/payment-callback`
  - `/my-account`
- Admin:
  - `/admin/dashboard`
  - `/admin/invoice`
  - `/admin/invoice-detail/:qrCode`
  - `/admin/phong-chieu`
  - `/admin/so-do-ghe/:id`
  - `/admin/xuat-chieu`
  - `/admin/danh-sach-phim`

Vì dự án dùng `createBrowserRouter`, server deploy phải cấu hình rewrite mọi route SPA về `index.html`.

## Build production

```bash
npm run build
```

Sau khi build thành công, thư mục deploy là `dist/`.

## Hướng dẫn deploy

### 1. Chuẩn bị trước khi deploy

- Set đầy đủ các biến môi trường production.
- Bảo đảm `VITE_DOMAIN` đúng với domain public của frontend.
- Nếu backend khác domain với frontend, backend phải bật `CORS` và `credentials`.
- Vì frontend dùng `axios` với `withCredentials: true`, cookie phiên cần cấu hình phù hợp cho cross-site:
  - `SameSite=None`
  - `Secure=true` khi chạy HTTPS
- Kiểm tra lại callback URLs:
  - Google login callback: `https://your-domain/auth/google/callback`
  - Payment callback: `https://your-domain/payment/payment-callback`

### 2. Deploy lên Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Thêm toàn bộ biến môi trường ở dashboard của nhà cung cấp.
- Bật SPA rewrite để mọi route trỏ về `index.html`.

Lưu ý:

- Cấu hình hiện tại trong [vite.config.js](/d:/1.FPT-College/DATN/setup/cineman-app/vite.config.js) chưa khai báo `base`, nên phù hợp nhất khi deploy ở root domain hoặc subdomain, ví dụ `https://app.example.com/`.
- Nếu bạn muốn deploy dưới sub-path như `https://example.com/cineman/`, cần bổ sung `base: '/cineman/'` trong Vite config rồi build lại.

### 3. Deploy thủ công bằng Nginx

1. Build project:

```bash
npm run build
```

2. Copy toàn bộ nội dung thư mục `dist/` lên server, ví dụ `/var/www/cineman-app`.

3. Cấu hình Nginx:

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/cineman-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Reload Nginx và kiểm tra lại các route trực tiếp như `/movie`, `/auth/login`, `/admin/dashboard`.

## Checklist sau deploy

- Frontend load được khi truy cập trực tiếp vào route con.
- API gọi đúng domain backend.
- Đăng nhập và refresh token hoạt động bình thường.
- WebSocket dùng `wss://` khi chạy HTTPS.
- Upload ảnh và hiển thị ảnh hoạt động đúng qua `VITE_STORAGES`.
- Callback thanh toán trả về đúng route `/payment/payment-callback`.
- Mã QR trong admin sinh ra đúng domain theo `VITE_DOMAIN`.

## Tài liệu bổ sung

- Cấu trúc source: [PROJECT_STRUCTURE.md](/d:/1.FPT-College/DATN/setup/cineman-app/PROJECT_STRUCTURE.md)
- Cấu hình Vite: [vite.config.js](/d:/1.FPT-College/DATN/setup/cineman-app/vite.config.js)
- Entry app và router: [src/main.jsx](/d:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx)
- API client: [src/apis/axiosClient.js](/d:/1.FPT-College/DATN/setup/cineman-app/src/apis/axiosClient.js)
