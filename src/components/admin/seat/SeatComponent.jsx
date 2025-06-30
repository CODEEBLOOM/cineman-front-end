import { create, deleteSeat } from '@apis/seatService';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { RiSofaFill } from 'react-icons/ri';
import EventSeatIcon from '@mui/icons-material/EventSeat';
const SeatComponent = ({ seat, cinemaTheaterId }) => {
  console.log(seat);
  const [idSeat, setIdSeat] = useState(seat.id ? seat.id : false);

  /**
   * Handles the seat selection process.
   * If a seat is already chosen, it deletes the existing seat.
   * Otherwise, it creates a new seat with the given data.
   * @param {Object} seat - The seat object containing seat details.
   */
  const handleChooseSeat = (seat) => {
    // eslint-disable-next-line no-unused-vars
    let { id, ...data } = seat;
    const label = String.fromCharCode(65 + seat.rowIndex) + seat.columnIndex;
    data = { ...data, label };

    // If a seat is already chosen, delete it
    if (idSeat) {
      deleteSeat(idSeat)
        .then((res) => {
          if (res.status === 200) {
            setIdSeat(false);
          }
        })
        .catch((err) => console.error('Error deleting seat:', err));
      return;
    }

    // Create a new seat if no seat is currently chosen
    create(data)
      .then((res) => {
        if (res.data && res.status === 200) {
          setIdSeat(res.data.id);
        }
      })
      .catch((err) => console.error('Error creating seat:', err));
  };

  /**
   * Render icon of seat base on seat type
   * if seat is not chosen, render a gray plus icon
   * if seat is chosen, render a icon base on seat type
   * @returns {React.ReactElement} icon of seat
   */
  const seatType =
    typeof seat.seatType === 'string' ? seat.seatType : seat.seatType.id;
  const renderIcon = () => {
    if (!idSeat) return <FiPlusCircle size={20} color="gray" />;
    switch (seatType) {
      case 'REGULAR':
        return <EventSeatIcon fontSize="large" />;
      case 'DOUBLE':
        return (
          <div className="flex">
            <RiSofaFill size={35} />
            <RiSofaFill size={35} />
          </div>
        );
      default:
        return <RiSofaFill size={35} />;
    }
  };
  return (
    <>
      <div
        key={seat.label}
        onClick={() => handleChooseSeat({ ...seat, cinemaTheaterId })}
        className={`flex h-[60px] w-full cursor-pointer items-center justify-center border p-3 ${seatType === 'REGULAR' ? 'bg-orange-200' : seatType === 'DOUBLE' ? 'col-span-2 bg-red-200' : 'bg-gray-300'}`}
      >
        {renderIcon()}
      </div>
    </>
  );
};
export default SeatComponent;
