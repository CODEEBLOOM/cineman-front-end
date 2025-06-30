import React, { Suspense, useState } from 'react';
import Sidebar from '@component/admin/layout/sidebar/index.jsx';
import { Outlet } from 'react-router-dom';
import HeaderAdmin from '@component/admin/layout/HeaderAdmin.jsx';
import { useMediaQuery, useTheme } from '@mui/material';
import FooterAdmin from '@component/admin/layout/FooterAdmin.jsx';

const AdminRoute = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <div className={'flex bg-[#ebeaea]'}>
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
