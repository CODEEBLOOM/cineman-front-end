import { findAllByUserId } from '@apis/invoiceService';
import {
  accountPrimaryButtonSx,
  accountSecondaryButtonSx,
} from '@component/account-customer/accountUiStyles';
import { currencyFormatter } from '@libs/Utils';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import AssignmentRounded from '@mui/icons-material/AssignmentRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded';
import MovieRounded from '@mui/icons-material/MovieRounded';
import RateReviewRounded from '@mui/icons-material/RateReviewRounded';
import TheaterComedyRounded from '@mui/icons-material/TheaterComedyRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const shellPaperSx = {
  borderRadius: '22px',
  border: '1px solid rgba(148,163,184,0.18)',
  backgroundColor: '#fff',
  boxShadow: '0 14px 34px rgba(15,23,42,0.08)',
};

const summaryPaperSx = {
  ...shellPaperSx,
  p: 2,
};

const infoItemSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
};

const resolvePosterSrc = (invoice) =>
  invoice?.movie?.posterImage || invoice?.posterImage || '';

const formatShowDate = (dateValue) => {
  if (!dateValue) {
    return 'Chưa cập nhật';
  }

  return new DateFormatter(dateValue).format('DD/MM/YYYY');
};

const formatShowTime = (timeValue) => {
  if (!timeValue) {
    return 'Chưa cập nhật';
  }

  return String(timeValue).slice(0, 8);
};

const getStatusMeta = (status) => {
  switch (status) {
    case 'USED':
      return {
        label: 'Đã xuất vé',
        color: '#15803d',
        bg: alpha('#16a34a', 0.12),
      };
    case 'PROCESSING':
      return {
        label: 'Đang xử lý',
        color: '#1d4ed8',
        bg: alpha('#2563eb', 0.12),
      };
    case 'CANCELLED':
      return {
        label: 'Đã hủy',
        color: '#dc2626',
        bg: alpha('#dc2626', 0.12),
      };
    case 'PAID':
    default:
      return {
        label: 'Chưa xuất vé',
        color: '#c2410c',
        bg: alpha('#fb923c', 0.18),
      };
  }
};

const SummaryCard = ({ title, value, icon, color, bg }) => (
  <Paper sx={summaryPaperSx}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        sx={{
          width: 42,
          height: 42,
          bgcolor: bg,
          color,
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography sx={{ fontSize: 13.5, color: '#64748b' }}>{title}</Typography>
        <Typography sx={{ mt: 0.25, fontSize: 18, fontWeight: 800, color }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const LoadingCard = () => (
  <Paper sx={{ ...shellPaperSx, p: 2.25 }}>
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
    >
      <Skeleton variant="rounded" width={52} height={52} />
      <Skeleton variant="rounded" width={170} height={230} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={52} />
        <Skeleton variant="text" width="70%" height={34} />
        <Skeleton variant="text" width="65%" height={34} />
        <Skeleton variant="text" width="60%" height={34} />
        <Skeleton variant="text" width="30%" height={34} />
      </Box>
      <Stack spacing={1.25} minWidth={{ md: 170 }}>
        <Skeleton variant="rounded" height={46} />
        <Skeleton variant="rounded" height={46} />
      </Stack>
    </Stack>
  </Paper>
);

const TransactionHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    document.title = 'Lịch sử giao dịch - POLY CINEMAS';

    findAllByUserId(user.userId)
      .then((res) => {
        if (!isMounted) {
          return;
        }

        const payload = res?.data ?? [];
        setInvoices(Array.isArray(payload) ? payload : []);
      })
      .catch(() => {
        toast.error('Không thể tải lịch sử giao dịch!');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.userId]);

  const sortedInvoices = useMemo(
    () =>
      [...invoices].sort(
        (left, right) =>
          new Date(right?.showTime?.showDate || right?.createdAt || 0).getTime() -
          new Date(left?.showTime?.showDate || left?.createdAt || 0).getTime()
      ),
    [invoices]
  );

  const summary = useMemo(() => {
    const total = sortedInvoices.length;
    const pending = sortedInvoices.filter((item) => item?.status === 'PAID').length;
    const used = sortedInvoices.filter((item) => item?.status === 'USED').length;
    const totalSpent = sortedInvoices.reduce(
      (sum, item) => sum + Number(item?.totalMoney ?? 0),
      0
    );

    return { total, pending, used, totalSpent };
  }, [sortedInvoices]);

  const handleViewDetail = (invoice) => {
    toast.info(`Mã giao dịch #${invoice?.id} hiện chưa có trang chi tiết riêng.`);
  };

  const handleReview = (invoice) => {
    toast.info(`Chức năng đánh giá cho giao dịch #${invoice?.id} đang được cập nhật.`);
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: '#1e293b',
            fontSize: { xs: 22, md: 26 },
            fontWeight: 700,
          }}
        >
          Danh sách lịch sử giao dịch
        </Typography>
        <Typography sx={{ mt: 0.75, color: '#64748b', fontSize: 14.5 }}>
          Theo dõi các đơn vé đã thanh toán, trạng thái xuất vé và tổng chi tiêu của bạn.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <SummaryCard
          title="Tổng giao dịch"
          value={`${summary.total} đơn`}
          icon={<AssignmentRounded />}
          color="#23486c"
          bg={alpha('#23486c', 0.08)}
        />
        <SummaryCard
          title="Chưa xuất vé"
          value={`${summary.pending} đơn`}
          icon={<LocalOfferRounded />}
          color="#c2410c"
          bg={alpha('#fb923c', 0.15)}
        />
        <SummaryCard
          title="Tổng chi tiêu"
          value={currencyFormatter(summary.totalSpent)}
          icon={<MovieRounded />}
          color="#cf6d05"
          bg={alpha('#cf6d05', 0.1)}
        />
      </Box>

      {isLoading ? (
        <Stack spacing={2}>
          <LoadingCard />
          <LoadingCard />
        </Stack>
      ) : sortedInvoices.length > 0 ? (
        <Stack spacing={2}>
          {sortedInvoices.map((invoice, index) => {
            const statusMeta = getStatusMeta(invoice?.status);

            return (
              <Paper
                key={invoice?.id ?? index}
                sx={{
                  ...shellPaperSx,
                  p: { xs: 2, md: 2.25 },
                  overflow: 'hidden',
                  position: 'relative',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.96) 100%)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -40,
                    top: -28,
                    width: 180,
                    height: 180,
                    borderRadius: '999px',
                    background: alpha('#cf6d05', 0.05),
                    filter: 'blur(4px)',
                  }}
                />

                <Box
                  sx={{
                    position: 'relative',
                    display: 'grid',
                    gap: 2,
                    alignItems: { md: 'center' },
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '56px 160px minmax(0,1fr) 170px',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'center' },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 46,
                        height: 46,
                        bgcolor: alpha('#cf6d05', 0.1),
                        color: '#cf6d05',
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </Box>

                  <Box
                    sx={{
                      justifySelf: { xs: 'center', md: 'stretch' },
                    }}
                  >
                    <Box
                      component="img"
                      src={resolvePosterSrc(invoice)}
                      alt={invoice?.movie?.title || 'Poster phim'}
                      sx={{
                        width: { xs: 170, md: '100%' },
                        height: 238,
                        borderRadius: '18px',
                        objectFit: 'cover',
                        border: '4px solid rgba(219,234,254,0.95)',
                        boxShadow: '0 16px 28px rgba(35,72,108,0.12)',
                        backgroundColor: '#e2e8f0',
                      }}
                    />
                  </Box>

                  <Stack spacing={1.2}>
                    <Typography
                      sx={{
                        fontSize: { xs: 24, md: 28 },
                        fontWeight: 800,
                        color: '#23486c',
                        lineHeight: 1.2,
                      }}
                    >
                      {invoice?.movie?.title || 'Chưa có tên phim'}
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={infoItemSx}>
                        <CalendarMonthRounded sx={{ color: '#23486c', fontSize: 22 }} />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Ngày chiếu:</strong> {formatShowDate(invoice?.showTime?.showDate)}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <AccessTimeRounded sx={{ color: '#23486c', fontSize: 22 }} />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Giờ chiếu:</strong> {formatShowTime(invoice?.showTime?.startTime)}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <TheaterComedyRounded sx={{ color: '#23486c', fontSize: 22 }} />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Rạp chiếu:</strong>{' '}
                          {invoice?.movieTheater?.name || 'Chưa cập nhật'}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <LocalOfferRounded sx={{ color: statusMeta.color, fontSize: 22 }} />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Trạng thái:</strong>{' '}
                        </Typography>
                        <Chip
                          label={statusMeta.label}
                          sx={{
                            height: 32,
                            borderRadius: '999px',
                            backgroundColor: statusMeta.bg,
                            color: statusMeta.color,
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Stack>

                    <Typography
                      sx={{
                        pt: 0.5,
                        fontSize: { xs: 22, md: 24 },
                        fontWeight: 800,
                        color: '#111827',
                      }}
                    >
                      Tổng tiền thanh toán: {currencyFormatter(Number(invoice?.totalMoney) || 0)}
                    </Typography>
                  </Stack>

                  <Stack
                    spacing={1.25}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ minWidth: { md: 160 } }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityRounded />}
                      onClick={() => handleViewDetail(invoice)}
                      sx={{
                        ...accountSecondaryButtonSx,
                        borderColor: alpha('#23486c', 0.28),
                        color: '#23486c',
                        backgroundColor: alpha('#23486c', 0.04),
                        '&:hover': {
                          borderColor: '#23486c',
                          backgroundColor: alpha('#23486c', 0.08),
                        },
                      }}
                    >
                      Xem chi tiết
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<RateReviewRounded />}
                      onClick={() => handleReview(invoice)}
                      sx={accountPrimaryButtonSx}
                    >
                      Đánh giá
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Paper
          sx={{
            ...shellPaperSx,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              mx: 'auto',
              width: 58,
              height: 58,
              bgcolor: alpha('#23486c', 0.08),
              color: '#23486c',
            }}
          >
            <AssignmentRounded />
          </Avatar>
          <Typography sx={{ mt: 2, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
            Chưa có giao dịch nào
          </Typography>
          <Typography sx={{ mt: 1, color: '#64748b', fontSize: 14.5 }}>
            Khi bạn hoàn tất thanh toán vé, lịch sử giao dịch sẽ hiển thị tại đây.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default TransactionHistory;
