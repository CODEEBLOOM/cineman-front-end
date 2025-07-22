import MovieComponent from '@component/MovieComponent';
import { useEffect } from 'react';

const MoviePage = () => {
  useEffect(() => {
    document.title = 'Phim - Cineman Cinemas';
  }, []);
  return (
    <>
      <MovieComponent />
    </>
  );
};
export default MoviePage;
