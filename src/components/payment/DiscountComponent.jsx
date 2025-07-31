import { Button, TextField } from '@mui/material';
import CustomButton from '@component/CustomButton.jsx';
import Accordion from '@component/Accordion.jsx';
import { useRef } from 'react';
import { applyVoucher } from '@apis/promotionService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateInvoice } from '@redux/slices/invoiceSlice';
import { currencyFormatter } from '@libs/Utils';

const DiscountComponent = ({ invoice, voucher, setVoucher }) => {
  const voucherRef = useRef();
  const dispatch = useDispatch();

  const handleApplyVoucher = () => {
    const code = voucherRef.current.value;
    if (code && voucher === null) {
      applyVoucher({ code, amount: invoice.invoice.totalMoneyTicket })
        .then((res) => {
          console.log(res);
          setVoucher(res.data);
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
    setVoucher(null);
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
        {voucher !== null && (
          <div className="mt-3 flex justify-between">
            <p>
              Voucher:{' '}
              <span className="font-medium text-orange-400">
                {voucher.code}
              </span>
            </p>
            <p>
              Giảm giá:{' '}
              <span className="font-medium text-orange-400">
                {currencyFormatter(voucher.discount)}
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
      </Accordion>
      <Accordion title={'Đổi điểm'} subTitle="( Nhấn vào đây để đổi điểm )">
        <div className={'grid gap-2 md:grid-cols-4'}>
          <div className="flex flex-col space-y-3">
            <p>Điểm hiện có</p>
            <p className={'text-[18px] font-bold'}>0</p>
          </div>
          <div className="flex flex-col space-y-3">
            <p>Nhập điểm</p>
            <TextField
              fullWidth
              placeholder={'Nhập điểm'}
              name={'savePoint'}
              type={'number'}
              slotProps={{
                input: { className: 'h-10 px-3 py-2 ' },
                htmlInput: { className: '!px-0' },
              }}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <p>Số tiền được giảm</p>
            <div>
              <span className={'text-[18px] font-bold'}>30000</span>
              <span className={'text-[18px] font-bold'}>VNĐ</span>
            </div>
          </div>
          <div className="mt-3">
            <CustomButton title={'Đổi điểm'} />
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default DiscountComponent;
