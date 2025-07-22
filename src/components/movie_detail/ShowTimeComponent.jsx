import React, { useEffect, useState } from 'react';
import { parse } from 'date-fns';
import { findAllShowTimeByMovieIdAndMovieTheaterId } from '@apis/showTimeService';
import { useSelector } from 'react-redux';
import ShowTimeDetail from './ShowTimeDetail';
import Loading from '@component/Loading';

const ShowTimeComponent = ({ movieId }) => {
  const [showTimeSelected, setShowTimeSelected] = useState();
  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { movieTheater } = useSelector((state) => state.movieTheater);

  useEffect(() => {
    setIsLoading(true);
    findAllShowTimeByMovieIdAndMovieTheaterId({
      movieId: movieId,
      movieTheaterId: movieTheater.id,
    })
      .then((res) => {
        const seen = new Set();
        const result = [];
        if (res.data === null) {
          setShowTimes([]);
          return;
        }
        for (const item of res.data) {
          if (!seen.has(item.showDate)) {
            seen.add(item.showDate);
            result.push({ showDate: item.showDate, id: item.id });
          }
        }
        setShowTimes(result);
        setShowTimeSelected(result[0]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [movieId, movieTheater.id]);

  /* Hàm thay đổi show time */
  const handleChangeShowTimeSelected = (id) => {
    setShowTimeSelected(id);
  };

  // Hiệu ứng loading khi vẫn còn gọi API //
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={'mb-2'}>
        <ul className="flex flex-wrap justify-start gap-10 border-b-2">
          {(showTimes || []).map((showTime) => {
            const dateShowTime = parse(
              showTime?.showDate,
              'yyyy-MM-dd',
              new Date()
            );
            return (
              <li
                key={showTime.id}
                className={`${showTimeSelected?.id === showTime?.id ? 'border-b-2 border-b-primary' : ''}`}
                onClick={() => handleChangeShowTimeSelected(showTime)}
              >
                <a
                  href="#1"
                  className={`${showTimeSelected?.id === showTime?.id ? 'text-primary' : ''} font-bold`}
                >
                  <span className={'text-[35px]'}>
                    {dateShowTime.getDate()}
                  </span>
                  <span>{`/${dateShowTime.getMonth() + 1} - ${dateShowTime.getDay() === 0 ? 'CN' : `T${dateShowTime.getDay() + 1}`}`}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <ShowTimeDetail showTimeSelected={showTimeSelected} movieId={movieId} />
    </>
  );
};

export default ShowTimeComponent;
