import { StrictMode } from 'react';

/* Cấu hình react-toastify */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from 'react-dom/client';

/* Import main css */
import './index.css';

/* Import router */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Import component or page */
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
import ProtectedRoute from '@pages/protected_route/ProtectedRoute.jsx';
import AdminRoute from '@pages/admin/AdminRoute.jsx';
import DashBoardPage from '@pages/admin/DashBoardPage.jsx';
import StatisticalPage from '@pages/admin/StatisticalPage.jsx';
import TheaterSystemPage from '@pages/admin/TheaterSystemPage.jsx';
import ProvincePage from '@pages/admin/ProvincePage.jsx';
import MovieTheaterPage from '@pages/admin/MovieTheaterPage.jsx';
import CinemaTypePage from '@pages/admin/CinemaTypePage.jsx';
import CinemaTheater from '@component/admin/cinema_theater/CinemaTheater.jsx';
import SeatMap from '@component/admin/seat/SeatMap';
import GoogleCallback from '@pages/auth/GoogleCallback';
import ClientLayout from '@pages/client/ClientLayout';
import ListMovie from '@component/admin/movie/ListMovie';
import BookingTicket from '@pages/protected_route/BookingTicket';
import PaymentCallback from '@component/payment/PaymentCallback';
import { injectStore } from '@apis/axiosClient';
import MyAccount from '@pages/protected_route/MyAccount';
import NotFoundPage from '@pages/NotFound';
import CinemaShowtime from '@pages/CinemaShowTime';
import InvoiceIndex from '@component/admin/invoice/InvoiceIndex';
import TicketManagementPage from '@pages/admin/TicketManagementPage';
import ShowTimePage from '@pages/admin/ShowTimePage';
import MovieVariationPage from '@pages/admin/MovieVariationPage';
import TicketTypePage from '@pages/admin/TicketTypePage';
import MovieGenrePage from '@pages/admin/MovieGenrePage';
import MovieRolePage from '@pages/admin/MovieRolePage';
import MovieStatusPage from '@pages/admin/MovieStatusPage';
import MovieParticipantPage from '@pages/admin/MovieParticipantPage';
import ParticipantPage from '@pages/admin/ParticipantPage';
import SnackPage from '@pages/admin/SnackPage';
import SnackTypePage from '@pages/admin/SnackTypePage';
import MembershipRankPage from '@pages/admin/MembershipRankPage';
import PromotionPage from '@pages/admin/PromotionPage.jsx';
import RolePage from '@pages/admin/RolePage.jsx';
import UserPage from '@pages/admin/UserPage.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
      {
        element: <ClientLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/showtimes',
            element: <CinemaShowtime />,
          },
          {
            path: '/detail-movie/:id',
            element: <DetailMoviePage />,
          },
          {
            path: '/movie',
            element: <MoviePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/choose-seat',
            element: <BookingTicket />,
          },
          {
            path: '/payment',
            element: <BookingTicket />,
          },
          {
            path: '/payment/payment-callback',
            element: <PaymentCallback />,
          },
          {
            path: '/my-account',
            element: <MyAccount />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        path: '/auth',
        children: [
          {
            index: true,
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'google/callback',
            element: <GoogleCallback />,
          },
        ],
      },
      {
        element: <AdminRoute />,
        path: '/admin',
        children: [
          {
            path: 'invoice',
            element: <InvoiceIndex />,
          },
          {
            path: 'invoice-detail/:qrCode',
            element: <TicketManagementPage />,
          },
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
            element: <ProvincePage />,
          },
          {
            path: 'rap',
            element: <MovieTheaterPage />,
          },
          {
            path: 'cinema-type',
            element: <CinemaTypePage />,
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
            element: <MembershipRankPage />,
          },
          {
            path: 'xuat-chieu',
            element: <ShowTimePage />,
          },
          {
            path: 'bien-the-xuat-chieu',
            element: <MovieVariationPage />,
          },
          {
            path: 'danh-sach-phim',
            element: <ListMovie />,
          },
          {
            path: 'the-loai-phim',
            element: <MovieGenrePage />,
          },
          {
            path: 'trang-thai-phim',
            element: <MovieStatusPage />,
          },
          {
            path: 'nguoi-tham-gia',
            element: <ParticipantPage />,
          },
          {
            path: 'vai-tro-phim',
            element: <MovieRolePage />,
          },
          {
            path: 'nguoi-tham-gia-phim',
            element: <MovieParticipantPage />,
          },
          {
            path: 'do-an',
            element: <SnackPage />,
          },
          {
            path: 'loai-snack',
            element: <SnackTypePage />,
          },
          {
            path: 'combo',
            element: <p>Quản lý combo</p>,
          },
          {
            path: 'khuyen-mai',
            element: <PromotionPage />,
          },
          {
            path: 'gia-ve',
            element: <TicketTypePage />,
          },
          {
            path: 'nguoi-dung',
            element: <UserPage />,
          },
          {
            path: 'vai-tro',
            element: <RolePage />,
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

injectStore(store);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={<p>Loading ...</p>} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
        <ToastContainer theme="colored" autoClose={3000} position="top-right" />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  //{/* </StrictMode> */}
);
