import { Navigate, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '@component/headers/Header';
import Footer from '@component/Footer';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isAuthentication } = useSelector((state) => state.auth);
  if (isAuthentication) {
    return <Navigate to={'/'} replace />;
  }
  return (
    // <div className="bg-dark-200 flex h-screen items-center justify-center">
    //   <div className="h-fit w-[450px] rounded border border-slate-200 bg-white px-8 py-10 shadow-md">
    //     <img className="mx-auto mb-6" src="/weconnect-logo.png" alt="" />
    <>
      <Header />
      <Suspense fallback={<p>Loading ...</p>}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
    //   </div>
    // </div>
  );
};
export default AuthLayout;
