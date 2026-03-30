import LoginComponent from '@component/auth/LoginComponent';
import RegisterComponent from '@component/auth/RegisterComponent';
import EventSeatRounded from '@mui/icons-material/EventSeatRounded';
import LocalMoviesOutlined from '@mui/icons-material/LocalMoviesOutlined';
import StarsRounded from '@mui/icons-material/StarsRounded';
import {
  Box,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

const heroHighlights = [
  {
    icon: <LocalMoviesOutlined />,
    title: 'Đặt vé nhanh',
    description: 'Vào thẳng lịch chiếu, chọn ghế và giữ mạch đặt vé liền mạch.',
  },
  {
    icon: <StarsRounded />,
    title: 'Ưu đãi thành viên',
    description:
      'Theo dõi voucher, điểm thưởng và khuyến mãi ngay trong tài khoản.',
  },
  {
    icon: <EventSeatRounded />,
    title: 'Trải nghiệm cá nhân hóa',
    description:
      'Lưu lịch sử giao dịch và tiếp tục hành trình xem phim bất cứ lúc nào.',
  },
];

const authPalette = {
  pageBase: '#06152f',
  pageMid: '#0a2143',
  pageGlow: '#163d6f',
  panelTop: 'rgba(13, 40, 79, 0.9)',
  panelBottom: 'rgba(8, 24, 52, 0.94)',
  borderSoft: 'rgba(110, 170, 226, 0.26)',
  textPrimary: '#f7fbff',
  textMuted: 'rgba(214, 228, 245, 0.76)',
  accentBlue: '#4aa3f0',
  accentPink: '#ff8fb4',
  accentPinkStrong: '#f35f95',
};

const authShellFieldSx = {
  '& .text-dark-100': {
    color: authPalette.textMuted,
  },
  '& .MuiFormHelperText-root': {
    mx: 0.5,
    mt: 1,
    color: '#ff9dba',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    color: authPalette.textPrimary,
    background:
      'linear-gradient(180deg, rgba(7, 22, 55, 0.9) 0%, rgba(10, 28, 66, 0.8) 100%)',
    backdropFilter: 'blur(10px)',
    transition:
      'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
    '& fieldset': {
      borderColor: 'rgba(255, 143, 180, 0.28)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(116, 180, 238, 0.46)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(74, 163, 240, 0.16)',
    },
    '&.Mui-focused fieldset': {
      borderColor: authPalette.accentPink,
    },
  },
  '& .MuiInputBase-input': {
    color: authPalette.textPrimary,
    '&::placeholder': {
      color: 'rgba(214, 228, 245, 0.48)',
      opacity: 1,
    },
  },
  '& .MuiSelect-select': {
    color: authPalette.textPrimary,
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(255, 143, 180, 0.78)',
  },
  '& .MuiButton-contained': {
    width: '100%',
    borderRadius: '999px',
    py: 1.5,
    fontWeight: 800,
    textTransform: 'none',
    boxShadow: '0 18px 40px rgba(3, 14, 34, 0.28)',
  },
  '& .MuiButton-contained:hover': {
    boxShadow: '0 22px 44px rgba(3, 14, 34, 0.34)',
    transform: 'translateY(-1px)',
  },
};

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const authPage = searchParams.get('auth');
  const [value, setValue] = useState(authPage === 'register' ? 1 : 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setValue(authPage === 'register' ? 1 : 0);
  }, [authPage]);

  const handleTabNavigation = (newValue) => {
    setValue(newValue);
    navigate(`/auth/login?auth=${newValue === 0 ? 'login' : 'register'}`, {
      replace: true,
    });
  };

  const handleChange = (_, newValue) => {
    handleTabNavigation(newValue);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

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
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 'auto 0 0',
          height: { xs: '26%', md: '30%' },
          background:
            'linear-gradient(180deg, rgba(3, 12, 28, 0) 0%, rgba(4, 15, 34, 0.62) 36%, rgba(3, 10, 24, 0.98) 100%)',
          pointerEvents: 'none',
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
              lg: 'minmax(0, 1fr) minmax(460px, 620px)',
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
              Không gian đăng nhập
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
              Mở cánh màn nhung, trở lại Poly Cinemas chỉ trong vài giây.
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
              Đăng nhập để chọn suất chiếu nhanh hơn, theo dõi tài khoản thành
              viên và lưu trọn lịch sử đặt vé trong một trải nghiệm mang cảm
              giác của sảnh rạp trước giờ công chiếu.
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 4 }}>
              {heroHighlights.map((item) => (
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
              alignSelf: 'center',
              width: '100%',
              maxWidth: 620,
              mx: { xs: 0, lg: 'auto' },
              px: { xs: 2.5, md: 3.5 },
              pt: { xs: 2.2, md: 2.6 },
              pb: { xs: 3, md: 3.5 },
              borderRadius: { xs: '28px', md: '32px' },
              border: `1px solid ${authPalette.borderSoft}`,
              background: `linear-gradient(180deg, ${authPalette.panelTop} 0%, ${authPalette.panelBottom} 100%)`,
              backdropFilter: 'blur(18px)',
              boxShadow: '0 40px 120px rgba(2, 10, 26, 0.5)',
              animation: 'authPanelFloat 8s ease-in-out infinite',
              '@keyframes authPanelFloat': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-6px)' },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at top right, rgba(78, 167, 241, 0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(255, 143, 180, 0.12), transparent 22%), linear-gradient(135deg, rgba(255, 255, 255, 0.03), transparent 42%)',
                opacity: 0.95,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="auth tabs"
                sx={{
                  minHeight: 62,
                  borderBottom: '1px solid rgba(121, 178, 230, 0.14)',
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '999px',
                    background:
                      'linear-gradient(90deg, rgba(74, 163, 240, 0.96) 0%, rgba(43, 127, 203, 1) 100%)',
                  },
                }}
              >
                <Tab
                  disableRipple
                  label="Đăng nhập"
                  {...a11yProps(0)}
                  sx={{
                    minHeight: 62,
                    color: 'rgba(226, 235, 244, 0.7)',
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    '&.Mui-selected': {
                      color: authPalette.accentPink,
                    },
                  }}
                />
                <Tab
                  disableRipple
                  label="Đăng ký"
                  {...a11yProps(1)}
                  sx={{
                    minHeight: 62,
                    color: 'rgba(226, 235, 244, 0.7)',
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    '&.Mui-selected': {
                      color: authPalette.accentPink,
                    },
                  }}
                />
              </Tabs>

              {value === 0 ? (
                <Box
                  role="tabpanel"
                  id="simple-tabpanel-0"
                  aria-labelledby="simple-tab-0"
                  sx={{ ...authShellFieldSx, pt: { xs: 3, md: 3.4 } }}
                >
                  <LoginComponent
                    dispatch={dispatch}
                    navigate={navigate}
                    onSelectRegister={() => handleTabNavigation(1)}
                  />
                </Box>
              ) : (
                <Box
                  role="tabpanel"
                  id="simple-tabpanel-1"
                  aria-labelledby="simple-tab-1"
                  sx={{
                    ...authShellFieldSx,
                    pt: { xs: 3, md: 3.4 },
                  }}
                >
                  <Typography
                    sx={{
                      maxWidth: 440,
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: authPalette.textMuted,
                    }}
                  >
                    Tạo tài khoản để lưu ưu đãi, quản lý vé đã đặt và nhận thông
                    báo sớm cho các suất chiếu nổi bật.
                  </Typography>

                  <Box sx={{ mt: 2.6 }}>
                    <RegisterComponent
                      dispatch={dispatch}
                      openSnackbar={openSnackbar}
                      navigate={navigate}
                      setValue={handleTabNavigation}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
