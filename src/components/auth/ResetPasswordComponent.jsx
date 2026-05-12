import { resetPassword } from '@apis/authService';
import LockResetRounded from '@mui/icons-material/LockResetRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
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
import { alpha } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
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

const formSchema = yup.object({
  password: yup.string().required('Mật khẩu mới không được để trống!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Xác nhận mật khẩu chưa khớp!')
    .required('Xác nhận mật khẩu không được để trống!'),
});

const ResetPasswordComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const token = useMemo(
    () => searchParams.get('token') || searchParams.get('resetToken') || '',
    [searchParams]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const renderPasswordField = (name, label, placeholder) => (
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
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type={showPassword[name] ? 'text' : 'password'}
            placeholder={placeholder}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            sx={authFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRounded sx={{ color: '#ff8fb4' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [name]: !prev[name],
                      }))
                    }
                    sx={{ color: 'rgba(214, 228, 245, 0.72)' }}
                  >
                    {showPassword[name] ? (
                      <VisibilityOffRounded />
                    ) : (
                      <VisibilityRounded />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Box>
  );

  const handleResetPassword = async (data) => {
    if (!token) {
      toast.error(
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đang thiếu token.'
      );
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success(response?.message || 'Đặt lại mật khẩu thành công.');
      navigate('/auth/login?auth=login', { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Không thể đặt lại mật khẩu lúc này.'
      );
    }
  };

  if (!token) {
    return (
      <Stack spacing={2.4}>
        <Box
          sx={{
            borderRadius: '20px',
            px: 2,
            py: 1.8,
            color: '#ffe3b6',
            backgroundColor: alpha('#ffb74d', 0.12),
            boxShadow: `0 0 0 1px ${alpha('#ffb74d', 0.2)}`,
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="flex-start">
            <WarningAmberRounded sx={{ mt: 0.2 }} />
            <Typography sx={{ fontSize: 14.5, lineHeight: 1.7 }}>
              Liên kết hiện tại không có token hợp lệ. Bạn hãy quay lại màn hình
              quên mật khẩu để gửi một yêu cầu mới.
            </Typography>
          </Stack>
        </Box>

        <Button
          component={RouterLink}
          to="/auth/forgot-password"
          variant="contained"
          sx={{
            minHeight: 56,
            color: '#fff8ef',
            fontSize: 17,
            fontWeight: 800,
            textTransform: 'none',
            background:
              'linear-gradient(180deg, #f173a2 0%, #df5d91 55%, #c84b7c 100%)',
            boxShadow: `0 18px 36px ${alpha('#c84b7c', 0.32)}`,
          }}
        >
          Gửi lại email khôi phục
        </Button>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleResetPassword)}>
      <Stack spacing={2.4}>
        {renderPasswordField('password', 'Mật khẩu mới', 'Nhập mật khẩu mới')}
        {renderPasswordField(
          'confirmPassword',
          'Xác nhận mật khẩu mới',
          'Nhập lại mật khẩu mới'
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            minHeight: 56,
            color: '#fff8ef',
            fontSize: 17,
            fontWeight: 800,
            textTransform: 'none',
            background:
              'linear-gradient(180deg, #f173a2 0%, #df5d91 55%, #c84b7c 100%)',
            boxShadow: `0 18px 36px ${alpha('#c84b7c', 0.32)}`,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={22} sx={{ color: '#fff8ef', mr: 1.2 }} />
          ) : (
            <LockResetRounded sx={{ mr: 1.2 }} />
          )}
          Cập nhật mật khẩu mới
        </Button>
      </Stack>
    </Box>
  );
};

export default ResetPasswordComponent;
