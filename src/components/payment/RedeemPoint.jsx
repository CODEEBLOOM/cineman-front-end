import CustomButton from '@component/CustomButton';
import { currencyFormatter, formatNumber } from '@libs/Utils';
import { Button, TextField } from '@mui/material';
import { setSavePointRedeem } from '@redux/slices/invoiceSlice';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const RedeemPoint = ({ customer, user, savePointRedeem, invoice }) => {
  const dispatch = useDispatch();
  const savePointRef = useRef();

  // Function to handle redeeming points
  const handleRedeemPoints = () => {
    const savePoint = user?.savePoint || customer?.savePoint || 0;
    if (savePoint <= 0) {
      return toast.error('Bạn không đủ điểm tích lũy !');
    }
    const redeemPoints = parseInt(savePointRef.current.value, 10) || 0;
    if (redeemPoints <= 0) {
      return toast.error('Vui lòng nhập số điểm hợp lệ !');
    }
    if (redeemPoints > savePoint) {
      return toast.error('Số điểm vượt quá số điểm hiện có !');
    }
    if (redeemPoints % 1000 !== 0) {
      return toast.error('Số điểm đổi phải là bội số của 1000 !');
    }
    if (
      invoice.invoice.totalMoneyTicket <
      redeemPoints * import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT
    ) {
      return toast.error(
        `Số điểm tối đa bạn có thể đổi ${formatNumber(invoice.invoice.totalMoneyTicket)} điểm !`
      );
    } else {
      if (redeemPoints > invoice.invoice.totalMoney) {
        return toast.error(
          `Số điểm tối đa bạn có thể đổi là ${formatNumber(
            invoice.invoice.totalMoney
          )} điểm !`
        );
      }
    }
    // Reset input field
    savePointRef.current.value = '';
    dispatch(setSavePointRedeem(redeemPoints));
    // Trường hợp thành công //
    toast.success(`Đổi thành công ${formatNumber(redeemPoints)} điểm !`);
  };

  return (
    <>
      <h3 className={'font-bold text-orange-500 underline'}>Lưu ý:</h3>
      <ul className="mb-2 flex list-disc flex-col gap-2 pl-5">
        <li>
          Điểm tích lũy chỉ quy đổi thành tiền trên tổng tiền vé bạn đang đặt.
        </li>
        <li>
          Nếu đã áp dụng voucher trước đó thì số tiền quy đổi sẽ phải nhỏ hơn số
          tiền còn lại sau khi áp dụng voucher.
        </li>
        <li>
          Mỗi 1000 điểm tích lũy sẽ được quy đổi thành 1000đ (tỷ lệ
          {import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT}đ/điểm) - và là
          bội số của 10000 đ.
        </li>
      </ul>
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
                {formatNumber(
                  (user?.savePoint || customer?.savePoint) - savePointRedeem
                )}
              </p>
            </td>
            <td className="text-center">
              <TextField
                disabled={savePointRedeem > 0}
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
                <span className={'text-[18px] font-bold'}>
                  {currencyFormatter(
                    savePointRedeem *
                      import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT
                  )}
                </span>
              </div>
            </td>
            <td className="text-center">
              {savePointRedeem == 0 ? (
                <div onClick={handleRedeemPoints}>
                  <CustomButton title={'Đổi điểm'} />
                </div>
              ) : (
                <Button
                  variant="outlined"
                  color="warning"
                  size="medium"
                  onClick={() => dispatch(setSavePointRedeem(0))}
                >
                  Hủy
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
export default RedeemPoint;
