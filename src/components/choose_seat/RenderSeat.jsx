import CloseRounded from '@mui/icons-material/CloseRounded';
import {
  seatStatusAppearance,
  seatTypeAppearance,
} from './seatVisualConfig';

const RenderSeat = ({ ticket, message, sendMessageChooseSeat }) => {
  const seatType =
    typeof ticket?.seat?.seatType === 'string'
      ? ticket.seat.seatType
      : ticket?.seat?.seatType?.id;
  const appearance = seatTypeAppearance[seatType] ?? seatTypeAppearance.REGULAR;
  const stateStyle =
    seatStatusAppearance[ticket.status] ?? seatStatusAppearance.EMPTY;
  const SeatIcon = appearance.icon;
  const isDoubleSeat = seatType === 'DOUBLE';
  const isInactive = ticket.seat.status === 'INACTIVE';
  const isDisabled =
    isInactive ||
    ticket.status === 'HOLDED' ||
    ticket.status === 'SOLD' ||
    ticket.status === 'BOOKED';

  const handleChooseSeat = () => {
    if (isDisabled) return;

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
    <div
      className={`${isDoubleSeat ? 'col-span-2' : 'col-span-1'} flex items-center justify-center`}
    >
      <div
        onClick={handleChooseSeat}
        className={`relative flex min-h-[64px] min-w-[58px] items-center justify-center rounded-[18px] border px-3 py-2 transition ${
          isDoubleSeat ? 'w-full' : ''
        } ${
          isDisabled && ticket.status !== 'SELECTED'
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        } ${
          !isDisabled || ticket.status === 'SELECTED'
            ? 'hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
            : ''
        }`}
        style={{
          borderColor: isInactive
            ? appearance.border
            : stateStyle.borderColor || appearance.border,
          backgroundColor: isInactive
            ? appearance.surface
            : stateStyle.backgroundColor || appearance.surface,
          paddingInline: isDoubleSeat ? '0.9rem' : '0.75rem',
        }}
      >
        <SeatIcon
          size={isDoubleSeat ? '48px' : '42px'}
          color={stateStyle.iconColor || appearance.baseColor}
        />

        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          style={{
            color: isInactive ? '#475569' : stateStyle.textColor,
          }}
        >
          <span className="translate-y-[1px] text-[11px] font-semibold tracking-[0.02em]">
            {ticket.seat.label}
          </span>
        </div>

        {isInactive && (
          <CloseRounded
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 28,
              color: '#dc2626',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RenderSeat;
