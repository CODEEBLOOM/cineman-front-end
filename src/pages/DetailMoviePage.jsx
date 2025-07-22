import { findMovieById } from '@apis/movieService';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ShowTimeComponent from '@component/movie_detail/ShowTimeComponent.jsx';
import MovieInfoDetailComponent from '@component/movie_detail/MovieInfoDetailComponent.jsx';
import MovieTrailerComponent from '@component/movie_detail/MovieTrailerComponent.jsx';
import CinemanTheaterComponent from '@component/movie_detail/ShowTimeDetail.jsx';

const DetailMoviePage = () => {
  const [movie, setMovie] = useState();
  const { id } = useParams();
  const { pathname } = useLocation();

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

  useEffect(() => {
    document.title = 'Chi tiết phim - Cineman Cinemas';
  }, []);

  return (
    <>
      <MovieInfoDetailComponent movie={movie} />
      <div className="container">
        <ShowTimeComponent movieId={id} />
      </div>
      <MovieTrailerComponent iframeUrl={movie?.trailerLink} />
    </>
  );
};
export default DetailMoviePage;
