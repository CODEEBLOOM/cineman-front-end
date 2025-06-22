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
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<p>Loading ...</p>} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
