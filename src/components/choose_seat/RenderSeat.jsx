import VIPSeat from '@component/seat/VIPSeat';
import RegularSeat from '@component/seat/RegularSeat';
import DoubleSeat from '@component/seat/DoubleSeat';
import { COLOR_SEAT } from '@utils/colorSeatConstant';

const RenderSeat = ({
  ticket,
  cinemaTheater,
  message,
  sendMessageChooseSeat,
}) => {
  const render = () => {
    const colorSeat = () => {
      if (ticket.status) {
        switch (ticket.status) {
          case 'SELECTED':
            return COLOR_SEAT.SEAT_SELECTED;
          case 'HOLDED':
            return COLOR_SEAT.SEAT_HOLDED;
          case 'SOLD':
            return COLOR_SEAT.SEAT_SOLD;
          case 'BOOKED':
            return COLOR_SEAT.SEAT_BOOKED;
          default:
            return COLOR_SEAT.SEAT_EMPTY;
        }
      } else {
        return COLOR_SEAT.SEAT_EMPTY;
      }
    };

    /* Check ghế đang không hoạt động tạm thời tại rạp */
    if (ticket.seat.status === 'INACTIVE') {
      return (
        <>
          <div className="h-[60px] w-[60px] bg-white"></div>
        </>
      );
    }
    if (ticket.seat.rowIndex < cinemaTheater.regularSeatRow) {
      return (
        <>
          <RegularSeat size={'50px'} color={colorSeat()} />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
            {ticket.seat.label}
          </div>
        </>
      );
    } else if (
      ticket.seat.rowIndex <
      cinemaTheater.regularSeatRow + cinemaTheater.vipSeatRow
    ) {
      return (
        <>
          <VIPSeat size={'50px'} color={colorSeat()} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {ticket.seat.label}
          </div>
        </>
      );
    } else {
      return (
        <>
          <DoubleSeat size={'70px'} color={colorSeat()} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {ticket.seat.label}
          </div>
        </>
      );
    }
  };

  /* Handle choose seat */
  const handleChooseSeat = () => {
    // chỉ xử lý các trường hợp của chính người đang chọn ghế:
    // Nghĩa là những ghế trống --> người dùng có thể chọn để đặt vé
    // Ghế đã chọn --> hủy chọn vé
    if (
      ticket.seat.status === 'INACTIVE' ||
      ticket.status === 'HOLDED' ||
      ticket.status === 'SOLD' ||
      ticket.status === 'BOOKED'
    )
      return;
    // TODO: xử lý api đặt vé của người dùng
    const newMessage = {
      ...message,
      content: {
        ...message.content,
        seatId: ticket.seat.id,
      },
      ticketId: ticket.id,
    };
    sendMessageChooseSeat(newMessage);
  };
  return (
    <>
      <div
        className={`${ticket?.seat?.seatType?.id === 'DOUBLE' ? 'col-span-2' : ''} flex justify-center hover:cursor-pointer ${ticket.id ? 'hover:cursor-not-allowed' : ''} ${ticket.seat.status === 'INACTIVE' ? '!cursor-default' : ''} relative`}
        onClick={() => handleChooseSeat()}
      >
        {render()}
      </div>
    </>
  );
};
export default RenderSeat;
