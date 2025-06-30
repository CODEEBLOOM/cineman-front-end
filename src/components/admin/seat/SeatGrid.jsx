import SeatComponent from './SeatComponent';

const SeatGrid = ({ seats = [], cinemaTheater = {} }) => {
  const seatMap = new Map();
  seats.forEach((seat) => {
    const key = `${seat.rowIndex}-${seat.columnIndex}`;
    seatMap.set(key, seat);
  });

  /**
   * Gets the seat type based on the row index.
   * @param {number} rowIndex
   * @returns {string} The seat type (REGULAR, VIP, DOUBLE)
   */
  const getSeatTypeByRow = (rowIndex) => {
    if (rowIndex < cinemaTheater.regularSeatRow) {
      return 'REGULAR';
    } else if (
      rowIndex <
      cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow
    ) {
      return 'VIP';
    } else {
      return 'DOUBLE';
    }
  };
  return (
    <div
      className="mx-auto grid gap-1"
      style={{
        gridTemplateColumns: `repeat(${cinemaTheater.numberOfColumn + 1}, 60px)`,
        width: 'fit-content',
      }}
    >
      {Array.from({ length: cinemaTheater.numberOfRows }).flatMap((_, row) =>
        Array.from({ length: cinemaTheater.numberOfColumn + 1 }).map(
          (_, col) => {
            // Nếu là cột đầu tiên (col === 0) → render label hàng
            if (col === 0) {
              return (
                <div
                  key={`label-${row}`}
                  className="flex items-center justify-center text-sm font-bold"
                >
                  {String.fromCharCode(65 + row)}
                </div>
              );
            }

            // Còn lại: render ghế như bình thường
            const actualCol = col - 1;
            const seatKey = `${row}-${actualCol}`;
            const seat = seatMap.get(seatKey);

            const seatData = seat ?? {
              seatType: getSeatTypeByRow(row),
              rowIndex: row,
              columnIndex: actualCol,
              id: null,
            };

            // Nếu là ghế đôi (ở hàng dưới cùng)
            if (
              row >=
              cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow
            ) {
              if (actualCol % 2 !== 0) {
                return (
                  <SeatComponent
                    key={seatKey}
                    seat={seatData}
                    cinemaTheaterId={cinemaTheater.cinemaTheaterId}
                  />
                );
              } else {
                // giữ chỗ , không render ghế
                if (actualCol === cinemaTheater.numberOfColumn - 1) {
                  return (
                    <div className="h-[60px] w-[60px]" key={seatKey}></div>
                  );
                } else return;
              }
            }

            return (
              <SeatComponent
                key={seatKey}
                seat={seatData}
                cinemaTheaterId={cinemaTheater.cinemaTheaterId}
              />
            );
          }
        )
      )}
    </div>
  );
};
export default SeatGrid;
