import CustomButton from '@component/CustomButton';
import DataGridTable from '@component/DataGridTable';
import { currencyFormatter, formatNumber } from '@libs/Utils';
import { Button, TextField } from '@mui/material';
import { setSavePointRedeem } from '@redux/slices/invoiceSlice';
import { useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const RedeemPoint = ({ customer, user, savePointRedeem, invoice }) => {
  const dispatch = useDispatch();
  const savePointRef = useRef();

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
    } else if (redeemPoints > invoice.invoice.totalMoney) {
      return toast.error(
        `Số điểm tối đa bạn có thể đổi là ${formatNumber(invoice.invoice.totalMoney)} điểm !`
      );
    }

    savePointRef.current.value = '';
    dispatch(setSavePointRedeem(redeemPoints));
    toast.success(`Đổi thành công ${formatNumber(redeemPoints)} điểm !`);
  };

  const rows = useMemo(
    () => [
      {
        id: 'redeem-point',
        currentPoint: formatNumber((user?.savePoint || customer?.savePoint || 0) - savePointRedeem),
        discountValue: currencyFormatter(
          savePointRedeem * import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT
        ),
      },
    ],
    [customer?.savePoint, savePointRedeem, user?.savePoint]
  );

  const columns = [
    {
      field: 'currentPoint',
      headerName: 'Điểm hiện có',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <p className="text-[18px] font-bold">{params.value}</p>,
    },
    {
      field: 'inputPoint',
      headerName: 'Nhập điểm',
      flex: 1.2,
      minWidth: 220,
      sortable: false,
      renderCell: () => (
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
      ),
    },
    {
      field: 'discountValue',
      headerName: 'Số tiền được giảm',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => <span className="text-[18px] font-bold">{params.value}</span>,
    },
    {
      field: 'actions',
      headerName: '',
      width: 160,
      sortable: false,
      renderCell: () =>
        savePointRedeem === 0 ? (
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
        ),
    },
  ];

  return (
    <>
      <h3 className={'font-bold text-orange-500 underline'}>Lưu ý:</h3>
      <ul className="mb-2 flex list-disc flex-col gap-2 pl-5">
        <li>Điểm tích lũy chỉ quy đổi thành tiền trên tổng tiền vé bạn đang đặt.</li>
        <li>
          Nếu đã áp dụng voucher trước đó thì số tiền quy đổi sẽ phải nhỏ hơn số tiền còn lại
          sau khi áp dụng voucher.
        </li>
        <li>
          Mỗi 1000 điểm tích lũy sẽ được quy đổi thành 1000đ (tỷ lệ
          {import.meta.env.VITE_CONVERSION_FACTOR_REDEEM_POINT}đ/điểm) - và là bội số của
          10000 đ.
        </li>
      </ul>
      <DataGridTable
        rows={rows}
        columns={columns}
        hideFooter
        minWidth={860}
        getRowId={(row) => row.id}
      />
    </>
  );
};
export default RedeemPoint;
