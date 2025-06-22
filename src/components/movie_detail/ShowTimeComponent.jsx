import React from 'react';
import { parse } from 'date-fns';

const ShowTimeComponent = ({ active, setActive, showTimes = [] }) => {
  const handleChangeShowTime = (id) => {
    setActive(id);
  };

  return (
    <div className={'container mb-2'}>
      <ul className="flex flex-wrap justify-between gap-3 border-b-2">
        {showTimes.map((showTime) => {
          const dateShowTime = parse(showTime?.date, 'yyyy-MM-dd', new Date());
          return (
            <li
              key={showTime?.id}
              className={`${active === showTime?.id ? 'border-b-2 border-b-primary' : ''}`}
              onClick={() => setActive(showTime?.id)}
            >
              <a
                href="#1"
                className={`${active === showTime?.id ? 'text-primary' : ''} font-bold`}
              >
                <span className={'text-[35px]'}>{dateShowTime.getDate()}</span>
                <span>{`/${dateShowTime.getMonth() + 1} - ${dateShowTime.getDay() === 0 ? 'CN' : `T${dateShowTime.getDay() + 1}`}`}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowTimeComponent;
