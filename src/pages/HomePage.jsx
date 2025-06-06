import Carousel from '@component/Carousel';
import Header from '@component/headers/Header';

const HomePage = () => {
  const slides = [
    'img-banner-01.png',
    'img-banner-02.png',
    'img-banner-03.png',
  ];
  return (
    <>
      <Header />
      <Carousel slides={slides} autoSlide={true} autoSlideInterval={2000} />
    </>
  );
};
export default HomePage;
