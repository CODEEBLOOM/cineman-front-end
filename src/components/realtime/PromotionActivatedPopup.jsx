import {
  accountPrimaryButtonSx,
  accountSecondaryButtonSx,
} from '@component/account-customer/accountUiStyles';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import CelebrationRounded from '@mui/icons-material/CelebrationRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ConfirmationNumberRounded from '@mui/icons-material/ConfirmationNumberRounded';
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded';
import { alpha, Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material';
import { currencyFormatter } from '@libs/Utils';
import DateFormatter from '@utils/DateFormatter';
import { AnimatePresence, motion } from 'framer-motion';

const MotionBox = motion(Box);

const formatDateLabel = (value) => {
  if (!value) {
    return 'Cập nhật sau';
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

  return promotion?.name || 'Ưu đãi mới';
};

const formatMinimumAmountLabel = (promotion) => {
  const limitAmount = Number(promotion?.limitAmount ?? 0);

  if (limitAmount <= 0) {
    return 'Tất cả đơn hợp lệ';
  }

  return `Đơn từ ${currencyFormatter(limitAmount)}`;
};

const buildSummary = (promotion) => {
  const content = String(promotion?.content ?? '').trim();

  if (content) {
    return content;
  }

  if (promotion?.promotionTypeName) {
    return `Voucher ${promotion.promotionTypeName.toLowerCase()} đã được thêm vào tài khoản của bạn.`;
  }

  return 'Ưu đãi đã sẵn sàng trong tài khoản, bạn có thể sao chép mã và dùng ở bước thanh toán.';
};

const PromotionActivatedPopup = ({
  open,
  promotion,
  onClose,
  onCopy,
  onViewVouchers,
}) => {
  const discountLabel = formatDiscountLabel(promotion);
  const summary = buildSummary(promotion);
  const hasCode = Boolean(promotion?.code);

  return (
    <AnimatePresence>
      {open && promotion ? (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3 },
            backgroundColor: 'rgba(15, 23, 42, 0.42)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <MotionBox
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-activated-title"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              overflow: 'hidden',
              borderRadius: { xs: '28px', sm: '32px' },
              border: '1px solid rgba(215, 169, 75, 0.32)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
              boxShadow:
                '0 30px 80px rgba(15, 23, 42, 0.2), 0 8px 24px rgba(215, 169, 75, 0.16)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle at top, rgba(245, 217, 123, 0.2), transparent 42%)',
              }}
            />

            <IconButton
              aria-label="Đóng popup voucher"
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                color: '#dc7f67',
                bgcolor: alpha('#ffffff', 0.88),
                border: '1px solid rgba(220, 127, 103, 0.18)',
                '&:hover': {
                  bgcolor: '#ffffff',
                },
              }}
            >
              <CloseRounded />
            </IconButton>

            <Stack spacing={2.5} sx={{ position: 'relative', p: { xs: 2.5, sm: 3.5 } }}>
              <Box sx={{ position: 'relative', textAlign: 'center', pt: 1 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: '14%',
                    top: 18,
                    width: 12,
                    height: 12,
                    borderRadius: '999px',
                    bgcolor: alpha('#f5d97b', 0.9),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: '18%',
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: '999px',
                    bgcolor: alpha('#e98b73', 0.88),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    left: '22%',
                    top: 56,
                    width: 8,
                    height: 8,
                    borderRadius: '999px',
                    bgcolor: alpha('#23486c', 0.16),
                  }}
                />

                <Box
                  sx={{
                    mx: 'auto',
                    display: 'grid',
                    placeItems: 'center',
                    width: 86,
                    height: 86,
                    borderRadius: '28px',
                    background:
                      'linear-gradient(135deg, rgba(245, 217, 123, 0.28) 0%, rgba(233, 139, 115, 0.22) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.74)',
                    color: '#cf6d05',
                  }}
                >
                  <CelebrationRounded sx={{ fontSize: 44 }} />
                </Box>

                <Typography
                  id="promotion-activated-title"
                  sx={{
                    mt: 2.25,
                    color: '#17324d',
                    fontSize: { xs: 30, sm: 38 },
                    fontWeight: 900,
                    lineHeight: 1.05,
                  }}
                >
                  Chúc mừng bạn!
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    mx: 'auto',
                    maxWidth: 420,
                    color: '#5b6b7e',
                    fontSize: { xs: 14.5, sm: 15.5 },
                    lineHeight: 1.7,
                  }}
                >
                  Voucher mới đã được thêm vào tài khoản của bạn. Sao chép mã ngay hoặc mở danh
                  sách voucher để xem chi tiết.
                </Typography>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '28px',
                  border: '1px solid rgba(215, 169, 75, 0.3)',
                  background:
                    'linear-gradient(135deg, rgba(255,251,235,0.98) 0%, rgba(255,255,255,1) 52%, rgba(239,246,255,0.98) 100%)',
                  boxShadow: '0 18px 38px rgba(15, 23, 42, 0.08)',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 2.25, sm: 2.75 },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: -18,
                    top: '50%',
                    width: 36,
                    height: 36,
                    transform: 'translateY(-50%)',
                    borderRadius: '999px',
                    bgcolor: '#fff',
                    border: '1px solid rgba(215, 169, 75, 0.22)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: -18,
                    top: '50%',
                    width: 36,
                    height: 36,
                    transform: 'translateY(-50%)',
                    borderRadius: '999px',
                    bgcolor: '#fff',
                    border: '1px solid rgba(215, 169, 75, 0.22)',
                  }}
                />

                <Stack spacing={1.35}>
                  <Stack direction="row" justifyContent="space-between" spacing={1.5}>
                    <Typography
                      sx={{
                        color: '#cf9a2c',
                        fontSize: { xs: 32, sm: 40 },
                        fontWeight: 900,
                        lineHeight: 1.05,
                      }}
                    >
                      {discountLabel}
                    </Typography>

                    {promotion?.promotionTypeName ? (
                      <Chip
                        label={promotion.promotionTypeName}
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: alpha('#23486c', 0.08),
                          color: '#23486c',
                          fontWeight: 700,
                        }}
                      />
                    ) : null}
                  </Stack>

                  <Box
                    sx={{
                      borderRadius: '20px',
                      border: '1px dashed rgba(35, 72, 108, 0.26)',
                      bgcolor: alpha('#ffffff', 0.72),
                      px: 2,
                      py: 1.4,
                    }}
                  >
                    <Typography sx={{ color: '#64748b', fontSize: 12.5, fontWeight: 700 }}>
                      Mã voucher
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.45,
                        color: '#17324d',
                        fontSize: { xs: 24, sm: 28 },
                        fontWeight: 900,
                        letterSpacing: '0.04em',
                        wordBreak: 'break-word',
                      }}
                    >
                      {promotion?.code || 'Đã lưu trong tài khoản'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: 1.25,
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                }}
              >
                {[
                  {
                    icon: <AccessTimeRounded sx={{ fontSize: 20 }} />,
                    label: 'Hạn dùng',
                    value: formatDateLabel(promotion?.endDate),
                    color: '#23486c',
                    bg: alpha('#23486c', 0.08),
                  },
                  {
                    icon: <LocalOfferRounded sx={{ fontSize: 20 }} />,
                    label: 'Điều kiện',
                    value: formatMinimumAmountLabel(promotion),
                    color: '#cf6d05',
                    bg: alpha('#cf6d05', 0.1),
                  },
                  {
                    icon: <ConfirmationNumberRounded sx={{ fontSize: 20 }} />,
                    label: 'Trạng thái',
                    value: hasCode ? 'Sẵn sàng sử dụng' : 'Đã lưu vào tài khoản',
                    color: '#0f766e',
                    bg: alpha('#14b8a6', 0.12),
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      borderRadius: '20px',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      bgcolor: '#fff',
                      px: 1.5,
                      py: 1.4,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-grid',
                        placeItems: 'center',
                        width: 34,
                        height: 34,
                        borderRadius: '12px',
                        bgcolor: item.bg,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography sx={{ mt: 1.05, color: '#64748b', fontSize: 12.5 }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.4,
                        color: '#17324d',
                        fontSize: 14.5,
                        fontWeight: 800,
                        lineHeight: 1.45,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography
                sx={{
                  color: '#526173',
                  fontSize: 14,
                  lineHeight: 1.75,
                  textAlign: 'center',
                }}
              >
                {summary}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onCopy(promotion?.code)}
                  sx={{
                    ...accountPrimaryButtonSx,
                    minHeight: 54,
                    fontSize: 15.5,
                  }}
                >
                  {hasCode ? 'Sao chép mã voucher' : 'Đã lưu vào tài khoản'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onViewVouchers}
                  sx={{
                    ...accountSecondaryButtonSx,
                    minHeight: 54,
                    fontSize: 15.5,
                    borderWidth: 1,
                  }}
                >
                  Xem voucher của tôi
                </Button>
              </Stack>
            </Stack>
          </MotionBox>
        </MotionBox>
      ) : null}
    </AnimatePresence>
  );
};

export default PromotionActivatedPopup;
