import { Button, TextField } from '@mui/material';
import CustomButton from '@component/CustomButton.jsx';
import Accordion from '@component/Accordion.jsx';
import { useRef } from 'react';
import { applyVoucher } from '@apis/promotionService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setVoucher, updateInvoice } from '@redux/slices/invoiceSlice';
import { currencyFormatter } from '@libs/Utils';
import { MdOutlineNoEncryptionGmailerrorred } from 'react-icons/md';
import RedeemPoint from './RedeemPoint';

const DiscountComponent = ({ showTime }) => {
  const { user } = useSelector((state) => state.user);
  const { customer, voucher, savePointRedeem } = useSelector(
    (state) => state.invoice
  );
  const isCustomer = user?.roles?.some((role) => role.roleId === 'USER');
  const { invoices } = useSelector((state) => state.invoice);
  const invoice = invoices.find((i) => i.showTimeId === Number(showTime.id));

  const voucherRef = useRef();
  const dispatch = useDispatch();

  const handleApplyVoucher = () => {
    const code = voucherRef.current.value;
    if (invoice.invoice.totalMoney === 0) {
      return toast.error(
        'Hóa đơn đã tối thiểu không thể áp dụng thêm voucher !'
      );
    }

    if (code && !voucher && invoice.invoice.customerId !== null) {
      applyVoucher({ code, amount: invoice.invoice.totalMoneyTicket })
        .then((res) => {
          if (invoice.invoice.totalMoney - res.data.discount < 0) {
            return toast.error(
              'Hóa đơn đã tối thiểu không thể áp dụng thêm voucher !'
            );
          }
          dispatch(setVoucher(res.data));
          dispatch(
            updateInvoice({
              ...invoice,
              invoice: {
                ...invoice.invoice,
                promotionId: res.data.id,
              },
            })
          );
          toast.success('Voucher hợp lệ !');
        })
        .catch((err) => {
          if (err.response?.status >= 400) {
            toast.error(err.response.data.message);
          } else {
            toast.error('Voucher không hợp lệ !');
          }
        });
    }
  };

  const handleCancelApplyVoucher = () => {
    dispatch(setVoucher(null));
    voucherRef.current.value = '';
    dispatch(
      updateInvoice({
        ...invoice,
        invoice: {
          ...invoice.invoice,
          promotionId: null,
        },
      })
    );
  };

  // const changeSavePoint = () => {
  //   getMoneyFromSavePointOfUser()
  // };

  return (
    <>
      <div className={'my-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-payment.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Giảm giá</h2>
      </div>
      <Accordion
        title={'Voucher'}
        subTitle="( Nhấn vào đây để áp dụng dụng voucher của bạn )"
      >
        {customer || isCustomer ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <TextField
                disabled={voucher !== null}
                inputRef={voucherRef}
                fullWidth
                placeholder={'Nhập mã voucher'}
                name={'voucher'}
                type={'text'}
                slotProps={{
                  input: { className: 'h-10 px-3 py-2 ' },
                  htmlInput: { className: '!px-0' },
                }}
              />
              <div
                className={`w-[200px] ${voucher && 'hidden'}`}
                onClick={handleApplyVoucher}
              >
                <CustomButton title={'Áp dụng'} />
              </div>
            </div>
            {voucher && (
              <div className="mt-3 flex justify-between">
                <p>
                  Voucher:{' '}
                  <span className="font-medium text-orange-400">
                    {voucher?.code}
                  </span>
                </p>
                <p>
                  Giảm giá:{' '}
                  <span className="font-medium text-orange-400">
                    {currencyFormatter(voucher?.discount)}
                  </span>
                </p>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleCancelApplyVoucher}
                >
                  Hủy
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-red-400 px-2 py-3">
            <p className="flex items-center gap-3 italic text-red-500">
              <MdOutlineNoEncryptionGmailerrorred />
              Voucher chỉ áp dụng cho khách hàng !
            </p>
          </div>
        )}
      </Accordion>
      <Accordion title={'Đổi điểm'} subTitle="( Nhấn vào đây để đổi điểm )">
        {customer || isCustomer ? (
          <RedeemPoint
            customer={customer}
            isCustomer={isCustomer}
            user={user}
            savePointRedeem={savePointRedeem}
            invoice={invoice}
          />
        ) : (
          <div className="rounded-md border border-red-400 px-2 py-3">
            <p className="flex items-center gap-3 italic text-red-500">
              <MdOutlineNoEncryptionGmailerrorred />
              Đổi điểm chỉ áp dụng cho khách hàng !
            </p>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default DiscountComponent;
