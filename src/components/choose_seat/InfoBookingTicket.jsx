import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import TheaterComedyRoundedIcon from '@mui/icons-material/TheaterComedyRounded';
import WeekendRoundedIcon from '@mui/icons-material/WeekendRounded';
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { createMultiple } from '@apis/detailBookingSnack';
import { update, updateIxnRef } from '@apis/invoiceService';
import { getURLPayment } from '@apis/paymentService';
import { createUserHistoryPoint } from '@apis/userPointHistoryService';
import CustomButton from '@component/CustomButton';
import ImageComponent from '@component/ImageComponent';
import { useModelContext } from '@context/ModalContext';
import { clearInvoice, updateInvoice } from '@redux/slices/invoiceSlice';
import { clearSnack } from '@redux/slices/snackSlice';
import { clearSelectedSeats } from '@redux/slices/ticketSlice';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const primaryButtonSx = {
  minHeight: 50,
  borderRadius: '16px',
  backgroundColor: '#2d5f8d',
  fontWeight: 800,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#23486c',
    boxShadow: 'none',
  },
};

const secondaryButtonSx = {
  minHeight: 50,
  borderRadius: '16px',
  borderColor: 'rgba(45,95,141,0.24)',
  color: '#23486c',
  fontWeight: 800,
  '&:hover': {
    borderColor: 'rgba(45,95,141,0.4)',
    backgroundColor: 'rgba(45,95,141,0.04)',
  },
};

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

  const handleBeforePayment = () => {
    if (selectedSeats.length <= 0) {
      toast.info('Vui lòng chọn ghế trước khi thanh toán');
      return;
    }

    setIsLoading(true);
    const existingInvoice = invoices.find((item) => item.showTimeId === showTime.id);

    if (!existingInvoice) {
      setIsLoading(false);
      toast.error('Lỗi khi cập nhật hóa đơn');
      return;
    }

    const totalMoneyTicket = selectedSeats.reduce(
      (total, item) => total + item.price,
      0
    );

    update({
      id: existingInvoice.invoice.id,
      email: existingInvoice.invoice.email,
      phoneNumber: existingInvoice.invoice.phoneNumber,
      paymentMethod: existingInvoice.invoice.paymentMethod,
      totalAmount: totalMoneyTicket,
      totalMoneyTicket: totalMoneyTicket,
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
            invoice: {
              ...res.data,
            },
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
    <div className="relative w-[min(92vw,720px)] rounded-[28px] bg-white p-6 leading-8 shadow-2xl">
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

        <div className="mx-auto mt-4 max-w-[220px]" onClick={handleNavigatePayment}>
          <CustomButton title="Thanh toán" isLoading={isLoading} />
        </div>
      </div>
    </div>
  );

  const handlePayment = () => {
    openPopup(renderTermOfPayment());
  };

  const detailItems = [
    {
      label: 'Thể loại',
      value:
        showTime?.movie?.genres?.map((item) => item.name).join(', ') ||
        'Đang cập nhật',
      icon: <LocalOfferRoundedIcon fontSize="small" />,
    },
    {
      label: 'Thời lượng',
      value: `${showTime?.movie?.duration || 0} phút`,
      icon: <AccessTimeRoundedIcon fontSize="small" />,
    },
    {
      label: 'Rạp chiếu',
      value: movieTheater?.title || 'Đang cập nhật',
      icon: <PlaceRoundedIcon fontSize="small" />,
    },
    {
      label: 'Ngày chiếu',
      value: showTime?.showDate || 'Đang cập nhật',
      icon: <CalendarMonthRoundedIcon fontSize="small" />,
    },
    {
      label: 'Giờ chiếu',
      value: showTime?.startTime || '--:--',
      icon: <AccessTimeRoundedIcon fontSize="small" />,
    },
    {
      label: 'Phòng chiếu',
      value: showTime?.cinemaTheater?.name || 'Đang cập nhật',
      icon: <TheaterComedyRoundedIcon fontSize="small" />,
    },
  ];

  const selectedSeatLabels = selectedSeats.map((item) => item.seat.label);
  const totalMoneyTicket = selectedSeats.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="border-b border-slate-200/90 px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="w-[118px] flex-none overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100">
            <ImageComponent
              src={showTime?.movie?.posterImage}
              width={118}
              height={176}
              className="h-[176px] w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`T${showTime?.movie?.age || '--'}`}
                sx={{
                  borderRadius: '999px',
                  bgcolor: '#f8fafc',
                  color: '#334155',
                  fontWeight: 800,
                  border: '1px solid rgba(203,213,225,0.9)',
                }}
              />
              <Chip
                label={showTime?.startTime || '--:--'}
                sx={{
                  borderRadius: '999px',
                  bgcolor: 'rgba(45,95,141,0.08)',
                  color: '#23486c',
                  fontWeight: 800,
                }}
              />
            </Stack>

            <div>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  wordBreak: 'break-word',
                }}
              >
                {showTime?.movie?.title || 'Đang cập nhật phim'}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, fontWeight: 700, color: '#23486c' }}
              >
                {showTime?.cinemaTheater?.name || 'Đang cập nhật phòng chiếu'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {movieTheater?.title || 'Đang cập nhật rạp'}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="space-y-3">
          {detailItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3"
            >
              <div className="rounded-2xl bg-[rgba(45,95,141,0.08)] p-2 text-[#2d5f8d]">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 0.4, fontWeight: 700, color: '#0f172a' }}
                >
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}
        </div>

        <Divider sx={{ my: 3, borderColor: 'rgba(226,232,240,0.9)' }} />

        <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Typography
                variant="overline"
                sx={{
                  color: '#23486c',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                }}
              >
                Ghế chọn
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: '#334155', wordBreak: 'break-word' }}
              >
                {selectedSeatLabels.length > 0
                  ? selectedSeatLabels.join(', ')
                  : 'Bạn chưa chọn ghế nào.'}
              </Typography>
            </div>

            <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#23486c] border border-slate-200">
              {selectedSeats.length} ghế
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-3 py-3">
            <PaymentsRoundedIcon sx={{ color: '#2d5f8d' }} fontSize="small" />
            <div>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Tạm tính
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#23486c' }}>
                {currencyFormatter.format(totalMoneyTicket)} đ
              </Typography>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {pathname.includes('payment') ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
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
              >
                {isLoading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Tiếp tục thanh toán'
                )}
              </Button>
            </Stack>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={handleBeforePayment}
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} sx={{ color: '#fff' }} />
                ) : (
                  <WeekendRoundedIcon />
                )
              }
              sx={primaryButtonSx}
            >
              {isLoading ? 'Đang xử lý' : 'Tiếp tục'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoBookingTicket;
