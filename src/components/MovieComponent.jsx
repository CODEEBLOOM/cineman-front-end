import { findAllMovies } from '@apis/movieService';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import CardItemFilm from './CardItemFilm';
import TabPanel from './Tabpanel';
import { useDispatch, useSelector } from 'react-redux';
import { setMovieStatus } from '@redux/slices/movieSlice.js';

const MovieComponent = () => {
  const { movieStatus } = useSelector((state) => state.movie);
  const [value, setValue] = useState(
    movieStatus === 'SC' ? 0 : movieStatus === 'DB' ? 2 : 1
  );

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
  /**
   * lấy tất cả bộ phim
   */
  useEffect(() => {
    findAllMovies({ page: 0, size: 10, status: movieStatus }).then((res) => {
      setListMovies(res.data.movies);
    });
  }, [movieStatus]);

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
              {(listMovies || []).map((movie) => (
                <CardItemFilm
                  key={movie.movieId}
                  id={movie.movieId}
                  title={movie.title}
                  genres={movie.genres}
                  duration={movie.duration}
                  isUpcoming={true}
                  releaseDate={movie.releaseDate}
                  age={movie.age}
                  img={'film-01.jpg'}
                  trailerLink={'#1'}
                />
              ))}
              {/* Phần card items */}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(listMovies || []).map((movie) => (
                <CardItemFilm
                  key={movie.movieId}
                  id={movie.movieId}
                  title={movie.title}
                  genres={movie.genres}
                  duration={movie.duration}
                  isUpcoming={true}
                  releaseDate={movie.releaseDate}
                  age={movie.age}
                  img={'film-01.jpg'}
                  trailerLink={'#1'}
                />
              ))}
              {/* Phần card items */}
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(listMovies || []).map((movie) => (
                <CardItemFilm
                  key={movie.movieId}
                  id={movie.movieId}
                  title={movie.title}
                  genres={movie.genres}
                  duration={movie.duration}
                  isUpcoming={true}
                  releaseDate={movie.releaseDate}
                  age={movie.age}
                  img={'film-01.jpg'}
                  trailerLink={'#1'}
                />
              ))}
              {/* Phần card items */}
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};
export default MovieComponent;
