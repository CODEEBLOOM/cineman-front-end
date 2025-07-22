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

  /**
   * Hàm dùng để lấy ra loại ghế theo rowIndex
   * @param {number} rowIndex chỉ số hàng
   * @returns {string} The seat type (REGULAR (0 - (vip-1)), VIP(double - 1), DOUBLE)
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

  // Hàm render giao diện ghế theo hàng //
  const renderSeatRows = () => {
    const rows = [];
    for (let row = 0; row < cinemaTheater.numberOfRows; row++) {
      if (
        row >=
        cinemaTheater.regularSeatRow +
          cinemaTheater.vipSeatRow +
          cinemaTheater.doubleSeatRow
      ) {
        break;
      }
      const cols = [];
      const isSeatDouble =
        row >= cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow;
      for (let col = 0; col < cinemaTheater.numberOfColumn; col++) {
        if (isSeatDouble && col === cinemaTheater.numberOfColumn - 1) {
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

  // return render seat rows //
  return (
    <div className="overflow-x-scroll">
      <div className="mx-auto w-fit">
        <div className="mx-auto mb-20 ml-[30px] w-full rounded-md bg-gray-400 py-3 text-center shadow-lg">
          <p className="font-medium uppercase">màn hình rạp chiếu</p>
        </div>
        <div
          className="mx-auto grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cinemaTheater.numberOfColumn + (cinemaTheater.status === 'PUBLISHED' ? 1 : 3)}, 60px)`,
            width: 'fit-content',
          }}
        >
          {renderSeatRows()}
        </div>
      </div>
    </div>
  );
};
export default SeatGrid;
