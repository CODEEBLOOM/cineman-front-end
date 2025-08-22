import { useEffect, useState } from 'react';
import DateStripPlaceholder from '@component/cinema_showtime/DateStripPlaceholder';
import MovieItem from '@component/cinema_showtime/MovieItem';
import { useSelector } from 'react-redux';
import { findAllMovieByCinemaTheaterIdAndShowDate } from '@apis/showTimeService';
import EmptyList from '@component/cinema_showtime/EmptyList';

const CinemaShowtime = () => {
  const { showDateActive } = useSelector((state) => state.cinemaShowTime);
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    document.title = 'Danh sách phim theo lịch chiếu - POLY CINEMAS';
    findAllMovieByCinemaTheaterIdAndShowDate(movieTheater.id, showDateActive)
      .then((res) => setMovies(res.data))
      .catch((error) => {
        console.log(error);
      });
  }, [showDateActive, movieTheater.id]);

  return (
    <div className="bg-white">
      <div className="pl-10">
        <DateStripPlaceholder />
      </div>
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {movies.length === 0 && <EmptyList />}
        <div className="space-y-5 md:space-y-6">
          {(movies || []).map((m) => (
            <MovieItem key={m.movieId} movie={m} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default CinemaShowtime;
