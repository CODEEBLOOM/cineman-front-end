import { updateInvoice } from '@redux/slices/invoiceSlice';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

const PaymentMethod = ({ showTimeId }) => {
  const { user } = useSelector((state) => state.user);
  const { invoices } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();

  const { register, watch } = useForm({
    defaultValues: {
      paymentMethod: 'BANK_TRANSFER',
    },
  });
  // Theo dõi giá trị khi user chọn
  const selectedPayment = watch('paymentMethod');

  useEffect(() => {
    const invoice = invoices.find((i) => i.showTimeId === Number(showTimeId));
    if (invoice) {
      const infoUpdateInvoice = {
        ...invoice,
        invoice: {
          ...invoice.invoice,
          paymentMethod: selectedPayment,
        },
      };
      dispatch(updateInvoice(infoUpdateInvoice));
    }
  }, [selectedPayment, dispatch]);

  return (
    <div>
      <div className={'my-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-payment.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Thanh toán</h2>
      </div>
      <div>
        <h2 className="border-b-2 pb-2 text-[18px] font-medium">
          Chọn phương thức thanh toán
        </h2>
      </div>
      <form className="mt-3 flex gap-4">
        <label htmlFor="payment-vnpay" className="cursor-pointer">
          <div className="flex select-none items-center gap-3">
            <input
              type="radio"
              id="payment-vnpay"
              name="payment-method"
              value="BANK_TRANSFER"
              {...register('paymentMethod')}
              defaultChecked
            />
            <div className="h-[50px] w-[50px] rounded-sm border">
              <img
                src="/vnpay-logo.png"
                alt="vnpay logo payment"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[18px] font-medium text-gray-800">VNPay</p>
          </div>
        </label>
        {user?.roles.find((r) => r.roleId !== 'ADMIN' && r.roleId !== 'CADMIN')
          .roleId !== 'USER' && (
          <label
            htmlFor="payment-cash"
            className="flex cursor-pointer select-none items-center gap-3"
          >
            <input
              type="radio"
              id="payment-cash"
              name="payment-method"
              value="CASH"
              {...register('paymentMethod')}
            />
            <p className="text-[18px] font-medium text-gray-800">
              Thanh toán trực tiếp
            </p>
          </label>
        )}
      </form>
    </div>
  );
};
export default PaymentMethod;
