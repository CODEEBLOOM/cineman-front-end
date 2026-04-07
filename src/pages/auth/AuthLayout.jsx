import Loading from '@component/Loading';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import Header from '@component/headers/Header';
import Footer from '@component/Footer';
import { useSelector } from 'react-redux';
import { clearAuthRedirect, resolveAuthRedirect } from '@utils/authRedirect';

const AuthLayout = () => {
  const { isAuthentication } = useSelector((state) => state.auth);
  const location = useLocation();

  const redirectUrl = resolveAuthRedirect(location.state?.from, '/');

  useEffect(() => {
    if (isAuthentication) {
      clearAuthRedirect();
    }
  }, [isAuthentication]);

  if (isAuthentication) {
    return <Navigate to={redirectUrl} replace />;
  }
  return (
    // <div className="bg-dark-200 flex h-screen items-center justify-center">
    //   <div className="h-fit w-[450px] rounded border border-slate-200 bg-white px-8 py-10 shadow-md">
    //     <img className="mx-auto mb-6" src="/weconnect-logo.png" alt="" />
    <>
      <Header />
      <Suspense fallback={<Loading minHeight="45vh" />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
    //   </div>
    // </div>
  );
};
export default AuthLayout;
