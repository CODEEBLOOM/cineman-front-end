import React from 'react';
import RenderSeat from './RenderSeat';

const SeatMapRenderer = React.memo(
  ({ ticketMap, showTime, message, sendMessageChooseSeat }) => {
    if (!ticketMap.size) return null;

    const theater = showTime?.cinemaTheater;
    if (!theater) return null;

    const allSeats = [];

    for (let row = 0; row < theater.numberOfRows; row++) {
      if (
        row >=
        theater.regularSeatRow + theater.vipSeatRow + theater.doubleSeatRow
      ) {
        break;
      }

      // Hiển thị tên hàng (A, B, C,...)
      allSeats.push(
        <div
          className="flex items-center justify-center"
          key={String.fromCharCode(65 + row)}
        >
          {String.fromCharCode(65 + row)}
        </div>
      );

      for (let col = 0; col < theater.numberOfColumns; col++) {
        const seatKey = `${row}-${col}`;
        const ticket = ticketMap.get(seatKey);

        if (!ticket) {
          allSeats.push(
            <div
              className={`h-[60px] w-[60px] bg-white ${row >= theater.regularSeatRow + theater.vipSeatRow ? 'col-span-2' : ''}`}
              key={seatKey}
            />
          );
          if (row >= theater.regularSeatRow + theater.vipSeatRow) {
            col++; // ghế đôi
          }
          continue;
        }

        if (ticket.seat.seatType.id === 'DOUBLE') {
          col++;
        }

        allSeats.push(
          <RenderSeat
            key={seatKey}
            ticket={ticket}
            cinemaTheater={theater}
            message={message}
            sendMessageChooseSeat={sendMessageChooseSeat}
          />
        );
      }
    }

    return allSeats;
  }
);

export default SeatMapRenderer;
