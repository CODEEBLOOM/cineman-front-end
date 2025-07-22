import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import { setIsAuthentication } from '@redux/slices/authSlice';
import { fetchProvince } from '@redux/slices/movieTheaterSlice';
import { fetchInfoUser } from '@redux/slices/userSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  const dispatch = useDispatch();
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { isAuthentication } = useSelector((state) => state.auth);
  /* Fetch danh sách rạp chiếu tại các chi nhánh */
  useEffect(() => {
    if (movieTheater.id == null) {
      dispatch(fetchProvince());
    }
  }, [dispatch, movieTheater]);

  /* Fetch thông tin user nếu đã đăng nhập thành công */
  useEffect(() => {
    const getInfoUser = async () => {
      try {
        await dispatch(fetchInfoUser()).unwrap();
      } catch (err) {
        console.log(err);
        dispatch(setIsAuthentication(false));
      }
    };
    if (isAuthentication) {
      getInfoUser();
    }
  }, [isAuthentication, dispatch]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default ClientLayout;
