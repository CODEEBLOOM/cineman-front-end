import { Button, TextField } from '@mui/material';
import CustomButton from '@component/CustomButton.jsx';
import Accordion from '@component/Accordion.jsx';
import { useRef } from 'react';
import { applyVoucher } from '@apis/promotionService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setVoucher, updateInvoice } from '@redux/slices/invoiceSlice';
import { currencyFormatter, formatNumber } from '@libs/Utils';
import { MdOutlineNoEncryptionGmailerrorred } from 'react-icons/md';

const DiscountComponent = ({ showTime }) => {
  const { user } = useSelector((state) => state.user);
  const { customer, voucher } = useSelector((state) => state.invoice);
  const isCustomer = user?.roles.some((role) => role.roleId === 'USER');
  const { invoices } = useSelector((state) => state.invoice);
  const invoice = invoices.find((i) => i.showTimeId === Number(showTime.id));

  const voucherRef = useRef();
  const savePointRef = useRef();
  const dispatch = useDispatch();

  const handleApplyVoucher = () => {
    const code = voucherRef.current.value;

    if (code && !voucher && invoice.invoice.customerId !== null) {
      applyVoucher({ code, amount: invoice.invoice.totalMoneyTicket })
        .then((res) => {
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
              <div className="w-[200px]" onClick={handleApplyVoucher}>
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
      <Accordion title={'Đổi điểm'} subTitle="( Nhấn vào đây để đổi điểm )">
        {customer || isCustomer ? (
          <table>
            <thead>
              <tr>
                <th className="text-center">Điểm hiện có</th>
                <th className="text-center">Nhập điểm</th>
                <th className="text-center">Số tiền được giảm</th>
                <th className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  {' '}
                  <p className={'text-[18px] font-bold'}>
                    {formatNumber(user?.savePoint || customer?.savePoint)}
                  </p>
                </td>
                <td className="text-center">
                  <TextField
                    inputRef={savePointRef}
                    fullWidth
                    placeholder={'Nhập điểm'}
                    name={'savePoint'}
                    type={'number'}
                    slotProps={{
                      input: { className: 'h-10 px-3 py-2 ' },
                      htmlInput: { className: '!px-0' },
                    }}
                  />
                </td>
                <td className="text-center">
                  <div>
                    <span className={'text-[18px] font-bold'}>30000</span>
                    <span className={'text-[18px] font-bold'}>VNĐ</span>
                  </div>
                </td>
                <td className="text-center">
                  <div className="">
                    <CustomButton title={'Đổi điểm'} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
