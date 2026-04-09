import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import MarkEmailReadRounded from '@mui/icons-material/MarkEmailReadRounded';
import SecurityRounded from '@mui/icons-material/SecurityRounded';
import VpnKeyRounded from '@mui/icons-material/VpnKeyRounded';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const recoveryHighlights = [
  {
    icon: <MarkEmailReadRounded />,
    title: 'Gửi liên kết khôi phục qua email',
    description:
      'Hệ thống gửi liên kết đặt lại mật khẩu tới đúng tài khoản đã đăng ký và đang hoạt động.',
  },
  {
    icon: <VpnKeyRounded />,
    title: 'Token reset riêng cho từng yêu cầu',
    description:
      'Mật khẩu mới chỉ được cập nhật khi token hợp lệ và thông tin xác nhận trùng khớp.',
  },
  {
    icon: <SecurityRounded />,
    title: 'Mở công khai nhưng vẫn an toàn',
    description:
      'Hai endpoint quên mật khẩu và đặt lại mật khẩu là public, phù hợp cho luồng khôi phục tài khoản.',
  },
];

const authPalette = {
  textPrimary: '#f7fbff',
  textMuted: 'rgba(214, 228, 245, 0.76)',
  accentPink: '#ff8fb4',
  borderSoft: 'rgba(110, 170, 226, 0.26)',
  panelTop: 'rgba(13, 40, 79, 0.9)',
  panelBottom: 'rgba(8, 24, 52, 0.94)',
};

const AuthRecoveryLayout = ({
  badge,
  title,
  description,
  backTo = '/auth/login?auth=login',
  backLabel = 'Quay lại đăng nhập',
  children,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 5, md: 7, lg: 8 },
        minHeight: { xs: 'auto', lg: 'calc(100vh - 184px)' },
        color: authPalette.textPrimary,
        background:
          'radial-gradient(circle at 18% 18%, rgba(255, 143, 180, 0.18), transparent 18%), radial-gradient(circle at 78% 16%, rgba(74, 163, 240, 0.18), transparent 20%), linear-gradient(180deg, rgba(5, 20, 46, 0.96) 0%, rgba(7, 27, 58, 0.94) 30%, rgba(6, 22, 49, 0.96) 70%, rgba(4, 15, 34, 0.98) 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(4, 16, 38, 0.78) 0%, rgba(9, 27, 58, 0.52) 26%, rgba(11, 34, 72, 0.24) 50%, rgba(9, 27, 58, 0.52) 74%, rgba(4, 16, 38, 0.78) 100%), repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 128px), repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0 1px, transparent 1px 96px)',
          opacity: 0.92,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 12% 22%, rgba(255, 143, 180, 0.16), transparent 8%), radial-gradient(circle at 30% 16%, rgba(78, 167, 241, 0.18), transparent 9%), radial-gradient(circle at 74% 20%, rgba(78, 167, 241, 0.18), transparent 10%), radial-gradient(circle at 88% 15%, rgba(255, 143, 180, 0.14), transparent 8%)',
          filter: 'blur(18px)',
          opacity: 0.88,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 5, lg: 7 },
            alignItems: 'center',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'minmax(0, 1fr) minmax(420px, 580px)',
            },
            minHeight: { lg: 'calc(100vh - 280px)' },
          }}
        >
          <Box sx={{ maxWidth: 620 }}>
            <Typography
              sx={{
                mb: 1.5,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: authPalette.accentPink,
              }}
            >
              Khôi phục tài khoản
            </Typography>

            <Typography
              sx={{
                maxWidth: 580,
                fontSize: { xs: 34, md: 48, xl: 56 },
                lineHeight: 1.02,
                fontWeight: 800,
                textWrap: 'balance',
              }}
            >
              Lấy lại quyền truy cập một cách gọn gàng và an toàn.
            </Typography>

            <Typography
              sx={{
                mt: 2.25,
                maxWidth: 540,
                fontSize: { xs: 15, md: 18 },
                lineHeight: 1.8,
                color: authPalette.textMuted,
              }}
            >
              Luồng quên mật khẩu mới đã sẵn sàng cho email reset link, token
              riêng và thao tác đặt lại mật khẩu ngay trên frontend.
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 4 }}>
              {recoveryHighlights.map((item) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.8}
                  alignItems="flex-start"
                  sx={{
                    py: 1.4,
                    borderTop: '1px solid rgba(121, 178, 230, 0.12)',
                    color: authPalette.textPrimary,
                  }}
                >
                  <Box
                    sx={{
                      mt: 0.2,
                      display: 'grid',
                      placeItems: 'center',
                      width: 42,
                      height: 42,
                      borderRadius: '14px',
                      color: authPalette.accentPink,
                      backgroundColor: alpha(authPalette.accentPink, 0.12),
                      boxShadow: `0 0 0 1px ${alpha(authPalette.accentPink, 0.16)}`,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.45,
                        maxWidth: 470,
                        fontSize: 14.5,
                        lineHeight: 1.75,
                        color: 'rgba(214, 228, 245, 0.72)',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: 580,
              mx: { xs: 0, lg: 'auto' },
              px: { xs: 2.5, md: 3.5 },
              pt: { xs: 2.6, md: 3.1 },
              pb: { xs: 3, md: 3.5 },
              borderRadius: { xs: '28px', md: '32px' },
              border: `1px solid ${authPalette.borderSoft}`,
              background: `linear-gradient(180deg, ${authPalette.panelTop} 0%, ${authPalette.panelBottom} 100%)`,
              backdropFilter: 'blur(18px)',
              boxShadow: '0 40px 120px rgba(2, 10, 26, 0.5)',
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Button
                component={RouterLink}
                to={backTo}
                startIcon={<ArrowBackRounded />}
                sx={{
                  mb: 2,
                  px: 0,
                  minWidth: 0,
                  color: 'rgba(214, 228, 245, 0.72)',
                  fontSize: 14.5,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                {backLabel}
              </Button>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mb: 1.5,
                  width: 'fit-content',
                  borderRadius: '999px',
                  px: 1.2,
                  py: 0.7,
                  color: '#ff8fb4',
                  backgroundColor: alpha('#ff8fb4', 0.1),
                  boxShadow: `0 0 0 1px ${alpha('#ff8fb4', 0.14)}`,
                }}
              >
                <SecurityRounded sx={{ fontSize: 18 }} />
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                  }}
                >
                  {badge}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: { xs: 29, md: 34 },
                  lineHeight: 1.08,
                  fontWeight: 800,
                  color: '#f7fbff',
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  mt: 1.2,
                  maxWidth: 460,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: 'rgba(214, 228, 245, 0.74)',
                }}
              >
                {description}
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  '& .MuiFormHelperText-root': {
                    mx: 0.5,
                    mt: 1,
                    color: '#ff9dba',
                  },
                }}
              >
                {children}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthRecoveryLayout;
