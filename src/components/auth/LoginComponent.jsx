import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { useGoogleAuthPopup } from '@component/auth/useGoogleAuthPopup';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { fetchLogin } from '@redux/slices/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearAuthRedirect, resolveAuthRedirect } from '@utils/authRedirect';
import ForgotPasswordDialog from '@component/auth/ForgotPasswordDialog';
import * as yup from 'yup';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#d6dae0',
    },
    '&:hover fieldset': {
      borderColor: '#0a4d9c',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0a4d9c',
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    py: 1.4,
    fontSize: 15,
    color: '#1f2937',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiFormHelperText-root': {
    mx: 0.5,
    fontSize: 12.5,
  },
};

const LoginComponent = ({ dispatch, onSelectRegister }) => {
  const navigate = useNavigate();
  const { status: loginStatus } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const formLoginSchema = yup.object().shape({
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng!'
      )
      .required('Email không được để trống!'),
    password: yup.string().required('Mật khẩu không được để trống!'),
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

  return (
    <Box component="form" onSubmit={handleLoginSubmit(handleLogin)}>
      <Stack spacing={2.5}>
        <Box>
          <Typography sx={{ mb: 0.8, fontSize: 14, color: '#374151' }}>Email</Typography>
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
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineRounded sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Box>
          <Typography sx={{ mb: 0.8, fontSize: 14, color: '#374151' }}>Mật khẩu</Typography>
          <Controller
            name="password"
            control={loginControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                error={!!loginErrors.password}
                helperText={loginErrors.password?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                        sx={{ color: '#9ca3af' }}
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

        <Box>
          <Button
            variant="text"
            onClick={() => setForgotOpen(true)}
            sx={{
              p: 0,
              minWidth: 0,
              color: '#374151',
              fontSize: 14,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', color: '#0a4d9c' },
            }}
          >
            Quên mật khẩu?
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={loginStatus === 'loading'}
          sx={{
            mt: 1,
            minHeight: 48,
            borderRadius: '999px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            backgroundColor: '#0a4d9c',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#083d7c', boxShadow: 'none' },
          }}
        >
          {loginStatus === 'loading' ? (
            <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
          ) : null}
          Đăng nhập bằng tài khoản
        </Button>

        <Button
          variant="contained"
          onClick={startGoogleAuth}
          disabled={isLoading}
          sx={{
            minHeight: 48,
            borderRadius: '999px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            backgroundColor: '#f08aa6',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#e36e8e', boxShadow: 'none' },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
          ) : (
            <FcGoogle size={20} style={{ marginRight: 10 }} />
          )}
          Đăng nhập bằng Google
        </Button>

        {onSelectRegister ? (
          <Box sx={{ textAlign: 'center', pt: 0.5 }}>
            <Typography component="span" sx={{ fontSize: 14, color: '#6b7280' }}>
              Chưa có tài khoản?{' '}
            </Typography>
            <Button
              variant="text"
              onClick={onSelectRegister}
              sx={{
                p: 0,
                minWidth: 0,
                color: '#0a4d9c',
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
              Đăng ký ngay
            </Button>
          </Box>
        ) : null}
      </Stack>

      <ForgotPasswordDialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </Box>
  );
};

export default LoginComponent;
