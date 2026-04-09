import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { findAllShowTimeByMovieIdAndMovieTheaterId } from '@apis/showTimeService';
import { parse } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import ShowTimeDetail from './ShowTimeDetail';

const formatWeekdayLabel = (dateValue) => {
  const weekday = dateValue.getDay();

  if (weekday === 0) {
    return 'Chủ nhật';
  }

  return `Thứ ${weekday + 1}`;
};

const formatDateFilterLabel = (dateValue) => {
  const weekdayLabel = formatWeekdayLabel(dateValue);
  const day = String(dateValue.getDate()).padStart(2, '0');
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');

  return `${weekdayLabel} - ${day}/${month}`;
};

const ShowTimeComponent = ({ movieId }) => {
  const [showTimeSelected, setShowTimeSelected] = useState();
  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { id: null }
  );

  useEffect(() => {
    if (!movieId || !movieTheater?.id) {
      setShowTimes([]);
      setShowTimeSelected(undefined);
      return;
    }

    setIsLoading(true);
    findAllShowTimeByMovieIdAndMovieTheaterId({
      movieId,
      movieTheaterId: movieTheater.id,
    })
      .then((res) => {
        const seen = new Set();
        const nextShowTimes = [];

        if (!res?.data) {
          setShowTimes([]);
          setShowTimeSelected(undefined);
          return;
        }

        for (const item of res.data) {
          if (!seen.has(item.showDate)) {
            seen.add(item.showDate);
            nextShowTimes.push({
              showDate: item.showDate,
              id: item.id,
            });
          }
        }

        setShowTimes(nextShowTimes);
        setShowTimeSelected(nextShowTimes[0]);
      })
      .catch((error) => {
        console.log(error);
        setShowTimes([]);
        setShowTimeSelected(undefined);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [movieId, movieTheater?.id]);

  const showTimeOptions = useMemo(() => {
    return (showTimes || []).map((showTime) => ({
      ...showTime,
      parsedDate: parse(showTime.showDate, 'yyyy-MM-dd', new Date()),
    }));
  }, [showTimes]);

  if (isLoading) {
    return <Loading content="Đang tải lịch chiếu..." />;
  }

  if (showTimeOptions.length === 0) {
    return <div></div>;
  }

  return (
    <section className="my-8 rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Lịch chiếu
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
          Chọn ngày để xem suất chiếu theo phòng
        </h2>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {showTimeOptions.map((showTime) => {
          const isActive = showTimeSelected?.id === showTime.id;

          return (
            <button
              type="button"
              key={showTime.id}
              onClick={() => setShowTimeSelected(showTime)}
              className={`rounded-full border px-7 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                  : 'border-[#9fc7f0] bg-white text-[#2d78bf] hover:border-primary hover:text-primary'
              }`}
            >
              {formatDateFilterLabel(showTime.parsedDate)}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <ShowTimeDetail showTimeSelected={showTimeSelected} movieId={movieId} />
      </div>
    </section>
  );
};

export default ShowTimeComponent;
