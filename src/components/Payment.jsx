import { currencyFormatter } from '@libs/Utils';
import ComboComponent from './payment/ComboComponent';
import DiscountComponent from './payment/DiscountComponent';
import InfoUserComponent from './payment/InfoUserOrderComponent';
import TicketSelectComponent from './payment/TicketSelectComponent';
import { useSelector } from 'react-redux';
import PaymentMethod from './payment/PaymentMethod';

const Payment = ({
  showTime,
  regularSeatsSelected,
  vipSeatsSelected,
  doubleSeatsSelected,
}) => {
  const { invoices } = useSelector((state) => state.invoice);
  const { snackSelected } = useSelector((state) => state.snack);

  const totalMoney =
    invoices.find((i) => i.showTimeId === showTime.id)?.invoice.totalMoney +
    snackSelected.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
  return (
    <>
      {/*Phần payment*/}
      <InfoUserComponent />
      {regularSeatsSelected.length > 0 && (
        <TicketSelectComponent
          ticketType={'Ghế thường'}
          count={regularSeatsSelected.length}
          unitPrice={regularSeatsSelected[0].price}
        />
      )}
      {vipSeatsSelected.length > 0 && (
        <TicketSelectComponent
          ticketType={'Ghế VIP'}
          count={vipSeatsSelected.length}
          unitPrice={vipSeatsSelected[0].price}
        />
      )}
      {doubleSeatsSelected.length > 0 && (
        <TicketSelectComponent
          ticketType={'Ghế đôi'}
          count={doubleSeatsSelected.length}
          unitPrice={doubleSeatsSelected[0].price}
        />
      )}
      {/*  Combo ưu đãi*/}
      <ComboComponent />
      <DiscountComponent />
      <div>
        <div className="flex gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Tổng tiền:&nbsp;</p>
          <p className="text-red-500">{currencyFormatter(totalMoney)}</p>
        </div>
        <div className="flex gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Số tiền được giảm:&nbsp;</p>
          <p className="text-red-500">{currencyFormatter(0)}</p>
        </div>
        <div className="flex gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Số tiền cần thanh toán:&nbsp;</p>
          <p className="text-red-500">{currencyFormatter(totalMoney)}</p>
        </div>
      </div>
      {/* Thanh toán */}
      <PaymentMethod showTimeId={showTime.id} />
    </>
  );
};
export default Payment;
