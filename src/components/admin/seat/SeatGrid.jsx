import SeatRow from './SeatRow';

const SeatGrid = ({ seats = [], cinemaTheater = {}, fetchSeatMap }) => {
  /**
   * Tạo map chứa những ghế đã tồn tại của rạp chiếu
   */
  const seatMap = new Map();
  seats.forEach((seat) => {
    const key = `${seat.rowIndex}-${seat.columnIndex}`;
    seatMap.set(key, seat);
  });

  const totalSeatRows =
    cinemaTheater.regularSeatRow +
    cinemaTheater.vipSeatRow +
    cinemaTheater.doubleSeatRow;
  const maxSeatRows = Math.min(cinemaTheater.numberOfRows ?? 0, totalSeatRows);

  /**
   * Hàm dùng để lấy ra loại ghế theo rowIndex
   * @param {number} rowIndex chỉ số hàng
   * @returns {string} The seat type (REGULAR, VIP, DOUBLE)
   */
  const getSeatTypeByRow = (rowIndex) => {
    if (rowIndex <= cinemaTheater.regularSeatRow) {
      return 'REGULAR';
    } else if (
      rowIndex <=
      cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow
    ) {
      return 'VIP';
    }
    return 'DOUBLE';
  };

  // Hàm render giao diện ghế theo hàng //
  const renderSeatRows = () => {
    const rows = [];

    for (let row = 1; row <= maxSeatRows; row++) {
      const cols = [];
      const isSeatDouble =
        row > cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow;

      for (let col = 1; col <= cinemaTheater.numberOfColumn; col++) {
        if (isSeatDouble && col === cinemaTheater.numberOfColumn) {
          cols.push({
            seatType: null,
            rowIndex: row,
            columnIndex: col,
            id: null,
          });
          continue;
        }

        const seatKey = `${row}-${col}`;
        const seat = seatMap.get(seatKey);
        const seatData = seat ?? {
          seatType: getSeatTypeByRow(row),
          rowIndex: row,
          columnIndex: col,
          id: null,
        };

        cols.push(seatData);
        if (isSeatDouble) col++;
      }

      rows.push(
        <SeatRow
          key={row}
          seatData={cols}
          cinemaTheaterId={cinemaTheater.cinemaTheaterId}
          status={cinemaTheater.status}
          fetchSeatMap={fetchSeatMap}
        />
      );
    }

    return rows;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-fit w-full">
        <div className="mb-20 w-full rounded-md bg-gray-400 py-3 text-center shadow-lg">
          <p className="font-medium uppercase">màn hình rạp chiếu</p>
        </div>
        <div className="flex w-full justify-center">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${cinemaTheater.numberOfColumn + (cinemaTheater.status === 'PUBLISHED' ? 1 : 3)}, minmax(60px, 1fr))`,
              width: '100%',
            }}
          >
            {renderSeatRows()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeatGrid;
