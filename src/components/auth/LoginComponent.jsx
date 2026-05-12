import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import SecurityRounded from '@mui/icons-material/SecurityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { useGoogleAuthPopup } from '@component/auth/useGoogleAuthPopup';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { fetchLogin } from '@redux/slices/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAuthRedirect, resolveAuthRedirect } from '@utils/authRedirect';
import * as yup from 'yup';

const authFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    color: '#f7fbff',
    background:
      'linear-gradient(180deg, rgba(8, 24, 58, 0.92) 0%, rgba(10, 31, 70, 0.86) 100%)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    '& fieldset': {
      borderColor: 'rgba(255, 143, 180, 0.28)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(101, 171, 235, 0.52)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 3px rgba(74, 163, 240, 0.16)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ff8fb4',
    },
  },
  '& .MuiInputBase-input': {
    px: 0.25,
    py: 1.15,
    fontSize: 17,
    color: '#f7fbff',
    '&::placeholder': {
      color: 'rgba(214, 228, 245, 0.48)',
      opacity: 1,
    },
  },
};

const LoginComponent = ({ dispatch, navigate, onSelectRegister }) => {
  const { status: loginStatus } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formLoginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng!'
      )
      .required('Email không được để trống!'),
    password: yup.string().required('Password không được để trống!'),
  });

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(formLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const location = useLocation();
  const redirectUrl = resolveAuthRedirect(location.state?.from, '/');
  const { startGoogleAuth } = useGoogleAuthPopup({
    dispatch,
    navigate,
    redirectUrl,
    onLoadingChange: setIsLoading,
  });

  const handleLogin = async (data) => {
    try {
      await dispatch(fetchLogin(data))?.unwrap();
      toast.success('Đăng nhập thành công!');
      loginReset();
      clearAuthRedirect();
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleForgotPassword = () => {
    toast.info('Tính năng quên mật khẩu đang được cập nhật.');
  };

  return (
    <Stack spacing={3}>
      <Box>
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
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em' }}>
            Đăng nhập bảo mật
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: { xs: 30, md: 34 },
            lineHeight: 1.08,
            fontWeight: 800,
            color: '#f7fbff',
          }}
        >
          Chào mừng bạn quay lại.
        </Typography>

        <Typography
          sx={{
            mt: 1.2,
            maxWidth: 430,
            fontSize: 15,
            lineHeight: 1.75,
            color: 'rgba(214, 228, 245, 0.74)',
          }}
        >
          Đăng nhập để tiếp tục đặt vé, quản lý lịch sử giao dịch và mở nhanh những ưu
          đãi thành viên đang chờ sẵn trong tài khoản của bạn.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleLoginSubmit(handleLogin)}>
        <Stack spacing={2.2}>
          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: 15,
                fontWeight: 700,
                color: '#edf6ff',
              }}
            >
              <Box component="span" sx={{ mr: 0.5, color: '#ff8fb4' }}>
                *
              </Box>
              Email
            </Typography>

            <Controller
              name="email"
              control={loginControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  placeholder="Email"
                  error={!!loginErrors.email}
                  helperText={loginErrors.email?.message}
                  sx={authFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineRounded sx={{ color: '#ff8fb4' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: 15,
                fontWeight: 700,
                color: '#edf6ff',
              }}
            >
              <Box component="span" sx={{ mr: 0.5, color: '#ff8fb4' }}>
                *
              </Box>
              Password
            </Typography>

            <Controller
              name="password"
              control={loginControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  error={!!loginErrors.password}
                  helperText={loginErrors.password?.message}
                  sx={authFieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: '#ff8fb4' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          sx={{ color: 'rgba(214, 228, 245, 0.72)' }}
                        >
                          {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            disabled={loginStatus === 'loading'}
            sx={{
              mt: 0.5,
              minHeight: 58,
              color: '#fff8ef',
              fontSize: 17,
              background:
                'linear-gradient(180deg, #f173a2 0%, #df5d91 55%, #c84b7c 100%)',
              boxShadow: `0 18px 36px ${alpha('#c84b7c', 0.32)}`,
            }}
          >
            {loginStatus === 'loading' ? (
              <CircularProgress size={22} sx={{ color: '#fff8ef', mr: 1.2 }} />
            ) : null}
            Đăng nhập bằng tài khoản
          </Button>

          <Button
            variant="contained"
            onClick={startGoogleAuth}
            disabled={isLoading}
            sx={{
              minHeight: 58,
              color: '#f8fbff',
              fontSize: 17,
              background:
                'linear-gradient(180deg, #132f66 0%, #0f2552 52%, #0a1938 100%)',
              boxShadow: `0 18px 36px ${alpha('#09162d', 0.34)}`,
            }}
          >
            {isLoading ? (
              <CircularProgress size={22} sx={{ color: '#f8fbff', mr: 1.2 }} />
            ) : (
              <FcGoogle size={24} style={{ marginRight: 12 }} />
            )}
            Đăng nhập bằng Google
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(121, 178, 230, 0.12)' }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 1.5 }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Button
          variant="text"
          onClick={() => navigate('/auth/forgot-password')}
          sx={{
            p: 0,
            minWidth: 0,
            color: 'rgba(214, 228, 245, 0.62)',
            fontSize: 15,
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Quên mật khẩu?
        </Button>

        <Button
          variant="text"
          onClick={onSelectRegister}
          sx={{
            p: 0,
            minWidth: 0,
            color: '#ff8fb4',
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Tạo tài khoản mới
        </Button>
      </Stack>
    </Stack>
  );
};

export default LoginComponent;
