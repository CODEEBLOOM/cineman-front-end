import MovieComponent from '@component/MovieComponent';
import { useEffect } from 'react';

const MoviePage = () => {
  useEffect(() => {
    document.title = 'Phim - POLY CINEMAS';
  }, []);
  return (
    <>
      <MovieComponent />
    </>
  );
};
export default MoviePage;
