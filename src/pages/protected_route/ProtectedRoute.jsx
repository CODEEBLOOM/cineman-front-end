import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '@component/headers/Header';
import Footer from '@component/Footer';

const ProtectedRoute = () => {
  const { isAuthentication } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthentication) {
    return (
      <Navigate
        to="/auth/login?auth=login"
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedRoute;
