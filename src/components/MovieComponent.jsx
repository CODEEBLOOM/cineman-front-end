import { findAllByFilter } from '@apis/movieService';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import CardItemFilm from './CardItemFilm';
import TabPanel from './Tabpanel';
import { useDispatch, useSelector } from 'react-redux';
import { setMovieStatus } from '@redux/slices/movieSlice.js';
import Loading from '@component/Loading';

const MovieComponent = () => {
  const { movieStatus } = useSelector((state) => state.movie);
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const [value, setValue] = useState(
    movieStatus === 'SC' ? 0 : movieStatus === 'DB' ? 2 : 1
  );
  const [isLoading, setIsLoading] = useState(false);

  const [listMovies, setListMovies] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChangeMovieStatus = (status) => {
    dispatch(setMovieStatus(status));
  };

  /* Lấy tất cả thông tin phim theo status và movie theater id */
  useEffect(() => {
    if (movieTheater?.id) {
      setIsLoading(true);
      findAllByFilter({
        page: 0,
        size: 10,
        status: movieStatus,
        movieTheaterId: movieTheater.id,
      })
        .then((res) => {
          setListMovies(res.data.movies);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieStatus, movieTheater]);

  return (
    <div className="container">
      <div className="mt-10 text-center">
        <Box sx={{ width: '100%' }}>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                '.MuiTabs-flexContainer': {
                  justifyContent: 'center',
                  overflowX: 'auto',
                },
              }}
            >
              <Tab
                onClick={() => handleChangeMovieStatus('SC')}
                label="Phim Sắp Chiếu"
                className="lg:!text-[25px]"
                {...a11yProps(0)}
              />
              <Tab
                onClick={() => handleChangeMovieStatus('DC')}
                label="Phim Đang Chiếu"
                className="lg:!text-[25px]"
                {...a11yProps(1)}
              />
              <Tab
                onClick={() => handleChangeMovieStatus('DB')}
                label="Xuất chiếu đặc biệt"
                className="lg:!text-[25px]"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {isLoading ? (
                <div className="col-span-full w-full">
                  <Loading />
                </div>
              ) : (
                (listMovies || []).map((movie) => (
                  <CardItemFilm
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    genres={movie.genres}
                    duration={movie.duration}
                    isUpcoming={true}
                    releaseDate={movie.releaseDate}
                    age={movie.age}
                    img={movie.posterImage}
                    trailerLink={movie.trailerLink}
                  />
                ))
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {isLoading ? (
                <div className="col-span-full w-full">
                  <Loading />
                </div>
              ) : (
                (listMovies || []).map((movie) => (
                  <CardItemFilm
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    genres={movie.genres}
                    duration={movie.duration}
                    isUpcoming={false}
                    age={movie.age}
                    img={movie.posterImage}
                    trailerLink={movie.trailerLink}
                  />
                ))
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {isLoading ? (
                <div className="col-span-full w-full">
                  <Loading />
                </div>
              ) : (
                (listMovies || []).map((movie) => (
                  <CardItemFilm
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    genres={movie.genres}
                    duration={movie.duration}
                    isUpcoming={true}
                    releaseDate={movie.releaseDate}
                    age={movie.age}
                    img={movie.posterImage}
                    trailerLink={movie.trailerLink}
                  />
                ))
              )}
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};
export default MovieComponent;
