import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ slides = [], autoSlide = false, autoSlideInterval = 3000 }) => {
  const intervalRef = useRef(null);
  const [curr, setCurr] = useState(0);

  const slideCount = Array.isArray(slides) ? slides.length : 0;

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoSlide && slideCount > 1) {
      intervalRef.current = setInterval(() => {
        setCurr((current) => (current === slideCount - 1 ? 0 : current + 1));
      }, autoSlideInterval);
    }
  };

  const prev = () => {
    if (slideCount <= 1) {
      return;
    }

    setCurr((current) => (current === 0 ? slideCount - 1 : current - 1));
    resetInterval();
  };

  const next = () => {
    if (slideCount <= 1) {
      return;
    }

    setCurr((current) => (current === slideCount - 1 ? 0 : current + 1));
    resetInterval();
  };

  const goToSlide = (index) => {
    setCurr(index);
    resetInterval();
  };

  useEffect(() => {
    if (curr > slideCount - 1) {
      setCurr(0);
    }
  }, [curr, slideCount]);

  useEffect(() => {
    resetInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoSlide, autoSlideInterval, slideCount]);

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto w-full overflow-hidden bg-slate-950">
      <div className="relative aspect-[21/8] min-h-[220px] w-full max-w-none sm:min-h-[280px] lg:min-h-[360px] 2xl:min-h-[420px]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full min-w-full overflow-hidden">
              <img
                src={slide}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
            </div>
          ))}
        </div>

        {slideCount > 1 ? (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-5 lg:px-8">
              <button
                type="button"
                aria-label="Slide trước"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/55 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
                onClick={prev}
              >
                <FaChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Slide tiếp theo"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/55 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
                onClick={next}
              >
                <FaChevronRight size={18} />
              </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex items-center justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Chuyển đến slide ${index + 1}`}
                    className={`rounded-full transition-all ${
                      curr === index
                        ? 'h-2.5 w-8 bg-white'
                        : 'h-2.5 w-2.5 bg-white/55 hover:bg-white/75'
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Carousel;
