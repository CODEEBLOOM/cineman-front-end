import React from 'react';
import RenderSeat from './RenderSeat';
import { getSeatRowLabel } from '@utils/seatPosition';

const SeatMapRenderer = React.memo(
  ({ ticketMap, showTime, message, sendMessageChooseSeat }) => {
    if (!ticketMap.size) return null;

    const theater = showTime?.cinemaTheater;
    if (!theater) return null;

    const totalSeatRows =
      theater.regularSeatRow + theater.vipSeatRow + theater.doubleSeatRow;
    const maxSeatRows = Math.min(theater.numberOfRows ?? 0, totalSeatRows);
    const allSeats = [];

    for (let row = 1; row <= maxSeatRows; row++) {
      const isDoubleRow =
        row > theater.regularSeatRow + theater.vipSeatRow;

      allSeats.push(
        <div
          className="flex min-h-[64px] items-center justify-center"
          key={getSeatRowLabel(row)}
        >
          <span className="text-sm font-bold tracking-[0.08em] text-slate-500">
            {getSeatRowLabel(row)}
          </span>
        </div>
      );

      for (let col = 1; col <= theater.numberOfColumns; col++) {
        const seatKey = `${row}-${col}`;
        const ticket = ticketMap.get(seatKey);

        if (!ticket) {
          allSeats.push(
            <div
              className={`min-h-[64px] min-w-[58px] ${isDoubleRow ? 'col-span-2' : 'col-span-1'}`}
              key={seatKey}
            />
          );

          if (isDoubleRow) {
            col++;
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
