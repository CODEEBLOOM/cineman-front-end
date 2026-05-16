import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button, CircularProgress } from '@mui/material';
import { createMultiple } from '@apis/detailBookingSnack';
import { update, updateIxnRef } from '@apis/invoiceService';
import { getURLPayment } from '@apis/paymentService';
import { createUserHistoryPoint } from '@apis/userPointHistoryService';
import CustomButton from '@component/CustomButton';
import Timer from '@component/Timer';
import { useModelContext } from '@context/ModalContext';
import { clearInvoice, updateInvoice } from '@redux/slices/invoiceSlice';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IoClose } from 'react-icons/io5';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const primaryButtonSx = {
  height: 52,
  borderRadius: '6px',
  backgroundColor: '#0a4d9c',
  fontWeight: 800,
  fontSize: '1rem',
  letterSpacing: '0.04em',
  boxShadow: 'none',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#083d7c',
    boxShadow: 'none',
  },
};

const secondaryButtonSx = {
  height: 52,
  borderRadius: '6px',
  borderColor: 'rgba(10,77,156,0.24)',
  color: '#083d7c',
  fontWeight: 800,
  textTransform: 'none',
  '&:hover': {
    borderColor: 'rgba(10,77,156,0.4)',
    backgroundColor: 'rgba(10,77,156,0.04)',
  },
};

const FieldRow = ({ label, value, suffix }) => (
  <div>
    <p className="text-[12px] font-medium text-slate-500">{label}</p>
    <div className="mt-0.5 flex flex-wrap items-center gap-2">
      <p className="text-sm font-semibold text-slate-900">{value}</p>
      {suffix}
    </div>
  </div>
);

const InfoBookingTicket = ({ showTime }) => {
  const movieTheater = useSelector(
    (state) => state.movieTheater?.movieTheater ?? { title: '' }
  );
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { invoices, savePointRedeem } = useSelector((state) => state.invoice);
  const { snackSelected } = useSelector((state) => state.snack);

  const snackItems = Array.isArray(snackSelected) ? snackSelected : [];
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openPopup, closeTopModal } = useModelContext();
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPaymentPage = pathname.includes('payment');

  const handleBeforePayment = () => {
    if (selectedSeats.length <= 0) {
      toast.info('Vui lòng chọn ghế trước khi thanh toán');
      return;
    }

    setIsLoading(true);
    const existingInvoice = invoices.find(
      (item) => item.showTimeId === showTime.id
    );

    if (!existingInvoice) {
      setIsLoading(false);
      toast.error('Lỗi khi cập nhật hóa đơn');
      return;
    }

    const ticketMoney = selectedSeats.reduce(
      (total, item) => total + item.price,
      0
    );
    const snackMoney = snackItems.reduce(
      (total, item) =>
        total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
      0
    );

    update({
      id: existingInvoice.invoice.id,
      email: existingInvoice.invoice.email,
      phoneNumber: existingInvoice.invoice.phoneNumber,
      paymentMethod: existingInvoice.invoice.paymentMethod,
      totalAmount: ticketMoney + snackMoney,
      totalMoneyTicket: ticketMoney,
      totalTicket: selectedSeats.length,
      customerId: existingInvoice.invoice.customerId,
      staffId: existingInvoice.invoice.staffId || null,
      promotionId: null,
      invoiceStatus: 'PROCESSING',
    })
      .then((res) => {
        dispatch(
          updateInvoice({
            showTimeId: showTime.id,
            invoice: { ...res.data },
          })
        );
        navigate(`/payment?st=${showTime.id}`);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleNavigatePayment = async () => {
    if (!inputRef.current.checked) {
      toast.info('Vui lòng chấp nhận điều khoản đặt vé.');
      return;
    }

    const invoice = invoices.find((item) => item.showTimeId === showTime.id);
    if (!invoice) return;

    setIsLoading(true);

    const newSnackSelected = snackItems.map((item) => ({
      snackId: item.id,
      totalSnack: item.quantity,
      invoiceId: invoice.invoice.id,
    }));

    try {
      if (newSnackSelected.length > 0) {
        await createMultiple(newSnackSelected);
      }

      if (savePointRedeem > 0) {
        try {
          await createUserHistoryPoint({
            userId: invoice.invoice.customerId,
            invoiceId: invoice.invoice.id,
            changePoint: savePointRedeem,
            reason: 'Đổi điểm tích lũy thanh toán hóa đơn',
          });
        } catch (error) {
          console.error(error);
          toast.error('Có lỗi xảy ra khi đổi điểm tích lũy!');
        }
      }

      if (invoice.invoice.paymentMethod === 'CASH') {
        try {
          const res = await update({
            ...invoice.invoice,
            invoiceStatus: 'PAID',
          });

          if (res?.data) {
            dispatch(clearInvoice());
            dispatch(clearSnack());
            dispatch(clearSelectedSeats());
            closeTopModal();
            toast.success('Thanh toán thành công!');
            navigate('/', { replace: true });
            return;
          }
        } catch (err) {
          if (err.response?.status >= 400) {
            toast.error(err.response.data.message);
            return;
          }
        }
      }

      const paymentRes = await getURLPayment({
        amount: invoice.invoice.totalMoney,
      });

      const paymentUrl = paymentRes.data;
      const vnp_TxnRef =
        new URL(paymentUrl).searchParams.get('vnp_TxnRef') || '';

      await updateIxnRef({
        invoiceId: invoice.invoice.id,
        txnRef: vnp_TxnRef,
        promotionId: invoice.invoice.promotionId,
        totalMoney: invoice.invoice.totalMoney,
      });

      window.location.href = paymentUrl;
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi thanh toán hoặc cập nhật thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTermOfPayment = () => (
    <div className="relative w-[min(92vw,720px)] rounded-md bg-white p-6 leading-8 shadow-2xl">
      <span
        className="absolute right-4 top-4 cursor-pointer text-slate-500 transition hover:text-slate-900"
        onClick={closeTopModal}
      >
        <IoClose size={24} />
      </span>

      <h2 className="mb-4 border-b border-slate-200 pb-3 text-[20px] font-bold uppercase text-slate-900">
        Điều khoản thanh toán
      </h2>

      <div className="max-h-[70vh] overflow-y-auto text-slate-600">
        <h3 className="font-semibold text-slate-900">
          Chào mừng Quý khách đến với hệ thống bán vé online!
        </h3>
        <p>Xin cảm ơn và chúc bạn có những giây phút xem phim tuyệt vời.</p>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2 text-slate-800">
          <input ref={inputRef} type="checkbox" />
          <span className="font-semibold">
            Tôi đồng ý với điều khoản sử dụng
          </span>
        </label>

        <div
          className="mx-auto mt-4 max-w-[220px]"
          onClick={handleNavigatePayment}
        >
          <CustomButton title="Thanh toán" isLoading={isLoading} />
        </div>
      </div>
    </div>
  );

  const handlePayment = () => {
    openPopup(renderTermOfPayment());
  };

  const handleChangeSeat = () => {
    const target = document.getElementById('section-choose-seat');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectedSeatLabels = selectedSeats.map((item) => item.seat.label);
  const totalMoneyTicket = selectedSeats.reduce(
    (total, item) => total + item.price,
    0
  );
  const totalSnackQuantity = snackItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );
  const totalSnackMoney = snackItems.reduce(
    (total, item) =>
      total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
    0
  );
  const totalAmount = totalMoneyTicket + totalSnackMoney;

  return (
    <aside className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5 self-start rounded-full bg-amber-50 px-3 py-1 text-amber-700">
        <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
        <span className="text-[12px] font-semibold">Giữ ghế</span>
        <Timer
          deadlineTime={10}
          className="text-[12px] font-bold text-amber-700"
        />
      </div>

      <h3 className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-slate-900">
        Thông tin đặt vé
      </h3>

      <div className="mt-4 space-y-4">
        <FieldRow
          label="Phim"
          value={showTime?.movie?.title || 'Đang cập nhật'}
          suffix={
            <span className="inline-flex h-5 items-center rounded bg-rose-50 px-1.5 text-[11px] font-bold text-rose-700">
              T{showTime?.movie?.age || '--'}
            </span>
          }
        />
        <FieldRow
          label="Rạp"
          value={movieTheater?.title || 'Đang cập nhật'}
        />
        <FieldRow
          label="Phòng chiếu"
          value={showTime?.cinemaTheater?.name || 'Đang cập nhật'}
        />
        <FieldRow
          label="Ngày chiếu"
          value={showTime?.showDate || 'Đang cập nhật'}
        />
        <FieldRow label="Giờ chiếu" value={showTime?.startTime || '--:--'} />

        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-medium text-slate-500">
              Ghế đã chọn
            </p>
            {selectedSeatLabels.length > 0 && !isPaymentPage && (
              <button
                type="button"
                onClick={handleChangeSeat}
                className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-slate-50"
              >
                Đổi ghế
              </button>
            )}
          </div>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {selectedSeatLabels.length > 0
              ? selectedSeatLabels.join(', ')
              : 'Chưa chọn ghế'}
          </p>
        </div>

        <div>
          <p className="text-[12px] font-medium text-slate-500">Đồ ăn kèm</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {totalSnackQuantity > 0
              ? `${totalSnackQuantity} món · ${currencyFormatter.format(totalSnackMoney)}đ`
              : 'Chưa chọn'}
          </p>
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>
            Vé phim
            <span className="ml-1 text-slate-400">({selectedSeats.length} ghế)</span>
          </span>
          <span className="font-semibold text-slate-800">
            {currencyFormatter.format(totalMoneyTicket)}đ
          </span>
        </div>
        {totalSnackQuantity > 0 && (
          <div className="flex items-center justify-between text-slate-600">
            <span>
              Đồ ăn kèm
              <span className="ml-1 text-slate-400">({totalSnackQuantity} món)</span>
            </span>
            <span className="font-semibold text-slate-800">
              {currencyFormatter.format(totalSnackMoney)}đ
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-slate-500">
          Tạm tính
        </p>
        <p className="text-[26px] font-extrabold leading-none text-primary">
          {currencyFormatter.format(totalAmount)}đ
        </p>
      </div>

      <div className="mt-5">
        {isPaymentPage ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={secondaryButtonSx}
            >
              Quay lại
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handlePayment}
              disabled={isLoading}
              sx={primaryButtonSx}
              endIcon={
                !isLoading ? (
                  <ArrowForwardRoundedIcon />
                ) : (
                  <CircularProgress size={18} sx={{ color: '#fff' }} />
                )
              }
            >
              {isLoading ? 'Đang xử lý' : 'Tiếp tục thanh toán'}
            </Button>
          </div>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={handleBeforePayment}
            disabled={isLoading}
            sx={primaryButtonSx}
            endIcon={
              !isLoading ? (
                <ArrowForwardRoundedIcon />
              ) : (
                <CircularProgress size={18} sx={{ color: '#fff' }} />
              )
            }
          >
            {isLoading ? 'Đang xử lý' : 'Tiếp tục'}
          </Button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-slate-500">
        <LockOutlinedIcon sx={{ fontSize: 14 }} />
        <span className="text-[12px]">Thông tin của bạn được bảo mật</span>
      </div>
    </aside>
  );
};

export default InfoBookingTicket;
