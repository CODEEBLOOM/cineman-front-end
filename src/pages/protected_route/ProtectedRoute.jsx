import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthentication } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthentication) {
    return (
      <Navigate to="/login?auth=login" replace state={{ from: location }} />
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
