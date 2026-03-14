# Cấu Trúc Dự Án Cineman App

## Tổng quan

Đây là dự án frontend SPA xây bằng `Vite + React`, chia thành 4 nhóm màn hình chính:

- `client`: giao diện người dùng cuối.
- `auth`: đăng nhập và callback xác thực.
- `protected_route`: các màn hình cần đăng nhập như chọn ghế, thanh toán, tài khoản.
- `admin`: các màn hình quản trị vận hành.

## Cấu trúc thư mục chính

```text
cineman-app/
|-- public/                     # Ảnh tĩnh, logo, banner, icon ghế, file export cũ
|-- src/
|   |-- apis/                   # Service gọi backend qua axios
|   |-- components/             # Component dùng lại và component theo module
|   |-- configs/                # Cấu hình MUI/theme
|   |-- context/                # React context dùng chung
|   |-- custom_hooks/           # Custom hook nội bộ
|   |-- hooks/                  # Thư mục hook theo alias, hiện gần như chưa dùng
|   |-- libs/                   # Helper/utility dùng chung
|   |-- pages/                  # Page-level components và layout theo route
|   |-- redux/                  # Store và slices
|   |-- utils/                  # Hằng số, formatter, menu config
|   |-- index.css               # CSS global
|   |-- main.jsx                # Entry point, router, provider
|   `-- RootLayout.jsx          # Layout gốc + Snackbar + ModalProvider
|-- .env                        # Biến môi trường local hiện tại
|-- .env.example                # Mẫu biến môi trường cho local/prod
|-- eslint.config.js            # Cấu hình ESLint
|-- index.html                  # HTML entry của Vite
|-- jsconfig.json               # Alias import cho src
|-- package.json                # Scripts và dependencies
|-- postcss.config.js           # Cấu hình PostCSS
|-- prettier.config.cjs         # Cấu hình Prettier
|-- tailwind.config.js          # Cấu hình Tailwind
|-- vite.config.js              # Cấu hình Vite
|-- PROJECT_STRUCTURE.md        # Tài liệu cấu trúc dự án
`-- README.md                   # Tài liệu cài đặt và deploy
```

## Chi tiết trong `src`

### `src/apis`

Tầng giao tiếp backend. Mỗi file thường đại diện cho một domain nghiệp vụ:

- `axiosClient.js`: cấu hình axios base URL, `withCredentials`, auto refresh token.
- `authService.js`, `userService.js`: xác thực và người dùng.
- `movieService.js`, `showTimeService.js`, `movieTheaterService.js`: phim và lịch chiếu.
- `invoiceService.js`, `paymentService.js`, `ticketService.js`: hóa đơn, thanh toán, vé.
- `snackService.js`, `detailBookingSnack.js`, `snackType.js`: combo/đồ ăn.
- `uploadFileService.js`: upload ảnh.

### `src/components`

Nơi chứa component tái sử dụng và component theo module:

- `headers/`: header, menu, dropdown.
- `auth/`: form đăng nhập/đăng ký.
- `movie_detail/`: trailer, thông tin phim, lịch chiếu chi tiết.
- `choose_seat/`: render sơ đồ ghế và thông tin booking.
- `payment/`: phương thức thanh toán, combo, điểm thưởng, callback.
- `account-customer/`: hồ sơ cá nhân, lịch sử giao dịch, upload avatar.
- `admin/`: toàn bộ thành phần quản trị như phim, hóa đơn, suất chiếu, sơ đồ ghế.
- `seat/`, `cinema_showtime/`, `form_field/`: component chuyên biệt theo tác vụ.

### `src/pages`

Phần tổ chức route theo khu vực:

- `client/ClientLayout.jsx`: layout phần người dùng cuối.
- `auth/AuthLayout.jsx`, `auth/LoginPage.jsx`, `auth/GoogleCallback.jsx`.
- `protected_route/`: kiểm soát truy cập và các màn hình sau đăng nhập.
- `admin/`: route guard và các trang quản trị.
- Các page public chính:
  - `HomePage.jsx`
  - `MoviePage.jsx`
  - `DetailMoviePage.jsx`
  - `CinemaShowTime.jsx`
  - `NotFound.jsx`

### `src/redux`

- `store.js`: khai báo Redux store và `redux-persist`.
- `slices/`: state theo domain như `auth`, `movie`, `invoice`, `ticket`, `snack`, `snackbar`.

### `src/utils`

- Menu điều hướng.
- Formatter ngày giờ.
- Hằng số màu ghế.

## Điểm vào ứng dụng

- [src/main.jsx](/d:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx): khởi tạo router, Redux Provider, PersistGate, ThemeProvider.
- [src/RootLayout.jsx](/d:/1.FPT-College/DATN/setup/cineman-app/src/RootLayout.jsx): layout gốc, modal context, snackbar và nút scroll top.

## Alias import đang dùng

Các alias được cấu hình tại [vite.config.js](/d:/1.FPT-College/DATN/setup/cineman-app/vite.config.js) và `jsconfig.json`:

- `@component` -> `src/components`
- `@libs` -> `src/libs`
- `@pages` -> `src/pages`
- `@hooks` -> `src/hooks`
- `@configs` -> `src/configs`
- `@redux` -> `src/redux`
- `@apis` -> `src/apis`
- `@utils` -> `src/utils`
- `@context` -> `src/context`

## Gợi ý đọc source nhanh

Nếu muốn nắm dự án nhanh, nên đọc theo thứ tự:

1. [src/main.jsx](/d:/1.FPT-College/DATN/setup/cineman-app/src/main.jsx)
2. [src/apis/axiosClient.js](/d:/1.FPT-College/DATN/setup/cineman-app/src/apis/axiosClient.js)
3. [src/redux/store.js](/d:/1.FPT-College/DATN/setup/cineman-app/src/redux/store.js)
4. [src/pages/client/ClientLayout.jsx](/d:/1.FPT-College/DATN/setup/cineman-app/src/pages/client/ClientLayout.jsx)
5. [src/components/admin](/d:/1.FPT-College/DATN/setup/cineman-app/src/components/admin)
