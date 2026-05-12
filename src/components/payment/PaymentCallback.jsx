import { updateInvoiceStatusSuccess } from '@apis/invoiceService';
import { revertApplyVoucher } from '@apis/promotionService';
import Loading from '@component/Loading';
import { clearInvoice } from '@redux/slices/invoiceSlice';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('vnp_TransactionStatus');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
    Nếu thanh toán thành công thì cập nhật thông tin đơn hàng
    Còn tất cả trường hợp còn lại chỉ thông báo thanh toán không thành công
  */
  useEffect(() => {
    if (status === '00') {
      updateInvoiceStatusSuccess({ id: searchParams.get('vnp_TxnRef') })
        .then(() => {
          // Xóa sạch các thông tin liên quan //
          dispatch(clearInvoice());
          dispatch(clearSnack());
          dispatch(clearSelectedSeats());
          toast.success('Thanh toán thành công !');
        })
        .catch(() => {
          toast.error('Cập nhật trạng thái hóa đơn thất bại !');
        });
    } else {
      // Trả lại promotion vừa áp dụng cho hóa đơn này //
      revertApplyVoucher(searchParams.get('vnp_TxnRef')).catch(() => {
        toast.error('Cập nhật thông tin số lượng voucher thất bại !');
      });
      toast.error('Thanh toán thất bại vui lòng thanh toán lại !');
    }
    navigate('/', { replace: true });
  }, [status, navigate, searchParams, dispatch]);
  return (
    <div className="mx-auto flex min-h-[50vh] w-full items-center justify-center">
      <Loading content={'Xử lý thanh toán ...'} />
    </div>
  );
};
export default PaymentCallback;
