import { register } from '@apis/authService';
import LockOutlined from '@mui/icons-material/LockOutlined';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useGoogleAuthPopup } from '@component/auth/useGoogleAuthPopup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useLocation } from 'react-router-dom';
import { resolveAuthRedirect } from '@utils/authRedirect';
import { toast } from 'sonner';
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
    py: 1.3,
    fontSize: 14.5,
    color: '#1f2937',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiSelect-select': {
    py: 1.3,
    color: '#1f2937',
  },
  '& .MuiFormHelperText-root': {
    mx: 0.5,
    fontSize: 12.5,
  },
};

const FieldLabel = ({ required, children }) => (
  <Typography sx={{ mb: 0.7, fontSize: 13.5, color: '#374151' }}>
    {required ? (
      <Box component="span" sx={{ mr: 0.4, color: '#e23744' }}>
        *
      </Box>
    ) : null}
    {children}
  </Typography>
);

const RegisterComponent = ({ dispatch, navigate, setValue }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const location = useLocation();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const redirectUrl = resolveAuthRedirect(location.state?.from, '/');
  const { startGoogleAuth } = useGoogleAuthPopup({
    dispatch,
    navigate,
    redirectUrl,
    onLoadingChange: setIsGoogleLoading,
  });

  const formRegisterSchema = yup.object().shape({
    fullName: yup.string().required('Họ tên không được để trống!'),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email chưa đúng định dạng!'
      )
      .required('Email không được để trống!'),
    password: yup.string().required('Mật khẩu không được để trống!'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Xác nhận mật khẩu chưa khớp!')
      .required('Xác nhận mật khẩu không được để trống!'),
    phoneNumber: yup
      .string()
      .matches(/^0[0-9]{9,10}$/, 'Số điện thoại chưa đúng định dạng!')
      .required('Số điện thoại không được để trống!'),
    dateOfBirth: yup
      .date()
      .typeError('Ngày sinh không hợp lệ!')
      .max(new Date(), 'Ngày sinh không được vượt quá ngày hiện tại!')
      .required('Ngày sinh không được để trống!'),
    gender: yup.string().required('Giới tính không được để trống!'),
  });

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    reset,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(formRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: format(new Date(), 'yyyy-MM-dd'),
      gender: 'MALE',
    },
  });

  const handleRegister = (data) => {
    setIsLoading(true);
    register(data)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          toast.info('Vui lòng kiểm tra mail để kích hoạt tài khoản');
          toast.success('Đăng kí thành công.');
          reset();
          navigate('/auth/login?auth=login');
          setValue(0);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setIsLoading(false);
      });
  };

  const passwordEndAdornment = (name) => (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        onClick={() =>
          setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))
        }
        sx={{ color: '#9ca3af' }}
      >
        {showPassword[name] ? <VisibilityOffRounded /> : <VisibilityRounded />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box component="form" onSubmit={handleRegisterSubmit(handleRegister)}>
      <Box
        sx={{
          display: 'grid',
          columnGap: 2.5,
          rowGap: 1.8,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Box>
          <FieldLabel required>Họ tên</FieldLabel>
          <Controller
            name="fullName"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Họ tên"
                error={!!registerErrors.fullName}
                helperText={registerErrors.fullName?.message}
                sx={fieldSx}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel required>Email</FieldLabel>
          <Controller
            name="email"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                placeholder="Email"
                error={!!registerErrors.email}
                helperText={registerErrors.email?.message}
                sx={fieldSx}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel required>Mật khẩu</FieldLabel>
          <Controller
            name="password"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword.password ? 'text' : 'password'}
                placeholder="Mật khẩu"
                error={!!registerErrors.password}
                helperText={registerErrors.password?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: passwordEndAdornment('password'),
                }}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel required>Xác nhận lại mật khẩu</FieldLabel>
          <Controller
            name="confirmPassword"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword.confirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận lại mật khẩu"
                error={!!registerErrors.confirmPassword}
                helperText={registerErrors.confirmPassword?.message}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#9ca3af', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: passwordEndAdornment('confirmPassword'),
                }}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel required>Ngày sinh</FieldLabel>
          <Controller
            name="dateOfBirth"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="date"
                error={!!registerErrors.dateOfBirth}
                helperText={registerErrors.dateOfBirth?.message}
                sx={fieldSx}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: format(new Date(), 'yyyy-MM-dd') }}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel>Giới tính</FieldLabel>
          <Controller
            name="gender"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                error={!!registerErrors.gender}
                helperText={registerErrors.gender?.message}
                sx={fieldSx}
              >
                <MenuItem value="MALE">Nam</MenuItem>
                <MenuItem value="FEMALE">Nữ</MenuItem>
                <MenuItem value="OTHER">Khác</MenuItem>
              </TextField>
            )}
          />
        </Box>

        <Box>
          <FieldLabel required>Số điện thoại</FieldLabel>
          <Controller
            name="phoneNumber"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Số điện thoại"
                error={!!registerErrors.phoneNumber}
                helperText={registerErrors.phoneNumber?.message}
                sx={fieldSx}
              />
            )}
          />
        </Box>

        <Box>
          <FieldLabel>Địa chỉ</FieldLabel>
          <Controller
            name="address"
            control={registerControl}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Địa chỉ"
                error={!!registerErrors.address}
                helperText={registerErrors.address?.message}
                sx={fieldSx}
              />
            )}
          />
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            sx={{
              color: '#9ca3af',
              '&.Mui-checked': { color: '#0a4d9c' },
            }}
          />
        }
        label={
          <Typography sx={{ fontSize: 14, color: '#374151' }}>
            Tôi cam kết tuân theo{' '}
            <Box component="span" sx={{ color: '#0a4d9c', fontWeight: 600 }}>
              chính sách bảo mật
            </Box>{' '}
            và{' '}
            <Box component="span" sx={{ color: '#0a4d9c', fontWeight: 600 }}>
              điều khoản sử dụng
            </Box>{' '}
            của Poly Cinemas.
          </Typography>
        }
        sx={{ mt: 2.5, ml: -0.5, alignItems: 'flex-center' }}
      />

      <Stack spacing={1.4} sx={{ mt: 2, alignItems: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !agreed}
          sx={{
            width: { xs: '100%', sm: 240 },
            minHeight: 46,
            borderRadius: '6px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            backgroundColor: '#0a4d9c',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#083d7c', boxShadow: 'none' },
            '&.Mui-disabled': { backgroundColor: '#c5cad2', color: '#fff' },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
          ) : null}
          Đăng ký
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={startGoogleAuth}
          disabled={isGoogleLoading}
          sx={{
            width: { xs: '100%', sm: 280 },
            minHeight: 46,
            borderRadius: '6px',
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
          {isGoogleLoading ? (
            <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
          ) : (
            <FcGoogle size={20} style={{ marginRight: 10 }} />
          )}
          Tiếp tục với Google
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterComponent;
