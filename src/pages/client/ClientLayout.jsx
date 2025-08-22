import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import { fetchProvince } from '@redux/slices/movieTheaterSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ClientLayout = () => {
  const dispatch = useDispatch();
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { user } = useSelector((state) => state.user);

  /* Fetch danh sách rạp chiếu tại các chi nhánh */
  useEffect(() => {
    if (movieTheater.id == null) {
      dispatch(fetchProvince());
    }
  }, [dispatch, movieTheater]);

  const isUnauthorized = user?.roles?.some(
    (role) => role.roleId === 'CADMIN' || role.roleId === 'ADMIN'
  );

  if (isUnauthorized) {
    return <Navigate to="/admin" replace />;
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
