import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DRAG_THRESHOLD_RATIO = 0.15;

const Carousel = ({ slides = [], autoSlide = false, autoSlideInterval = 3000 }) => {
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const dragStateRef = useRef({
    pointerId: null,
    startX: 0,
    width: 0,
    moved: false,
  });
  const [curr, setCurr] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

  const handlePointerDown = (event) => {
    if (slideCount <= 1) {
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      width: container.offsetWidth,
      moved: false,
    };

    try {
      container.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }

    setIsDragging(true);
    setDragOffset(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handlePointerMove = (event) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) {
      return;
    }

    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 3) {
      state.moved = true;
    }
    setDragOffset(delta);
  };

  const finishDrag = (event) => {
    const state = dragStateRef.current;
    if (state.pointerId !== event.pointerId) {
      return;
    }

    const container = containerRef.current;
    if (container && container.hasPointerCapture?.(event.pointerId)) {
      try {
        container.releasePointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    }

    const delta = event.clientX - state.startX;
    const width = state.width || 1;
    const threshold = width * DRAG_THRESHOLD_RATIO;

    dragStateRef.current = {
      pointerId: null,
      startX: 0,
      width: 0,
      moved: state.moved,
    };

    setIsDragging(false);
    setDragOffset(0);

    if (delta <= -threshold) {
      next();
    } else if (delta >= threshold) {
      prev();
    } else {
      resetInterval();
    }
  };

  const handleClickCapture = (event) => {
    if (dragStateRef.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragStateRef.current.moved = false;
    }
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
    <div
      ref={containerRef}
      className="relative mx-auto w-full touch-pan-y select-none overflow-hidden bg-slate-950"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClickCapture={handleClickCapture}
      style={{ cursor: slideCount > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      <div className="relative aspect-[21/8] min-h-[220px] w-full max-w-none sm:min-h-[280px] lg:min-h-[360px] 2xl:min-h-[420px]">
        <div
          className={`flex h-full ${isDragging ? '' : 'transition-transform duration-700 ease-out'}`}
          style={{
            transform: `translate3d(calc(-${curr * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full min-w-full overflow-hidden">
              <img
                src={slide}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
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
