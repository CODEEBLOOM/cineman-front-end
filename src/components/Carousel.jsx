import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ slides, autoSlide = false, autoSlideInterval = 3000 }) => {
  const intervalRef = useRef(null);

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoSlide) {
      intervalRef.current = setInterval(() => {
        setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
      }, autoSlideInterval);
    }
  };
  const [curr, setCurr] = useState(1);
  const prev = () => {
    setCurr((curr) => (curr === 0 ? slides.length - 1 : --curr));
    resetInterval();
  };

  const next = () => {
    setCurr((curr) => (curr === slides.length - 1 ? 0 : ++curr));
    resetInterval();
  };

  useEffect(() => {
    resetInterval(); // khởi động interval ban đầu
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSlide, autoSlideInterval, slides.length]);
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <img key={index} src={slide} alt="" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-5">
        <button
          className="rounded-full bg-slate-200 p-3 text-gray-800 shadow hover:bg-white"
          onClick={prev}
        >
          <FaChevronLeft size={35} />
        </button>
        <button
          className="rounded-full bg-slate-200 p-3 text-gray-800 shadow hover:bg-white"
          onClick={next}
        >
          <FaChevronRight size={35} />
        </button>
      </div>
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full bg-white p-2 transition-all ${curr === i ? 'p-2' : 'bg-opacity-50'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Carousel;
