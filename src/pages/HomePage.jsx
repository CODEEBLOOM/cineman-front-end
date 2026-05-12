import Carousel from '@component/Carousel';
import { useMediaQuery, useTheme } from '@mui/material';
import MovieComponent from '@component/MovieComponent';
import { useEffect } from 'react';

const HomePage = () => {
  const theme = useTheme();
  const isIpad = useMediaQuery(theme.breakpoints.up('lg'));

  const slides = [
    'img-banner-07.webp',
    'img-banner-08.webp',
    'img-banner-03.webp',
    'img-banner-04.webp',
    'img-banner-05.webp',
    'img-banner-06.webp',
  ];

  // Set document title
  useEffect(() => {
    document.title = 'Poly Cinemas - Trang chủ';
  }, []);

  return (
    <>
      {isIpad && (
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={4000} />
      )}
      <MovieComponent />
    </>
  );
};
export default HomePage;
