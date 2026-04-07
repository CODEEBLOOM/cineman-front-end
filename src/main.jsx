import { StrictMode } from 'react';
import { Suspense, lazy } from 'react';

/* Cấu hình react-toastify */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from 'react-dom/client';

/* Import main css */
import './index.css';

/* Import router */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@emotion/react';
import Loading from '@component/Loading';
import theme from '@configs/MUIConfig';
import { Provider } from 'react-redux';
import { persistor, store } from '@redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { injectStore } from '@apis/axiosClient';

const RootLayout = lazy(() => import('./RootLayout'));
const HomePage = lazy(() => import('@pages/HomePage'));
const AuthLayout = lazy(() => import('@pages/auth/AuthLayout'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const DetailMoviePage = lazy(() => import('@pages/DetailMoviePage'));
const MoviePage = lazy(() => import('@pages/MoviePage'));
const ProtectedRoute = lazy(
  () => import('@pages/protected_route/ProtectedRoute.jsx')
);
const AdminRoute = lazy(() => import('@pages/admin/AdminRoute.jsx'));
const DashBoardPage = lazy(() => import('@pages/admin/DashBoardPage.jsx'));
const StatisticalPage = lazy(() => import('@pages/admin/StatisticalPage.jsx'));
const TheaterSystemPage = lazy(
  () => import('@pages/admin/TheaterSystemPage.jsx')
);
const ProvincePage = lazy(() => import('@pages/admin/ProvincePage.jsx'));
const MovieTheaterPage = lazy(
  () => import('@pages/admin/MovieTheaterPage.jsx')
);
const CinemaTypePage = lazy(() => import('@pages/admin/CinemaTypePage.jsx'));
const CinemaTheater = lazy(
  () => import('@component/admin/cinema_theater/CinemaTheater.jsx')
);
const SeatMap = lazy(() => import('@component/admin/seat/SeatMap'));
const GoogleCallback = lazy(() => import('@pages/auth/GoogleCallback'));
const ClientLayout = lazy(() => import('@pages/client/ClientLayout'));
const ListMovie = lazy(() => import('@component/admin/movie/ListMovie'));
const BookingTicket = lazy(
  () => import('@pages/protected_route/BookingTicket')
);
const PaymentCallback = lazy(
  () => import('@component/payment/PaymentCallback')
);
const MyAccount = lazy(() => import('@pages/protected_route/MyAccount'));
const NotFoundPage = lazy(() => import('@pages/NotFound'));
const CinemaShowtime = lazy(() => import('@pages/CinemaShowTime'));
const InvoiceIndex = lazy(
  () => import('@component/admin/invoice/InvoiceIndex')
);
const TicketManagementPage = lazy(
  () => import('@pages/admin/TicketManagementPage')
);
const ShowTimePage = lazy(() => import('@pages/admin/ShowTimePage'));
const MovieVariationPage = lazy(
  () => import('@pages/admin/MovieVariationPage')
);
const TicketTypePage = lazy(() => import('@pages/admin/TicketTypePage'));
const MovieGenrePage = lazy(() => import('@pages/admin/MovieGenrePage'));
const MovieRolePage = lazy(() => import('@pages/admin/MovieRolePage'));
const MovieStatusPage = lazy(() => import('@pages/admin/MovieStatusPage'));
const MovieParticipantPage = lazy(
  () => import('@pages/admin/MovieParticipantPage')
);
const ParticipantPage = lazy(() => import('@pages/admin/ParticipantPage'));
const SnackPage = lazy(() => import('@pages/admin/SnackPage'));
const SnackTypePage = lazy(() => import('@pages/admin/SnackTypePage'));
const MembershipRankPage = lazy(
  () => import('@pages/admin/MembershipRankPage')
);
const PromotionPage = lazy(() => import('@pages/admin/PromotionPage.jsx'));
const PromotionTypePage = lazy(
  () => import('@pages/admin/PromotionTypePage.jsx')
);
const RolePage = lazy(() => import('@pages/admin/RolePage.jsx'));
const UserPage = lazy(() => import('@pages/admin/UserPage.jsx'));

const routerFallback = <Loading minHeight="55vh" />;

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
            path: 'loai-khuyen-mai',
            element: <PromotionTypePage />,
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
    <PersistGate loading={<Loading minHeight="100vh" />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <Suspense fallback={routerFallback}>
          <RouterProvider router={router} />
        </Suspense>
        <ToastContainer theme="colored" autoClose={3000} position="top-right" />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  //{/* </StrictMode> */}
);
