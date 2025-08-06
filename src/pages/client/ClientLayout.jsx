import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import { fetchProvince } from '@redux/slices/movieTheaterSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  const dispatch = useDispatch();
  const { movieTheater } = useSelector((state) => state.movieTheater);

  /* Fetch danh sách rạp chiếu tại các chi nhánh */
  useEffect(() => {
    if (movieTheater.id == null) {
      dispatch(fetchProvince());
    }
  }, [dispatch, movieTheater]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default ClientLayout;
