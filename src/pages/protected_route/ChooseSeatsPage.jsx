import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import EventSeatOutlinedIcon from '@mui/icons-material/EventSeatOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TheatersOutlinedIcon from '@mui/icons-material/TheatersOutlined';
import { Box, Chip, Stack, Typography } from '@mui/material';
import NoteInfo from '@component/choose_seat/NoteInfo';
import TicketGrid from '@component/choose_seat/TicketGrid';
import { useSelector } from 'react-redux';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const infoChipSx = {
  borderRadius: '999px',
  bgcolor: '#f8fafc',
  color: '#334155',
  fontWeight: 700,
  border: '1px solid rgba(203,213,225,0.9)',
  '.MuiChip-icon': {
    color: '#0a4d9c',
  },
};

const ChooseSeatPage = ({
  isPayment,
  showTime,
  setTotalMoneyTicket,
  totalMoneyTicket = 0,
}) => {
  const { invoices } = useSelector((state) => state.invoice);
  const { selectedSeats } = useSelector((state) => state.ticket);

  const invoice = invoices.find((item) => item.showTimeId === showTime.id);
  const selectedSeatLabels = selectedSeats.map((item) => item.seat.label);

  return (
    <div className={isPayment ? 'hidden' : ''}>
      <Box className="space-y-6">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <Chip
            icon={<ConfirmationNumberOutlinedIcon />}
            label={`Suất chiếu ${showTime?.startTime || '--:--'}`}
            sx={infoChipSx}
          />
          <Chip
            icon={<TheatersOutlinedIcon />}
            label={showTime?.cinemaTheater?.name || 'Đang cập nhật phòng'}
            sx={infoChipSx}
          />
          <Chip
            icon={<ScheduleOutlinedIcon />}
            label={showTime?.showDate || 'Đang cập nhật ngày chiếu'}
            sx={infoChipSx}
          />
        </Stack>

        <NoteInfo />

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-5 md:px-5">
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300">
            <div className="mx-auto min-w-max px-2 sm:px-4">
              <div className="mx-auto mb-10 flex w-full max-w-4xl flex-col items-center">
                <Typography
                  variant="overline"
                  sx={{
                    color: '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.28em',
                  }}
                >
                  Màn hình chiếu
                </Typography>
                <div className="mt-3 h-4 w-full max-w-4xl rounded-t-[999px] bg-[linear-gradient(90deg,#d7e4f0_0%,#0a4d9c_50%,#d7e4f0_100%)] shadow-[0_10px_28px_rgba(10,77,156,0.18)]" />
                <div className="mt-2 h-4 w-[88%] rounded-b-full bg-[radial-gradient(circle_at_top,rgba(10,77,156,0.2),transparent_72%)]" />
              </div>

              {invoice ? (
                <TicketGrid
                  showTime={showTime}
                  invoiceId={invoice.invoice.id}
                  setTotalMoneyTicket={setTotalMoneyTicket}
                />
              ) : (
                <div className="grid min-h-[280px] place-items-center rounded-[20px] border border-dashed border-slate-300 bg-white px-6 text-center">
                  <div className="space-y-2">
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: '#0f172a' }}
                    >
                      Đang chuẩn bị sơ đồ ghế
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Hệ thống đang đồng bộ dữ liệu suất chiếu, vui lòng chờ
                      trong giây lát.
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ChooseSeatPage;
