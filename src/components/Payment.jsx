import ComboComponent from './payment/ComboComponent';
import DiscountComponent from './payment/DiscountComponent';
import InfoUserComponent from './payment/InfoUserOrderComponent';
import TicketSelectComponent from './payment/TicketSelectComponent';

const Payment = () => {
  return (
    <>
      {/*Phần payment*/}
      <InfoUserComponent />
      <TicketSelectComponent
        ticketType={'Ghế VIP'}
        count={1}
        unitPrice={60000}
      />

      <TicketSelectComponent
        ticketType={'Ghế thường'}
        count={2}
        unitPrice={60000}
      />
      {/*  Combo ưu đãi*/}
      <ComboComponent />
      <DiscountComponent />
    </>
  );
};
export default Payment;
