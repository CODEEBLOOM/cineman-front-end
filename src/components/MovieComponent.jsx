import { findAllByFilter } from '@apis/movieService';
import { Box, Pagination, Tab, Tabs } from '@mui/material';
import Loading from '@component/Loading';
import { setMovieStatus } from '@redux/slices/movieSlice.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardItemFilm from './CardItemFilm';
import EmptyList from './cinema_showtime/EmptyList';
import TabPanel from './Tabpanel';

const MOVIE_TABS = [
  { label: 'Phim sắp chiếu', status: 'SC' },
  { label: 'Phim đang chiếu', status: 'DC' },
  { label: 'Xuất chiếu đặc biệt', status: 'DB' },
];

const movieTabSx = {
  minHeight: { xs: 48, md: 56 },
  px: { xs: 1.25, md: 2 },
  py: 0.5,
  minWidth: 'auto',
  color: '#334155',
  fontSize: { xs: '14px', md: '15px' },
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: '#23486c',
  },
  '&:hover': {
    color: '#23486c',
    backgroundColor: 'transparent',
  },
};

const MovieComponent = () => {
  const { movieStatus } = useSelector((state) => state.movie);
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { id: null }
  );
  const [pageActive, setPageActive] = useState(1);
  const [meta, setMeta] = useState({
    currentPage: 0,
    pageSize: 8,
    totalPages: 0,
    totalElements: 0,
  });
  const [value, setValue] = useState(
    movieStatus === 'SC' ? 0 : movieStatus === 'DB' ? 2 : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [listMovies, setListMovies] = useState([]);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPageActive(1);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const handleChangeMovieStatus = (status) => {
    dispatch(setMovieStatus(status));
  };

  /* Lấy tất cả thông tin phim theo status và movie theater id */
  useEffect(() => {
    if (movieTheater?.id) {
      setIsLoading(true);
      findAllByFilter({
        page: pageActive - 1,
        size: meta.pageSize,
        status: movieStatus,
        movieTheaterId: movieTheater.id,
      })
        .then((res) => {
          setListMovies(res.data.movies);
          setMeta(res.data.meta);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieStatus, movieTheater, pageActive]);

  const handleChangePage = (event, newPage) => {
    setPageActive(newPage);
  };

  return (
    <div className="container">
      <div className="mt-10 text-center">
        <Box sx={{ width: '100%' }}>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Danh sách phim"
              sx={{
                minHeight: { xs: 48, md: 56 },
                borderBottom: '1px solid rgba(203,213,225,0.8)',
                '.MuiTabs-flexContainer': {
                  justifyContent: 'center',
                  gap: { xs: 0.5, md: 2 },
                  overflowX: 'auto',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                },
                '.MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 999,
                  backgroundColor: '#2d5f8d',
                },
              }}
            >
              {MOVIE_TABS.map((tab, index) => (
                <Tab
                  key={tab.status}
                  onClick={() => handleChangeMovieStatus(tab.status)}
                  label={tab.label}
                  sx={movieTabSx}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>

          {listMovies.length === 0 && !isLoading && (
            <div className="col-span-full w-full">
              <EmptyList content="Danh sách trống" />
            </div>
          )}

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

          <Box className="py-3">
            {!isLoading && (
              <Pagination
                onChange={handleChangePage}
                sx={{ justifyContent: 'center', display: 'flex' }}
                size="large"
                count={meta.totalPages}
                page={meta.currentPage + 1}
                variant="outlined"
                shape="rounded"
                color="primary"
              />
            )}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default MovieComponent;
