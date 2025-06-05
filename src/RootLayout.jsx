// Supports weights 100-900
import '@fontsource-variable/public-sans';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default RootLayout;
