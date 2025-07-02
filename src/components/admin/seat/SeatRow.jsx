import { MdOutlineDeleteSweep } from 'react-icons/md';
import SeatComponent from './SeatComponent';
import { GoPlus } from 'react-icons/go';
import { useEffect, useState } from 'react';
import { createMul, deleteMulSeat } from '@apis/seatService';

const SeatRow = ({ seatData = [], cinemaTheaterId, fetchSeatMap, status }) => {
  const [emptySeats, setEmptySeats] = useState([]);
  const [validSeats, setValidSeats] = useState([]);

  /**
   * Cập nhật danh sách ghế trống và đã tồn tại trong rạp chiếu
   * khi có sự thay đổi của seatDatav (fetch lại seatMap)
   */
  useEffect(() => {
    setEmptySeats(
      seatData.filter(
        (seat) =>
          seat.id === null &&
          typeof seat.seatType === 'string' &&
          seat.seatType !== null
      )
    );
    setValidSeats(
      seatData.filter((seat) => {
        return seat.id !== null;
      })
    );
  }, [seatData]);

  /* Hàm xử lý tạo hàng loạt ghế */
  const handleCreateMultipleSeat = () => {
    const createSeats = emptySeats.map((seat) => ({
      seatType: seat.seatType,
      rowIndex: seat.rowIndex,
      columnIndex: seat.columnIndex,
      label: String.fromCharCode(65 + seat.rowIndex) + (seat.columnIndex + 1),
      cinemaTheaterId,
    }));
    if (createSeats.length === 0) return;
    createMul(createSeats)
      .then((res) => {
        if (res.status === 200) {
          fetchSeatMap();
          setEmptySeats([]);
        }
      })
      .catch((err) => console.error(err));
  };

  /* Hàm xóa hàng loạt ghế */
  const handleDeleteMultipleSeat = () => {
    const ids = validSeats.map((seat) => seat.id);
    if (ids.length === 0) return;
    deleteMulSeat(ids)
      .then((res) => {
        if (res.status === 200) {
          fetchSeatMap();
        }
      })
      .catch((err) => console.error(err));
  };

  /* Hàm hành động render từng ghế */
  const renderSeat = () => {
    return seatData.map((seat) => {
      const key = `${seat.rowIndex}-${seat.columnIndex}`;
      if (seat.seatType === null) {
        return <div key={key} className="h-[60px] w-[60px]" />;
      }
      if (seat.id) {
        return (
          <SeatComponent
            key={key}
            seat={seat}
            cinemaTheaterId={cinemaTheaterId}
            emptySeats={emptySeats}
            setEmptySeats={setEmptySeats}
            setValidSeats={setValidSeats}
            status={status}
          />
        );
      } else {
        return (
          <SeatComponent
            key={key}
            seat={seat}
            cinemaTheaterId={cinemaTheaterId}
            emptySeats={emptySeats}
            setEmptySeats={setEmptySeats}
            setValidSeats={setValidSeats}
            status={status}
          />
        );
      }
    });
  };

  return (
    <>
      {
        // Render the row label
        <div className="flex items-center justify-center">
          {String.fromCharCode(65 + seatData[0].rowIndex)}
        </div>
      }

      {
        // Render the seat components
        renderSeat()
      }

      {
        // Render multiple action buttons
        status !== 'PUBLISHED' && (
          <>
            <button
              className="h-full w-full rounded-md bg-blue-400"
              onClick={handleCreateMultipleSeat}
            >
              <GoPlus size={25} className="mx-auto" />
            </button>
            <button
              className="h-full w-full rounded-md bg-red-400"
              onClick={handleDeleteMultipleSeat}
            >
              <MdOutlineDeleteSweep size={25} className="mx-auto" />
            </button>
          </>
        )
      }
    </>
  );
};
export default SeatRow;
