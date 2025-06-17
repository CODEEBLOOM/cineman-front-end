import Carousel from '@component/Carousel';
import Header from '@component/headers/Header';
import { useMediaQuery, useTheme } from '@mui/material';
import Footer from '@component/Footer';
import MovieComponent from '@component/MovieComponent';

const HomePage = () => {
  const theme = useTheme();
  const isIpad = useMediaQuery(theme.breakpoints.up('lg'));

  const slides = [
    'img-banner-01.png',
    'img-banner-02.png',
    'img-banner-03.png',
  ];

  return (
    <>
      <Header />
      {isIpad && (
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={4000} />
      )}
      <MovieComponent />
      <Footer />
    </>
  );
};
export default HomePage;
