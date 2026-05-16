import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { getSeatStyle } from './seatVisualConfig';

const padCol = (col) => String(col).padStart(2, '0');

const RenderSeat = ({ ticket, message, sendMessageChooseSeat }) => {
  const seatTypeId =
    typeof ticket?.seat?.seatType === 'string'
      ? ticket.seat.seatType
      : ticket?.seat?.seatType?.id;

  const isDoubleSeat = seatTypeId === 'DOUBLE';
  const isInactive = ticket.seat.status === 'INACTIVE';
  const isDisabled =
    isInactive ||
    ticket.status === 'HOLDED' ||
    ticket.status === 'SOLD' ||
    ticket.status === 'BOOKED';

  const style = getSeatStyle(ticket.status, seatTypeId);

  const handleChooseSeat = () => {
    if (isDisabled) return;
    sendMessageChooseSeat({
      ...message,
      content: { ...message.content, seatId: ticket.seat.id },
      ticketId: ticket.id,
    });
  };

  return (
    <div
      className={`${isDoubleSeat ? 'col-span-2' : 'col-span-1'} flex items-center justify-center`}
    >
      <button
        type="button"
        disabled={isDisabled && ticket.status !== 'SELECTED'}
        onClick={handleChooseSeat}
        className={`relative flex h-10 items-center justify-center gap-1 rounded-md border text-[13px] font-semibold transition ${
          isDoubleSeat ? 'w-full px-2' : 'min-w-[42px] px-2 md:min-w-[48px]'
        } ${
          isDisabled && ticket.status !== 'SELECTED'
            ? 'cursor-not-allowed'
            : 'cursor-pointer hover:-translate-y-[1px] hover:shadow-sm'
        } ${isInactive ? 'opacity-40' : ''}`}
        style={{
          backgroundColor: style.background,
          borderColor: style.border,
          color: style.text,
        }}
      >
        {style.showCheck && !isInactive && (
          <CheckRoundedIcon sx={{ fontSize: 14, color: style.text }} />
        )}
        <span>{padCol(ticket.seat.columnIndex)}</span>

        {isInactive && (
          <CloseRoundedIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 22,
              color: '#dc2626',
            }}
          />
        )}
      </button>
    </div>
  );
};

export default RenderSeat;
