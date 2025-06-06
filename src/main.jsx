import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import RootLayout from './RootLayout';
import AuthLayout from '@pages/auth/AuthLayout';
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/register',
            element: <p>Register Page</p>,
          },
          {
            path: '/login',
            element: <p>Login Page</p>,
          },
          {
            path: '/verify-otp',
            element: <p>Verify OTP</p>,
          },
        ],
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
