import Payment from '@component/Payment';
import { useSelector } from 'react-redux';

const PaymentPage = ({ showTime }) => {
  const { selectedSeats } = useSelector((state) => state.ticket);
  const regularSeatsSelected = selectedSeats.filter(
    (ticket) => ticket.seat.seatType.id === 'REGULAR'
  );
  const vipSeatsSelected = selectedSeats.filter(
    (ticket) => ticket.seat.seatType.id === 'VIP'
  );
  const doubleSeatsSelected = selectedSeats.filter(
    (ticket) => ticket.seat.seatType.id === 'DOUBLE'
  );
  return (
    <>
      <Payment
        showTime={showTime}
        regularSeatsSelected={regularSeatsSelected}
        vipSeatsSelected={vipSeatsSelected}
        doubleSeatsSelected={doubleSeatsSelected}
      />
    </>
  );
};
export default PaymentPage;
