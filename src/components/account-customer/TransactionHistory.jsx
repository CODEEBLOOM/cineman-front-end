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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const shellPaperSx = {
  borderRadius: '16px',
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

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'USED', label: 'Đã xuất vé' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'REFUNDED', label: 'Đã hoàn tiền' },
];

const resolvePosterSrc = (invoice) =>
  invoice?.movie?.posterImage || invoice?.posterImage || '';

const resolveMovieId = (invoice) =>
  invoice?.movie?.movieId || invoice?.movieId || null;

const canOpenReviewComposer = (invoice) => {
  const status = String(invoice?.status || '').toUpperCase();
  const movieId = resolveMovieId(invoice);

  return Boolean(movieId && (status === 'PAID' || status === 'USED'));
};

const extractInvoices = (response) => {
  const payload = response?.data ?? [];
  return Array.isArray(payload) ? payload : [];
};

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
    case 'REFUNDED':
      return {
        label: 'Đã hoàn tiền',
        color: '#7c3aed',
        bg: alpha('#8b5cf6', 0.14),
      };
    case 'PENDING':
      return {
        label: 'Chờ thanh toán',
        color: '#b45309',
        bg: alpha('#f59e0b', 0.16),
      };
    case 'PAID':
    default:
      return {
        label: 'Đã thanh toán',
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
        <Typography sx={{ fontSize: 13.5, color: '#64748b' }}>
          {title}
        </Typography>
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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [allInvoices, setAllInvoices] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  const loadAllInvoices = useCallback(async () => {
    const response = await findAllByUserId(user.userId);
    const payload = extractInvoices(response);
    setAllInvoices(payload);
    return payload;
  }, [user.userId]);

  const loadInvoicesByStatus = useCallback(
    async (status) => {
      const response = await findAllByUserId(
        user.userId,
        status && status !== 'ALL' ? status : undefined
      );

      return extractInvoices(response);
    },
    [user.userId]
  );

  useEffect(() => {
    let isMounted = true;

    document.title = 'Lịch sử giao dịch - POLY CINEMAS';
    setIsLoading(true);

    loadAllInvoices()
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        setInvoices(payload);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setAllInvoices([]);
        setInvoices([]);
        toast.error('Không thể tải lịch sử giao dịch!');
      })
      .finally(() => {
        if (isMounted) {
          setHasBootstrapped(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loadAllInvoices]);

  useEffect(() => {
    let isMounted = true;

    if (!hasBootstrapped) {
      return () => {
        isMounted = false;
      };
    }

    if (selectedStatus === 'ALL') {
      setInvoices(allInvoices);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);

    loadInvoicesByStatus(selectedStatus)
      .then((payload) => {
        if (!isMounted) {
          return;
        }

        setInvoices(payload);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        const fallbackInvoices = allInvoices.filter(
          (invoice) =>
            String(invoice?.status || '').toUpperCase() === selectedStatus
        );

        setInvoices(fallbackInvoices);
        toast.error('Không thể lọc giao dịch theo trạng thái!');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [allInvoices, hasBootstrapped, loadInvoicesByStatus, selectedStatus]);

  const sortedInvoices = useMemo(
    () =>
      [...invoices].sort(
        (left, right) =>
          new Date(
            right?.showTime?.showDate || right?.createdAt || 0
          ).getTime() -
          new Date(left?.showTime?.showDate || left?.createdAt || 0).getTime()
      ),
    [invoices]
  );

  const statusCounts = useMemo(
    () =>
      allInvoices.reduce(
        (accumulator, invoice) => {
          const status = String(invoice?.status || '').toUpperCase();

          accumulator.ALL += 1;

          if (Object.prototype.hasOwnProperty.call(accumulator, status)) {
            accumulator[status] += 1;
          }

          return accumulator;
        },
        {
          ALL: 0,
          PENDING: 0,
          PAID: 0,
          PROCESSING: 0,
          USED: 0,
          CANCELLED: 0,
          REFUNDED: 0,
        }
      ),
    [allInvoices]
  );

  const summary = useMemo(() => {
    const total = allInvoices.length;
    const paid = allInvoices.filter((item) => item?.status === 'PAID').length;
    const used = allInvoices.filter((item) => item?.status === 'USED').length;
    const totalSpent = allInvoices.reduce(
      (sum, item) => sum + Number(item?.totalMoney ?? 0),
      0
    );

    return { total, paid, used, totalSpent };
  }, [allInvoices]);

  const activeFilterLabel =
    STATUS_FILTERS.find((item) => item.value === selectedStatus)?.label ||
    'Tất cả';

  const handleViewDetail = (invoice) => {
    const movieId = resolveMovieId(invoice);

    if (!movieId) {
      toast.error('Không tìm thấy phim tương ứng để mở chi tiết.');
      return;
    }

    navigate(`/detail-movie/${movieId}`);
  };

  const handleReview = (invoice) => {
    const movieId = resolveMovieId(invoice);

    if (!movieId) {
      toast.error('Không tìm thấy phim tương ứng để mở khu vực đánh giá.');
      return;
    }

    navigate(`/detail-movie/${movieId}#movie-reviews`);
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
          Theo dõi các đơn vé đã thanh toán, trạng thái xuất vé và lọc nhanh
          theo tình trạng giao dịch mới từ hệ thống.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
        }}
      >
        <SummaryCard
          title="Tổng giao dịch"
          value={`${summary.total} đơn`}
          icon={<AssignmentRounded />}
          color="#083d7c"
          bg={alpha('#083d7c', 0.08)}
        />
        <SummaryCard
          title="Đã thanh toán"
          value={`${summary.paid} đơn`}
          icon={<LocalOfferRounded />}
          color="#c2410c"
          bg={alpha('#fb923c', 0.15)}
        />
        <SummaryCard
          title="Đã xuất vé"
          value={`${summary.used} đơn`}
          icon={<AccessTimeRounded />}
          color="#15803d"
          bg={alpha('#16a34a', 0.12)}
        />
        <SummaryCard
          title="Tổng chi tiêu"
          value={currencyFormatter(summary.totalSpent)}
          icon={<MovieRounded />}
          color="#cf6d05"
          bg={alpha('#cf6d05', 0.1)}
        />
      </Box>

      <Paper sx={{ ...shellPaperSx, p: { xs: 2, md: 2.25 } }}>
        <Stack spacing={1.75}>
          <Box>
            <Typography
              sx={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}
            >
              Lọc theo trạng thái
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {STATUS_FILTERS.map((filter) => {
              const isActive = selectedStatus === filter.value;
              const count = statusCounts[filter.value] ?? 0;

              return (
                <Button
                  key={filter.value}
                  type="button"
                  onClick={() => setSelectedStatus(filter.value)}
                  sx={{
                    minHeight: 40,
                    px: 1.75,
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: isActive ? '#fff' : '#334155',
                    bgcolor: isActive ? '#083d7c' : alpha('#083d7c', 0.06),
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: isActive ? '#062d5c' : alpha('#083d7c', 0.12),
                      boxShadow: 'none',
                    },
                  }}
                >
                  {filter.label}
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 1,
                      py: 0.25,
                      borderRadius: '999px',
                      fontSize: 12,
                      lineHeight: 1.2,
                      bgcolor: isActive
                        ? alpha('#ffffff', 0.18)
                        : alpha('#0f172a', 0.06),
                      color: isActive ? '#fff' : '#475569',
                    }}
                  >
                    {count}
                  </Box>
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Paper>

      {isLoading ? (
        <Stack spacing={2}>
          <LoadingCard />
          <LoadingCard />
        </Stack>
      ) : sortedInvoices.length > 0 ? (
        <Stack spacing={2}>
          {sortedInvoices.map((invoice, index) => {
            const statusMeta = getStatusMeta(invoice?.status);
            const reviewActionLabel = canOpenReviewComposer(invoice)
              ? 'Đánh giá'
              : 'Xem đánh giá';

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
                        borderRadius: '16px',
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
                        color: '#083d7c',
                        lineHeight: 1.2,
                      }}
                    >
                      {invoice?.movie?.title || 'Chưa có tên phim'}
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={infoItemSx}>
                        <CalendarMonthRounded
                          sx={{ color: '#083d7c', fontSize: 22 }}
                        />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Ngày chiếu:</strong>{' '}
                          {formatShowDate(invoice?.showTime?.showDate)}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <AccessTimeRounded
                          sx={{ color: '#083d7c', fontSize: 22 }}
                        />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Giờ chiếu:</strong>{' '}
                          {formatShowTime(invoice?.showTime?.startTime)}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <TheaterComedyRounded
                          sx={{ color: '#083d7c', fontSize: 22 }}
                        />
                        <Typography sx={{ fontSize: 15.5, color: '#1e293b' }}>
                          <strong>Rạp chiếu:</strong>{' '}
                          {invoice?.movieTheater?.name || 'Chưa cập nhật'}
                        </Typography>
                      </Box>

                      <Box sx={infoItemSx}>
                        <LocalOfferRounded
                          sx={{ color: statusMeta.color, fontSize: 22 }}
                        />
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
                      Tổng tiền thanh toán:{' '}
                      {currencyFormatter(Number(invoice?.totalMoney) || 0)}
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
                        borderColor: alpha('#083d7c', 0.28),
                        color: '#083d7c',
                        backgroundColor: alpha('#083d7c', 0.04),
                        '&:hover': {
                          borderColor: '#083d7c',
                          backgroundColor: alpha('#083d7c', 0.08),
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
                      title={reviewActionLabel}
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
              bgcolor: alpha('#083d7c', 0.08),
              color: '#083d7c',
            }}
          >
            <AssignmentRounded />
          </Avatar>
          <Typography
            sx={{ mt: 2, fontSize: 20, fontWeight: 700, color: '#1e293b' }}
          >
            Không có giao dịch nào
          </Typography>
          <Typography sx={{ mt: 1, color: '#64748b', fontSize: 14.5 }}>
            {selectedStatus === 'ALL'
              ? 'Khi bạn hoàn tất thanh toán vé, lịch sử giao dịch sẽ hiển thị tại đây.'
              : `Hiện chưa có giao dịch nào ở trạng thái "${activeFilterLabel}".`}
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default TransactionHistory;
