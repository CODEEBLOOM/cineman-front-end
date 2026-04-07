import { findAllPromotions } from '@apis/promotionService';
import {
  extractPromotionTypeList,
  findAllPromotionTypesAdmin,
  normalizePromotionType,
} from '@apis/promotionTypeAdminService';
import {
  extractPromotionList,
  normalizePromotion,
} from '@apis/promotionAdminService';
import { accountPrimaryButtonSx } from '@component/account-customer/accountUiStyles';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import AddCardRounded from '@mui/icons-material/AddCardRounded';
import CardGiftcardRounded from '@mui/icons-material/CardGiftcardRounded';
import ConfirmationNumberRounded from '@mui/icons-material/ConfirmationNumberRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import LocalMoviesRounded from '@mui/icons-material/LocalMoviesRounded';
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded';
import PopcornRounded from '@mui/icons-material/LocalDiningRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { currencyFormatter } from '@libs/Utils';
import DateFormatter from '@utils/DateFormatter';
import { PROMOTION_ACTIVATED_EVENT } from '@utils/promotionRealtime';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const MotionPaper = motion(Paper);

const shellPaperSx = {
  borderRadius: '16px',
  border: '1px solid rgba(148,163,184,0.18)',
  backgroundColor: '#fff',
  boxShadow: '0 14px 34px rgba(15,23,42,0.08)',
};

const ALL_FILTER_KEY = 'all';

const fallbackDescriptions = {
  movie: [
    'Áp dụng cho vé phim tại quầy và trực tuyến.',
    'Nhập mã khi thanh toán để nhận ưu đãi.',
  ],
  combo: [
    'Áp dụng cho combo bắp nước trong đơn hàng.',
    'Ưu đãi có thể thay đổi theo từng suất chiếu.',
  ],
  general: [
    'Áp dụng cho các đơn hàng hợp lệ theo điều kiện.',
    'Kiểm tra kỹ thời hạn trước khi sử dụng.',
  ],
};

const readPromotionStatus = (promotion) =>
  String(promotion?.status ?? '').trim().toUpperCase();

const isVoucherAvailable = (promotion) => {
  const status = readPromotionStatus(promotion);
  return status === 'ACTIVE' || status === 'AVAILABLE' || status === 'UNUSED';
};

const isVoucherExpired = (promotion) => {
  if (!promotion?.endDate) {
    return false;
  }

  return new Date(promotion.endDate).getTime() < Date.now();
};

const isVoucherExpiringSoon = (promotion) => {
  if (!promotion?.endDate || isVoucherExpired(promotion)) {
    return false;
  }

  const timeLeft = new Date(promotion.endDate).getTime() - Date.now();
  return timeLeft <= 2 * 24 * 60 * 60 * 1000;
};

const resolveVoucherCategory = (promotion) => {
  const source = `${promotion?.promotionTypeName ?? ''} ${promotion?.name ?? ''} ${promotion?.content ?? ''}`.toLowerCase();

  if (
    source.includes('combo') ||
    source.includes('bắp') ||
    source.includes('nước') ||
    source.includes('popcorn') ||
    source.includes('snack')
  ) {
    return 'combo';
  }

  if (
    source.includes('vé') ||
    source.includes('phim') ||
    source.includes('movie') ||
    source.includes('ticket')
  ) {
    return 'movie';
  }

  return 'general';
};

const resolveVoucherIcon = (category) => {
  if (category === 'combo') {
    return <PopcornRounded sx={{ fontSize: 28 }} />;
  }

  if (category === 'movie') {
    return <LocalMoviesRounded sx={{ fontSize: 28 }} />;
  }

  return <CardGiftcardRounded sx={{ fontSize: 28 }} />;
};

const resolveVoucherTheme = (category, expired) => {
  if (expired) {
    return {
      accent: '#64748b',
      accentSoft: alpha('#64748b', 0.12),
      iconBg: alpha('#64748b', 0.16),
      surface:
        'linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.96) 100%)',
      glow: alpha('#94a3b8', 0.16),
    };
  }

  if (category === 'combo') {
    return {
      accent: '#cf6d05',
      accentSoft: alpha('#cf6d05', 0.14),
      iconBg: alpha('#cf6d05', 0.18),
      surface:
        'linear-gradient(135deg, rgba(255,247,237,0.98) 0%, rgba(255,255,255,1) 42%, rgba(255,237,213,0.94) 100%)',
      glow: alpha('#fb923c', 0.18),
    };
  }

  return {
    accent: '#23486c',
    accentSoft: alpha('#23486c', 0.12),
    iconBg: alpha('#23486c', 0.18),
    surface:
      'linear-gradient(135deg, rgba(239,246,255,0.98) 0%, rgba(255,255,255,1) 42%, rgba(224,242,254,0.92) 100%)',
    glow: alpha('#38bdf8', 0.14),
  };
};

const formatDateLabel = (value) => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  return new DateFormatter(value).format('DD/MM/YYYY');
};

const formatDiscountLabel = (promotion) => {
  const rawDiscount = Number(promotion?.discount ?? 0);
  const source = `${promotion?.name ?? ''} ${promotion?.content ?? ''}`.toLowerCase();
  const looksLikeMoney =
    rawDiscount >= 1000 ||
    source.includes('k') ||
    source.includes('vnđ') ||
    source.includes('vnd') ||
    source.includes('đ');

  if (looksLikeMoney) {
    return `Giảm ${currencyFormatter(rawDiscount)}`;
  }

  if (rawDiscount > 0) {
    return `Giảm ${rawDiscount}%`;
  }

  return promotion?.name || 'Ưu đãi thành viên';
};

const buildDescriptionLines = (promotion, category) => {
  const content = String(promotion?.content ?? '')
    .split(/\r?\n|•|-/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (content.length > 0) {
    return content;
  }

  const fallback = [...(fallbackDescriptions[category] ?? fallbackDescriptions.general)];

  if (Number(promotion?.limitAmount ?? 0) > 0) {
    fallback.unshift(
      `Áp dụng cho đơn hàng từ ${currencyFormatter(Number(promotion.limitAmount))}.`
    );
  }

  return fallback.slice(0, 3);
};

const getVoucherStatusMeta = (promotion) => {
  if (isVoucherExpired(promotion)) {
    return {
      label: 'Hết hạn',
      color: '#64748b',
      bg: alpha('#64748b', 0.14),
    };
  }

  if (!isVoucherAvailable(promotion)) {
    return {
      label: 'Đã sử dụng',
      color: '#dc2626',
      bg: alpha('#dc2626', 0.12),
    };
  }

  if (isVoucherExpiringSoon(promotion)) {
    return {
      label: 'Sắp hết hạn',
      color: '#c2410c',
      bg: alpha('#fb923c', 0.18),
    };
  }

  return {
    label: 'Sẵn sàng',
    color: '#0f766e',
    bg: alpha('#14b8a6', 0.16),
  };
};

const buildVoucherMeta = (promotion) => {
  const category = resolveVoucherCategory(promotion);
  return {
    ...promotion,
    category,
    expired: isVoucherExpired(promotion),
    expiringSoon: isVoucherExpiringSoon(promotion),
    available: isVoucherAvailable(promotion) && !isVoucherExpired(promotion),
    discountLabel: formatDiscountLabel(promotion),
    descriptions: buildDescriptionLines(promotion, category),
    theme: resolveVoucherTheme(category, isVoucherExpired(promotion)),
    statusMeta: getVoucherStatusMeta(promotion),
  };
};

const LoadingVoucherCard = ({ featured = false }) => (
  <Paper
    sx={{
      ...shellPaperSx,
      p: featured ? 2.5 : 2,
      minHeight: featured ? 320 : 232,
    }}
  >
    <Stack spacing={featured ? 2 : 1.5}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Skeleton variant="rounded" width={featured ? 66 : 54} height={featured ? 66 : 54} />
          <Box>
            <Skeleton variant="text" width={featured ? 200 : 140} height={40} />
            <Skeleton variant="text" width={featured ? 150 : 110} height={28} />
          </Box>
        </Stack>
        <Skeleton variant="rounded" width={92} height={36} />
      </Stack>
      <Skeleton variant="text" width="65%" height={36} />
      <Skeleton variant="rounded" width="100%" height={1} />
      <Skeleton variant="text" width="92%" height={28} />
      <Skeleton variant="text" width="84%" height={28} />
      <Skeleton variant="text" width="88%" height={28} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton variant="rounded" width={110} height={34} />
        <Skeleton variant="rounded" width={featured ? 138 : 116} height={44} />
      </Stack>
    </Stack>
  </Paper>
);

const VoucherCard = ({
  promotion,
  featured = false,
  onCopy,
  onUse,
}) => {
  const theme = promotion.theme;

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      whileHover={{
        y: -4,
        boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
      }}
      sx={{
        ...shellPaperSx,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        p: featured ? { xs: 2, md: 2.5 } : 2,
        background: theme.surface,
        borderColor: alpha(theme.accent, 0.18),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: featured ? -34 : -28,
          top: featured ? -40 : -34,
          width: featured ? 170 : 130,
          height: featured ? 170 : 130,
          borderRadius: '999px',
          backgroundColor: theme.glow,
          filter: 'blur(8px)',
        }}
      />

      <Stack spacing={featured ? 2.25 : 1.5} sx={{ position: 'relative', height: '100%' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1.5}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: featured ? 64 : 50,
                height: featured ? 64 : 50,
                borderRadius: '16px',
                bgcolor: theme.iconBg,
                color: theme.accent,
                boxShadow: `inset 0 1px 0 ${alpha('#ffffff', 0.72)}`,
              }}
            >
              {resolveVoucherIcon(promotion.category)}
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontSize: featured ? { xs: 26, md: 31 } : 17,
                  fontWeight: 800,
                  color: featured ? '#102033' : '#1e293b',
                  lineHeight: 1.15,
                }}
              >
                {promotion.discountLabel}
              </Typography>
              <Typography
                sx={{
                  mt: 0.45,
                  fontSize: featured ? 18 : 13.5,
                  fontWeight: featured ? 600 : 500,
                  color: '#475569',
                }}
              >
                Hết hạn: {formatDateLabel(promotion.endDate)}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label={promotion.statusMeta.label}
            sx={{
              height: featured ? 34 : 30,
              borderRadius: '10px',
              bgcolor: promotion.statusMeta.bg,
              color: promotion.statusMeta.color,
              fontWeight: 700,
            }}
          />
        </Stack>

        <Stack
          direction={featured ? { xs: 'column', sm: 'row' } : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems={featured ? { xs: 'flex-start', sm: 'center' } : 'center'}
        >
          <Typography
            sx={{
              fontSize: featured ? 18 : 14,
              fontWeight: 800,
              color: theme.accent,
              letterSpacing: '0.02em',
            }}
          >
            Mã: {promotion.code || 'Đang cập nhật'}
          </Typography>

          <Button
            variant="text"
            startIcon={<ContentCopyRounded />}
            onClick={() => onCopy(promotion.code)}
            disabled={!promotion.code}
            sx={{
              minHeight: 0,
              minWidth: 0,
              px: featured ? 2 : 1.4,
              py: 0.8,
              borderRadius: '12px',
              color: theme.accent,
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: theme.accentSoft,
              '&:hover': {
                bgcolor: alpha(theme.accent, 0.18),
              },
            }}
          >
            Sao chép
          </Button>
        </Stack>

        <Box
          sx={{
            borderTop: `1px solid ${alpha(theme.accent, 0.12)}`,
            pt: featured ? 1.8 : 1.25,
            display: 'grid',
            gap: 0.85,
          }}
        >
          {promotion.descriptions.map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: featured ? 16 : 13.2,
                color: '#334155',
                lineHeight: 1.55,
              }}
            >
              - {item}
            </Typography>
          ))}
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1.25}
          sx={{ mt: 'auto', pt: 0.6 }}
        >
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AccessTimeRounded sx={{ fontSize: featured ? 20 : 18, color: '#64748b' }} />
            <Typography sx={{ fontSize: featured ? 14.5 : 12.75, color: '#64748b' }}>
              {promotion.expiringSoon ? 'Ưu đãi cần dùng sớm' : 'Có thể áp dụng tại bước thanh toán'}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => onUse(promotion)}
            disabled={!promotion.available}
            sx={{
              ...accountPrimaryButtonSx,
              minHeight: featured ? 46 : 40,
              px: featured ? 3 : 2.2,
              fontSize: featured ? 15 : 13.5,
              boxShadow: 'none',
            }}
          >
            Sử dụng ngay
          </Button>
        </Stack>
      </Stack>
    </MotionPaper>
  );
};

const AddVoucherTile = ({ onOpen }) => (
  <MotionPaper
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: 'easeOut', delay: 0.08 }}
    whileHover={{
      y: -4,
      boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
    }}
    sx={{
      ...shellPaperSx,
      height: '100%',
      minHeight: 232,
      p: 2,
      borderStyle: 'dashed',
      borderColor: alpha('#23486c', 0.24),
      background:
        'linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(255,255,255,1) 100%)',
    }}
  >
    <Stack
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%', textAlign: 'center' }}
    >
      <Avatar
        sx={{
          width: 56,
          height: 56,
          bgcolor: alpha('#23486c', 0.08),
          color: '#23486c',
        }}
      >
        <AddCardRounded />
      </Avatar>

      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#1e293b' }}>
          Nạp voucher mới
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
          Nhập mã khuyến mãi mới hoặc nhận voucher từ các chương trình thành viên sắp tới.
        </Typography>
      </Box>

      <Button variant="contained" onClick={onOpen} sx={accountPrimaryButtonSx}>
        Nạp voucher mới
      </Button>
    </Stack>
  </MotionPaper>
);

const EmptyVoucherState = ({ onOpen }) => (
  <Paper
    sx={{
      ...shellPaperSx,
      p: { xs: 3, md: 4 },
      textAlign: 'center',
      background:
        'linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(255,255,255,1) 100%)',
    }}
  >
    <Avatar
      sx={{
        mx: 'auto',
        width: 62,
        height: 62,
        bgcolor: alpha('#23486c', 0.08),
        color: '#23486c',
      }}
    >
      <ConfirmationNumberRounded />
    </Avatar>
    <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 800, color: '#1e293b' }}>
      Chưa có voucher phù hợp
    </Typography>
    <Typography sx={{ mt: 1, fontSize: 14.5, color: '#64748b', lineHeight: 1.75 }}>
      Hãy thử thay đổi từ khóa tìm kiếm hoặc nạp thêm voucher mới để ưu đãi xuất hiện tại đây.
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddCardRounded />}
      onClick={onOpen}
      sx={{ ...accountPrimaryButtonSx, mt: 2.5 }}
    >
      Nạp voucher mới
    </Button>
  </Paper>
);

const VoucherCustomer = () => {
  const { user } = useSelector((state) => state.user);
  const [allPromotions, setAllPromotions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [promotionTypes, setPromotionTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedPromotionTypeId, setSelectedPromotionTypeId] =
    useState(ALL_FILTER_KEY);
  const [expiringSoonOnly, setExpiringSoonOnly] = useState(false);

  const fetchPromotionSummary = useCallback(async () => {
    const response = await findAllPromotions(user.userId);
    const payload = extractPromotionList(response).map((promotion) =>
      buildVoucherMeta(normalizePromotion(promotion))
    );

    setAllPromotions(payload);
    return payload;
  }, [user.userId]);

  const fetchPromotionTypes = useCallback(async () => {
    const response = await findAllPromotionTypesAdmin();
    const nextPromotionTypes = extractPromotionTypeList(response)
      .map(normalizePromotionType)
      .filter((promotionType) => promotionType?.id || promotionType?.promotionTypeId);

    setPromotionTypes(nextPromotionTypes);
    return nextPromotionTypes;
  }, []);

  const fetchPromotionList = useCallback(
    async ({ silent = false } = {}) => {
      setIsLoading(true);

      const params = {};

      if (selectedPromotionTypeId !== ALL_FILTER_KEY) {
        params.promotionTypeId = Number(selectedPromotionTypeId);
      }

      if (expiringSoonOnly) {
        params.expiringSoon = true;
      }

      try {
        const response = await findAllPromotions(
          user.userId,
          Object.keys(params).length > 0 ? params : undefined
        );
        const payload = extractPromotionList(response).map((promotion) =>
          buildVoucherMeta(normalizePromotion(promotion))
        );

        setPromotions(payload);
        return payload;
      } catch (error) {
        if (!silent) {
          toast.error('Không thể tải danh sách voucher!');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [expiringSoonOnly, selectedPromotionTypeId, user.userId]
  );

  useEffect(() => {
    let isMounted = true;

    document.title = 'Danh sách voucher - POLY CINEMAS';
    Promise.allSettled([
      fetchPromotionSummary(),
      fetchPromotionTypes(),
    ]).then(([promotionResult, promotionTypeResult]) => {
      if (!isMounted) {
        return;
      }

      if (promotionResult.status === 'fulfilled') {
        setAllPromotions(promotionResult.value);
      } else {
        toast.error('Không thể tải danh sách voucher!');
      }

      if (promotionTypeResult.status === 'fulfilled') {
        setPromotionTypes(promotionTypeResult.value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchPromotionSummary, fetchPromotionTypes]);

  useEffect(() => {
    fetchPromotionList().catch(() => {});
  }, [fetchPromotionList]);

  useEffect(() => {
    const handlePromotionActivated = () => {
      fetchPromotionSummary().catch(() => {});
      fetchPromotionList({ silent: true }).catch(() => {});
    };

    window.addEventListener(
      PROMOTION_ACTIVATED_EVENT,
      handlePromotionActivated
    );

    return () => {
      window.removeEventListener(
        PROMOTION_ACTIVATED_EVENT,
        handlePromotionActivated
      );
    };
  }, [fetchPromotionList, fetchPromotionSummary]);

  const handleCopy = (code) => {
    if (!code) {
      toast.info('Voucher này chưa có mã để sao chép.');
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success(`Đã sao chép mã ${code}`);
      })
      .catch(() => {
        toast.error('Không thể sao chép mã voucher trên thiết bị này.');
      });
  };

  const handleUseVoucher = (promotion) => {
    if (!promotion?.available) {
      toast.info('Voucher này hiện chưa thể sử dụng.');
      return;
    }

    handleCopy(promotion.code);
    toast.info('Mã voucher đã được sao chép. Bạn có thể dán ở bước thanh toán.');
  };

  const handleOpenRecharge = () => {
    toast.info('Tính năng nạp voucher mới sẽ được cập nhật khi API hỗ trợ.');
  };

  const promotionTypeFilters = useMemo(() => {
    const apiPromotionTypes = promotionTypes
      .map((promotionType) => ({
        key: String(promotionType?.id ?? promotionType?.promotionTypeId),
        label: promotionType?.name || promotionType?.code,
      }))
      .filter((item) => item.key && item.label);

    if (apiPromotionTypes.length > 0) {
      return [{ key: ALL_FILTER_KEY, label: 'Tất cả' }, ...apiPromotionTypes];
    }

    const fallbackPromotionTypes = allPromotions.reduce((accumulator, promotion) => {
      if (!promotion?.promotionTypeId || !promotion?.promotionTypeName) {
        return accumulator;
      }

      if (
        accumulator.some(
          (item) => String(item.key) === String(promotion.promotionTypeId)
        )
      ) {
        return accumulator;
      }

      accumulator.push({
        key: String(promotion.promotionTypeId),
        label: promotion.promotionTypeName,
      });

      return accumulator;
    }, []);

    return [{ key: ALL_FILTER_KEY, label: 'Tất cả' }, ...fallbackPromotionTypes];
  }, [allPromotions, promotionTypes]);

  const filteredPromotions = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return promotions
      .filter((promotion) => {
        if (!keyword) {
          return true;
        }

        return [
          promotion.name,
          promotion.code,
          promotion.content,
          promotion.discountLabel,
          promotion.promotionTypeName,
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword);
      })
      .sort((left, right) => {
        if (Number(right.available) !== Number(left.available)) {
          return Number(right.available) - Number(left.available);
        }

        if (Number(right.expiringSoon) !== Number(left.expiringSoon)) {
          return Number(right.expiringSoon) - Number(left.expiringSoon);
        }

        return new Date(left.endDate || 0).getTime() - new Date(right.endDate || 0).getTime();
      });
  }, [promotions, searchKeyword]);

  const summary = useMemo(() => {
    const total = allPromotions.length;
    const ready = allPromotions.filter((item) => item.available).length;
    const expiring = allPromotions.filter((item) => item.expiringSoon).length;

    return { total, ready, expiring };
  }, [allPromotions]);

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
          Danh sách voucher của tôi
        </Typography>
        <Typography sx={{ mt: 0.75, color: '#64748b', fontSize: 14.5, lineHeight: 1.7 }}>
          Theo dõi các mã ưu đãi đang sẵn sàng sử dụng, tìm nhanh voucher phù hợp và sao chép mã
          ngay trước khi thanh toán.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {[
          {
            label: 'Tổng voucher',
            value: `${summary.total} mã`,
            icon: <ConfirmationNumberRounded />,
            color: '#23486c',
            bg: alpha('#23486c', 0.08),
          },
          {
            label: 'Sẵn sàng dùng',
            value: `${summary.ready} mã`,
            icon: <LocalOfferRounded />,
            color: '#0f766e',
            bg: alpha('#14b8a6', 0.12),
          },
          {
            label: 'Sắp hết hạn',
            value: `${summary.expiring} mã`,
            icon: <AccessTimeRounded />,
            color: '#c2410c',
            bg: alpha('#fb923c', 0.16),
          },
        ].map((item) => (
          <Paper key={item.label} sx={{ ...shellPaperSx, p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: item.bg,
                  color: item.color,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13.5, color: '#64748b' }}>{item.label}</Typography>
                <Typography sx={{ mt: 0.25, fontSize: 18, fontWeight: 800, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ ...shellPaperSx, p: { xs: 2, md: 2.5 }, overflow: 'hidden' }}>
        <Stack spacing={2.25}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 19, fontWeight: 800, color: '#1e293b' }}>
                Search & Filter
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#64748b' }}>
                Lọc nhanh theo loại khuyến mãi, voucher sắp hết hạn hoặc tìm mã cụ thể bạn muốn sử dụng.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddCardRounded />}
              onClick={handleOpenRecharge}
              sx={accountPrimaryButtonSx}
            >
              Nạp voucher mới
            </Button>
          </Box>

          <Stack spacing={1.5}>
            <TextField
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm kiếm voucher..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ color: '#64748b', fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  minHeight: 54,
                  '& fieldset': {
                    borderColor: alpha('#94a3b8', 0.42),
                  },
                  '&:hover fieldset': {
                    borderColor: alpha('#23486c', 0.38),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#23486c',
                  },
                },
              }}
            />

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {promotionTypeFilters.map((option) => {
                const isActive = selectedPromotionTypeId === option.key;

                return (
                  <Button
                    key={option.key}
                    type="button"
                    onClick={() => setSelectedPromotionTypeId(option.key)}
                    sx={{
                      minHeight: 40,
                      borderRadius: '999px',
                      px: 2,
                      color: isActive ? '#fff' : '#334155',
                      bgcolor: isActive ? '#23486c' : alpha('#23486c', 0.06),
                      fontSize: 13.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: isActive ? '#1f3f61' : alpha('#23486c', 0.12),
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}

              <Button
                type="button"
                onClick={() => setExpiringSoonOnly((prev) => !prev)}
                sx={{
                  minHeight: 40,
                  borderRadius: '999px',
                  px: 2,
                  color: expiringSoonOnly ? '#fff' : '#9a3412',
                  bgcolor: expiringSoonOnly ? '#c2410c' : alpha('#fb923c', 0.14),
                  fontSize: 13.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: expiringSoonOnly ? '#9a3412' : alpha('#fb923c', 0.22),
                    boxShadow: 'none',
                  },
                }}
              >
                Sắp hết hạn
              </Button>
            </Stack>
          </Stack>

          {isLoading ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'repeat(2, minmax(0, 1fr))',
                },
              }}
            >
              <LoadingVoucherCard />
              <LoadingVoucherCard />
              <LoadingVoucherCard />
              <LoadingVoucherCard />
            </Box>
          ) : filteredPromotions.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  lg: 'repeat(2, minmax(0, 1fr))',
                },
                alignItems: 'stretch',
              }}
            >
              {filteredPromotions.map((promotion, index) => (
                <VoucherCard
                  key={promotion.id ?? promotion.code ?? `${promotion.name}-${index}`}
                  promotion={promotion}
                  onCopy={handleCopy}
                  onUse={handleUseVoucher}
                />
              ))}
              <AddVoucherTile onOpen={handleOpenRecharge} />
            </Box>
          ) : (
            <EmptyVoucherState onOpen={handleOpenRecharge} />
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default VoucherCustomer;
