import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Alert, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import MovieInfoBar from '@component/choose_seat/MovieInfoBar';
import NoteInfo from '@component/choose_seat/NoteInfo';
import SeatTypePricing from '@component/choose_seat/SeatTypePricing';
import SnackSection from '@component/choose_seat/SnackSection';
import TicketGrid from '@component/choose_seat/TicketGrid';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ChooseSeatPage = ({
  isPayment,
  showTime,
  setTotalMoneyTicket,
  totalMoneyTicket = 0,
}) => {
  const { invoices } = useSelector((state) => state.invoice);
  const invoice = invoices.find((item) => item.showTimeId === showTime.id);

  const [seatPrices, setSeatPrices] = useState({});
  const handleSeatPricesReady = useCallback((prices) => {
    setSeatPrices((prev) => ({ ...prev, ...prices }));
  }, []);

  return (
    <div className={isPayment ? 'hidden' : 'space-y-5'}>
      <Breadcrumbs
        separator={<NavigateNextRoundedIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': { alignItems: 'center' },
          '& .MuiBreadcrumbs-separator': { color: '#94a3b8' },
        }}
      >
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ fontWeight: 600, fontSize: 14, color: '#0a4d9c' }}
        >
          Trang chủ
        </MuiLink>
        <MuiLink
          component={Link}
          to="/movie"
          underline="hover"
          sx={{ fontWeight: 600, fontSize: 14, color: '#0a4d9c' }}
        >
          Đặt vé
        </MuiLink>
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#475569' }}>
          {showTime?.movie?.title || 'Đang cập nhật'}
        </Typography>
      </Breadcrumbs>

      <h1 className="text-[24px] font-extrabold text-slate-900 md:text-[28px]">
        Chọn ghế xem phim
      </h1>

      <MovieInfoBar showTime={showTime} />

      <Alert
        icon={<LocalMoviesOutlinedIcon fontSize="inherit" />}
        severity="warning"
        sx={{
          alignItems: 'center',
          borderRadius: '6px',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          bgcolor: 'rgba(254, 243, 199, 0.78)',
          color: '#9a3412',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Theo quy định của Cục Điện ảnh, phim này không dành cho khán giả dưới{' '}
        {showTime?.movie?.age || '--'} tuổi.
      </Alert>

      <section
        id="section-choose-seat"
        className="rounded-md border border-slate-200 bg-white p-5 shadow-sm md:p-7"
      >
        <h2 className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-slate-900 md:text-[18px]">
          1. Chọn ghế ngồi
        </h2>

        <div className="mt-4">
          <NoteInfo />
        </div>

        <div className="mt-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
          <div className="mx-auto min-w-max">
            <div className="mx-auto mb-8 flex w-full max-w-3xl flex-col items-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-slate-500">
                Màn hình chiếu
              </p>
              <div className="mt-3 h-2 w-full max-w-3xl rounded-t-[999px] bg-[linear-gradient(90deg,transparent_0%,#0a4d9c_50%,transparent_100%)] shadow-[0_8px_24px_rgba(10,77,156,0.18)]" />
            </div>

            {invoice ? (
              <TicketGrid
                showTime={showTime}
                invoiceId={invoice.invoice.id}
                setTotalMoneyTicket={setTotalMoneyTicket}
                onSeatPricesReady={handleSeatPricesReady}
              />
            ) : (
              <div className="grid min-h-[240px] place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                <div className="space-y-2">
                  <p className="text-base font-bold text-slate-900">
                    Đang chuẩn bị sơ đồ ghế
                  </p>
                  <p className="text-sm text-slate-500">
                    Hệ thống đang đồng bộ dữ liệu suất chiếu, vui lòng chờ
                    trong giây lát.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-slate-900 md:text-[18px]">
          2. Loại ghế
        </h2>
        <div className="mt-4">
          <SeatTypePricing seatPrices={seatPrices} />
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-slate-900 md:text-[18px]">
            3. Đồ ăn kèm
          </h2>
          <p className="text-[13px] text-slate-500">
            Chọn nhanh bắp, nước & combo bán kèm (không bắt buộc).
          </p>
        </div>
        <div className="mt-4">
          <SnackSection />
        </div>
      </section>
    </div>
  );
};

export default ChooseSeatPage;
