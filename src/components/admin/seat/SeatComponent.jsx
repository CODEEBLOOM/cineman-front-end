import { changeStatusSeat, create, deleteSeat } from '@apis/seatService';
import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { RxCross1 } from 'react-icons/rx';
const SeatComponent = ({
  seat,
  cinemaTheaterId,
  setEmptySeats,
  setValidSeats,
  status = 'DRAFT',
}) => {
  const [idSeat, setIdSeat] = useState(null);
  const [statusSeat, setStatusSeat] = useState(seat.status);
  const [currSeat, setCurrSeat] = useState(null);

  useEffect(() => {
    const id = seat.id ? seat.id : null;
    setIdSeat(id);
  }, [seat]);

  /* Hàm xử lý cập nhật danh sách ghế trống theo hàng  */
  const handleUpdateEmptySeats = (isPush) => {
    if (isPush) {
      setEmptySeats((prev) => {
        // Xoá phần tử cũ
        const seatEmpty = {
          seatType:
            typeof seat.seatType === 'string'
              ? seat.seatType
              : seat.seatType.id,
          rowIndex: seat.rowIndex,
          columnIndex: seat.columnIndex,
          id: null,
        };
        return [...prev, seatEmpty];
      });
    } else {
      setEmptySeats((prev) => {
        // Xoá phần tử cũ
        const filtered = prev.filter(
          (s) =>
            !(
              s.rowIndex === seat.rowIndex && s.columnIndex === seat.columnIndex
            )
        );
        return filtered;
      });
    }
  };

  /**
   * Hàm xử lý chọn ghế: Có ghế thì -> xóa đi; không có thì tạo mới
   * @param {Object} seat thông tin ghế cần tạo
   */
  const handleChooseSeat = async () => {
    /* Nếu ghế đã có và rạp chiếu đã được xuất bản */
    if (status === 'PUBLISHED') {
      if (idSeat) {
        const res = await changeStatusSeat(idSeat);
        if (res.status === 200) {
          setStatusSeat(res.data.status);
          return;
        }
      } else {
        return;
      }
    }
    const label =
      String.fromCharCode(65 + seat.rowIndex) + (seat.columnIndex + 1);
    // If a seat is already chosen, delete it
    if (idSeat) {
      deleteSeat(idSeat)
        .then((res) => {
          if (res.status === 200) {
            setIdSeat(null);
            setCurrSeat({
              seatType:
                typeof seat.seatType === 'string'
                  ? seat.seatType
                  : seat.seatType.id,
              rowIndex: seat.rowIndex,
              columnIndex: seat.columnIndex,
              label,
              cinemaTheaterId,
            });
            handleUpdateEmptySeats(true);
            setValidSeats((prev) => {
              const filtered = prev.filter(
                (s) =>
                  !(
                    s.rowIndex === seat.rowIndex &&
                    s.columnIndex === seat.columnIndex
                  )
              );
              return [...filtered];
            });
          }
        })
        .catch((err) => console.error('Error deleting seat:', err));
      return;
    }

    // Create a new seat if no seat is currently chosen
    const data = currSeat ? currSeat : { ...seat, cinemaTheaterId, label };
    create(data)
      .then((res) => {
        if (res.data && res.status === 200) {
          setIdSeat(res.data.id);
          handleUpdateEmptySeats(false);
          setValidSeats((prev) => {
            const filtered = prev.filter(
              (s) =>
                !(
                  s.rowIndex === seat.rowIndex &&
                  s.columnIndex === seat.columnIndex
                )
            );
            return [...filtered, res.data];
          });
        }
      })
      .catch((err) => console.error('Error creating seat:', err));
  };

  const seatType =
    typeof seat.seatType === 'string' ? seat.seatType : seat.seatType.id;
  const renderIcon = () => {
    if (!idSeat) {
      if (status === 'PUBLISHED') {
        return null;
      } else {
        return <FiPlusCircle size={20} color="gray" />;
      }
    }

    switch (seatType) {
      case 'REGULAR':
        return (
          <div className="relative">
            <RegularSeat />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-950">
              <p>{seat.label}</p>
            </div>
            {statusSeat === 'INACTIVE' && (
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <RxCross1 size={35} color="red" />
              </div>
            )}
          </div>
        );
      case 'DOUBLE':
        return (
          <div className="relative">
            <div className="flex">
              <DoubleSeat />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-950">
              <p>{seat.label}</p>
            </div>
            {statusSeat === 'INACTIVE' && (
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <RxCross1 size={35} color="red" />
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="relative">
            <VIPSeat />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-950">
              <p>{seat.label}</p>
            </div>
            {statusSeat === 'INACTIVE' && (
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <RxCross1 size={35} color="red" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div
        key={seat.label}
        onClick={() => handleChooseSeat()}
        className={`flex h-[60px] w-full ${status === 'PUBLISHED' && idSeat !== null ? 'cursor-pointer' : status === 'PUBLISHED' ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-center border p-3 ${seatType === 'REGULAR' ? 'bg-[#fbf5e7]' : seatType === 'DOUBLE' ? 'col-span-2 bg-red-200' : 'bg-[#fbfdfc]'} ${status === 'PUBLISHED' ? '!border-none !bg-white !p-0' : ''}`}
      >
        {renderIcon()}
      </div>
    </>
  );
};
export default SeatComponent;
