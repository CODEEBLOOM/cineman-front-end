import { findMovieById } from '@apis/movieService';
import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ShowTimeComponent from '@component/movie_detail/ShowTimeComponent.jsx';
import MovieInfoDetailComponent from '@component/movie_detail/MovieInfoDetailComponent.jsx';
import MovieTrailerComponent from '@component/movie_detail/MovieTrailerComponent.jsx';
import CinemanTheaterComponent from '@component/movie_detail/CinemanTheaterComponent.jsx';

const DetailMoviePage = () => {
  const [movie, setMovie] = useState();
  const [activeShowTime, setActiveShowTime] = useState(1);
  const { id } = useParams();
  const { pathname } = useLocation();

  const listShowTimeConstant = [
    { id: 1, date: '2025-06-20' },
    { id: 2, date: '2025-06-21' },
    { id: 3, date: '2025-06-22' },
    { id: 4, date: '2025-06-23' },
    { id: 5, date: '2025-06-24' },
    { id: 6, date: '2025-06-25' },
    { id: 7, date: '2025-06-26' },
  ];

  /* Luôn ở đầu trang khi chuyển router */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  /* Fetch movie detail by id get at param */
  useEffect(() => {
    findMovieById(id)
      .then((res) => {
        setMovie(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <>
      <Header />
      <MovieInfoDetailComponent movie={movie} />
      <ShowTimeComponent
        active={activeShowTime}
        setActive={setActiveShowTime}
        showTimes={listShowTimeConstant}
      />
      <CinemanTheaterComponent />
      <MovieTrailerComponent
        iframeUrl={
          'https://www.youtube.com/embed/Sp_IBr3cH8g?rel=0&showinfo=0&autoplay=1'
        }
      />
      <Footer />
    </>
  );
};
export default DetailMoviePage;
