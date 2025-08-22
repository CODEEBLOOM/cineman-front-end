import { currencyFormatter } from '@libs/Utils';
import ComboComponent from './payment/ComboComponent';
import DiscountComponent from './payment/DiscountComponent';
import InfoUserComponent from './payment/InfoUserOrderComponent';
import TicketSelectComponent from './payment/TicketSelectComponent';
import { useDispatch, useSelector } from 'react-redux';
import PaymentMethod from './payment/PaymentMethod';
import { useEffect, useMemo, useRef } from 'react';
import { updateInvoice } from '@redux/slices/invoiceSlice';

const Payment = ({
  showTime,
  regularSeatsSelected,
  vipSeatsSelected,
  doubleSeatsSelected,
}) => {
  const { invoices } = useSelector((state) => state.invoice);
  const invoice = invoices.find((i) => i.showTimeId === showTime.id);
  const { snackSelected } = useSelector((state) => state.snack);
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { voucher, savePointRedeem } = useSelector((state) => state.invoice);

  let totalDiscount = useMemo(() => {
    const conv =
      Number(import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT) || 0;
    return (
      (Number(voucher?.discount) || 0) + (Number(savePointRedeem) || 0) * conv
    );
  }, [voucher?.discount, savePointRedeem]);
  const dispatch = useDispatch();

  const lastTotalMoneyRef = useRef(null);

  useEffect(() => {
    if (!invoice) return;

    const totalTicketMoney =
      selectedSeats.reduce((total, item) => total + item.price, 0) -
      totalDiscount;

    const totalSnackMoney = snackSelected.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

    const newTotalMoney = totalTicketMoney + totalSnackMoney;

    // Nếu chưa thay đổi thì không update nữa để tránh vòng lặp
    if (invoice.invoice.totalMoney === newTotalMoney) return;

    // Lưu lại để tránh redundant update
    if (lastTotalMoneyRef.current === newTotalMoney) return;
    lastTotalMoneyRef.current = newTotalMoney;
    dispatch(
      updateInvoice({
        ...invoice,
        invoice: {
          ...invoice.invoice,
          totalMoney: newTotalMoney,
        },
      })
    );
  }, [selectedSeats, snackSelected, totalDiscount, invoice, dispatch]);

  return (
    <>
      {/*Phần payment*/}
      <InfoUserComponent showTime={showTime} />
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
      <ComboComponent invoice={invoice} voucher={voucher} />
      <DiscountComponent showTime={showTime} invoice={invoice} />
      <div>
        <div className="flex justify-between gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Tổng tiền:&nbsp;</p>
          <p className="text-red-500">
            {currencyFormatter(invoice?.invoice?.totalMoney + totalDiscount)}
          </p>
        </div>
        <div className="flex justify-between gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Số tiền được giảm:&nbsp;</p>
          <p className="text-red-500">{currencyFormatter(totalDiscount)}</p>
        </div>
        <div className="flex justify-between gap-3 text-[20px] font-medium">
          <p className="min-w-[80%] text-end">Số tiền cần thanh toán:&nbsp;</p>
          <p className="text-red-500">
            {currencyFormatter(invoice?.invoice?.totalMoney)}
          </p>
        </div>
      </div>
      {/* Thanh toán */}
      <PaymentMethod showTimeId={showTime.id} />
    </>
  );
};
export default Payment;
