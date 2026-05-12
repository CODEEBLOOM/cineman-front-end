import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import { fetchProvince } from '@redux/slices/movieTheaterSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ClientLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  /* Fetch danh sach rap chieu tai cac chi nhanh */
  useEffect(() => {
    dispatch(fetchProvince());
  }, [dispatch]);

  const isUnauthorized = user?.roles?.some(
    (role) => role.roleId === 'CADMIN' || role.roleId === 'ADMIN'
  );

  if (isUnauthorized) {
    if (user?.roles?.some((role) => role.roleId === 'CADMIN')) {
      return <Navigate to="/admin/phong-chieu" replace />;
    }
    return <Navigate to="/admin/danh-sach-phim" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default ClientLayout;
