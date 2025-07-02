import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import RootLayout from './RootLayout';
import AuthLayout from '@pages/auth/AuthLayout';
import LoginPage from '@pages/auth/LoginPage';
import { ThemeProvider } from '@emotion/react';
import theme from '@configs/MUIConfig';
import { Provider } from 'react-redux';
import { persistor, store } from '@redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import DetailMoviePage from '@pages/DetailMoviePage';
import MoviePage from '@pages/MoviePage';
import ChooseSeatPage from '@pages/protected_route/ChooseSeatsPage.jsx';
import ProtectedRoute from '@pages/protected_route/ProtectedRoute.jsx';
import AdminRoute from '@pages/admin/AdminRoute.jsx';
import DashBoardPage from '@pages/admin/DashBoardPage.jsx';
import StatisticalPage from '@pages/admin/StatisticalPage.jsx';
import TheaterSystemPage from '@pages/admin/TheaterSystemPage.jsx';
import CinemaTheater from '@component/admin/cinema_theater/CinemaTheater.jsx';
import SeatMap from '@component/admin/seat/SeatMap';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/detail-movie/:id',
        element: <DetailMoviePage />,
      },
      {
        path: '/movie',
        element: <MoviePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/choose-seat',
            element: <ChooseSeatPage />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
        ],
      },

      {
        element: <AdminRoute />,
        path: '/admin',
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <DashBoardPage />,
          },
          {
            path: 'thong-ke',
            element: <StatisticalPage />,
          },
          {
            path: 'he-thong-rap',
            element: <TheaterSystemPage />,
          },
          {
            path: 'chi-nhanh',
            element: <p>Chi nhanh</p>,
          },
          {
            path: 'rap',
            element: <p>Quản lý rạp</p>,
          },
          {
            path: 'so-do-ghe',
            element: <p>Quản lý sơ đồ ghế</p>,
          },
          {
            path: 'so-do-ghe/:id',
            element: <SeatMap />,
          },
          {
            path: 'phong-chieu',
            element: <CinemaTheater />,
          },
          {
            path: 'the-thanh-vien',
            element: <p>Quản lý thẻ thành viên</p>,
          },
          {
            path: 'xuat-chieu',
            element: <p>Quản lý xuất chiếu</p>,
          },
          {
            path: 'phim',
            element: <p>Quản lý phim</p>,
          },
          {
            path: 'hoa-don',
            element: <p>Quản lý hóa đơn</p>,
          },
          {
            path: 'do-an',
            element: <p>Quản lý đồ ăn</p>,
          },
          {
            path: 'combo',
            element: <p>Quản lý combo</p>,
          },
          {
            path: 'ma-giam-gia',
            element: <p>Quản lý mã giảm giá</p>,
          },
          {
            path: 'gia-ve',
            element: <p>Quản lý giá vé</p>,
          },

          {
            path: 'nguoi-dung',
            element: <p>Quản lý người dùng</p>,
          },
          {
            path: 'vai-tro',
            element: <p>Quản lý vai trò</p>,
          },
          {
            path: 'quyen-han',
            element: <p>Quản lý quyền hạn</p>,
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={<p>Loading ...</p>} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </StrictMode>
);
