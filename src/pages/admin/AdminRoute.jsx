import React, { Suspense, useState } from 'react';
import Sidebar from '@component/admin/layout/sidebar/index.jsx';
import { Navigate, Outlet } from 'react-router-dom';
import HeaderAdmin from '@component/admin/layout/HeaderAdmin.jsx';
import { useMediaQuery, useTheme } from '@mui/material';
import FooterAdmin from '@component/admin/layout/FooterAdmin.jsx';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user } = useSelector((state) => state.user);

  const isUnauthorized =
    !user?.userId || user?.roles?.some((role) => role.roleId === 'USER');

  if (isUnauthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <div className={'flex bg-[rgba(237,237,240,0.8)]'}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />
        <div className="grid h-screen flex-grow grid-rows-[auto_1fr_auto]">
          <HeaderAdmin open={isOpen} setOpen={setIsOpen} />
          <main className="min-h-0 overflow-auto">
            <Outlet />
          </main>
          <FooterAdmin />
        </div>
      </div>
    </Suspense>
  );
};

export default AdminRoute;
