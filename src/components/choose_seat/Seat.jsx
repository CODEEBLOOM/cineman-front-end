import React from 'react';

const Seat = ({ seat = {}, setChooseSeat }) => {
  const seatBgImg = `/seat-${seat.status}-${seat.type}.png`;

  return (
    <>
      <div
        onClick={() => setChooseSeat(seat)}
        style={{
          backgroundImage: `url(${seatBgImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
        className={`h-10 w-10 bg-[url('${seatBgImg}')] ${seat.status === 'process' || seat.status === 'unselect' ? 'cursor-pointer' : 'cursor-not-allowed'} flex select-none items-center justify-center bg-cover bg-center`}
      >
        {seat.seatCode}
      </div>
    </>
  );
};

export default Seat;
// /seat-unselect-normal
