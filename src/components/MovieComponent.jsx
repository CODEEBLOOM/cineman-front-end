import { findAllByFilter } from '@apis/movieService';
import { Box, CircularProgress, Skeleton, Tab, Tabs } from '@mui/material';
import { setMovieStatus } from '@redux/slices/movieSlice.js';
import { useEffect, useRef, useState } from 'react';
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
    color: '#083d7c',
  },
  '&:hover': {
    color: '#083d7c',
    backgroundColor: 'transparent',
  },
};

const MovieCardSkeleton = ({ showReleaseDate = false, showButton = false }) => (
  <div className="mb-3 flex w-full gap-5 px-4 pb-4 sm:block">
    <div className="w-full min-w-[120px] max-w-[150px] sm:max-w-[300px]">
      <div className="relative aspect-[235/372] overflow-hidden rounded-[26px]">
        <Skeleton
          variant="rounded"
          sx={{
            width: '100%',
            height: '100%',
            transform: 'none',
            borderRadius: '26px',
          }}
        />
      </div>
    </div>

    <div className="flex-1">
      <div className="text-left">
        <Skeleton variant="text" width="72%" height={38} />
        <Skeleton variant="text" width="92%" height={28} />
        <Skeleton variant="text" width="58%" height={28} />
        {showReleaseDate && <Skeleton variant="text" width="64%" height={28} />}
      </div>

      {showButton && (
        <Skeleton
          variant="rounded"
          width={132}
          height={40}
          sx={{ mt: 2, borderRadius: '999px' }}
        />
      )}
    </div>
  </div>
);

const PAGE_SIZE = 8;

const MovieComponent = () => {
  const { movieStatus } = useSelector((state) => state.movie);
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { id: null }
  );
  const [pageActive, setPageActive] = useState(0);
  const [meta, setMeta] = useState({
    currentPage: 0,
    pageSize: PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
  });
  const [value, setValue] = useState(
    movieStatus === 'SC' ? 0 : movieStatus === 'DB' ? 2 : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [listMovies, setListMovies] = useState([]);
  const sentinelRef = useRef(null);
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const handleChangeMovieStatus = (status) => {
    dispatch(setMovieStatus(status));
  };

  /* Reset danh sách khi đổi tab hoặc đổi rạp */
  useEffect(() => {
    setPageActive(0);
    setListMovies([]);
    setMeta({
      currentPage: 0,
      pageSize: PAGE_SIZE,
      totalPages: 0,
      totalElements: 0,
    });
  }, [movieStatus, movieTheater?.id]);

  /* Lấy thông tin phim theo status, movie theater id và page hiện tại */
  useEffect(() => {
    if (!movieTheater?.id) return;
    let cancelled = false;
    const isFirstPage = pageActive === 0;
    if (isFirstPage) setIsLoading(true);
    else setIsLoadingMore(true);

    findAllByFilter({
      page: pageActive,
      size: PAGE_SIZE,
      status: movieStatus,
      movieTheaterId: movieTheater.id,
    })
      .then((res) => {
        if (cancelled) return;
        setListMovies((prev) =>
          isFirstPage ? res.data.movies : [...prev, ...res.data.movies]
        );
        setMeta(res.data.meta);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
        setIsLoadingMore(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movieStatus, movieTheater?.id, pageActive]);

  /* Infinite scroll: khi sentinel xuất hiện gần cuối viewport thì tăng page */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const hasMore = pageActive + 1 < meta.totalPages;
        if (
          entry.isIntersecting &&
          hasMore &&
          !isLoading &&
          !isLoadingMore
        ) {
          setPageActive((prev) => prev + 1);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, pageActive, meta.totalPages]);

  const renderMovieSkeletons = (options = {}) =>
    Array.from({ length: PAGE_SIZE }, (_, index) => (
      <MovieCardSkeleton key={`movie-skeleton-${value}-${index}`} {...options} />
    ));

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
                  backgroundColor: '#0a4d9c',
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
                renderMovieSkeletons({ showReleaseDate: true })
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
                renderMovieSkeletons({ showButton: true })
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
                renderMovieSkeletons({ showReleaseDate: true })
              ) : (
                (listMovies || []).map((movie) => (
                  <CardItemFilm
                    key={movie.movieId}
                    id={movie.movieId}
                    title={movie.title}
                    genres={movie.genres}
                    duration={movie.duration}
                    isUpcoming={true}
                    showBuyButton={movie.status === 'DC'}
                    releaseDate={movie.releaseDate}
                    age={movie.age}
                    img={movie.posterImage}
                    trailerLink={movie.trailerLink}
                  />
                ))
              )}
            </div>
          </TabPanel>

          <Box
            ref={sentinelRef}
            className="py-3"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: 48,
            }}
          >
            {isLoadingMore && <CircularProgress size={28} />}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default MovieComponent;
