import { register } from '@apis/authService';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import PersonOutlineRounded from '@mui/icons-material/PersonOutlineRounded';
import PhoneIphoneRounded from '@mui/icons-material/PhoneIphoneRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import WcRounded from '@mui/icons-material/WcRounded';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useGoogleAuthPopup } from '@component/auth/useGoogleAuthPopup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { useLocation } from 'react-router-dom';
import { resolveAuthRedirect } from '@utils/authRedirect';
import * as yup from 'yup';

const registerFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    color: '#f7fbff',
    background:
      'linear-gradient(180deg, rgba(8, 24, 58, 0.92) 0%, rgba(10, 31, 70, 0.86) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
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
    py: 1.05,
    fontSize: 15.5,
    color: '#f7fbff',
    '&::placeholder': {
      color: 'rgba(214, 228, 245, 0.5)',
      opacity: 1,
    },
  },
  '& .MuiSelect-select': {
    py: 1.05,
    color: '#f7fbff',
  },
  '& .MuiFormHelperText-root': {
    mt: 0.8,
    mx: 0.2,
    color: '#ff9dba',
  },
};

const fieldMeta = {
  fullName: {
    label: 'Họ tên',
    placeholder: 'Nhập họ tên',
    icon: <PersonOutlineRounded sx={{ color: '#ff8fb4' }} />,
  },
  email: {
    label: 'Email',
    placeholder: 'Nhập email',
    icon: <MailOutlineRounded sx={{ color: '#ff8fb4' }} />,
    type: 'email',
  },
  password: {
    label: 'Mật khẩu',
    placeholder: 'Tạo mật khẩu',
    icon: <LockOutlined sx={{ color: '#ff8fb4' }} />,
    type: 'password',
  },
  confirmPassword: {
    label: 'Xác nhận mật khẩu',
    placeholder: 'Nhập lại mật khẩu',
    icon: <LockOutlined sx={{ color: '#ff8fb4' }} />,
    type: 'password',
  },
  phoneNumber: {
    label: 'Số điện thoại',
    placeholder: 'Nhập số điện thoại',
    icon: <PhoneIphoneRounded sx={{ color: '#ff8fb4' }} />,
  },
  address: {
    label: 'Địa chỉ',
    placeholder: 'Nhập địa chỉ',
    icon: <LocationOnOutlined sx={{ color: '#ff8fb4' }} />,
  },
  dateOfBirth: {
    label: 'Ngày sinh',
    icon: <CalendarMonthRounded sx={{ color: '#ff8fb4' }} />,
    type: 'date',
  },
  gender: {
    label: 'Giới tính',
    placeholder: 'Chọn giới tính',
    icon: <WcRounded sx={{ color: '#ff8fb4' }} />,
  },
};

const RegisterComponent = ({ dispatch, openSnackbar, navigate, setValue }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
    dateOfBirth: yup.date().required('Ngày sinh không được để trống!'),
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
      gender: '',
    },
  });

  const handleRegister = (data) => {
    setIsLoading(true);
    register(data)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          alert('Vui lòng kiểm tra mail để kích hoạt tài khoản');
          dispatch(openSnackbar({ message: 'Đăng kí thành công.' }));
          reset();
          navigate('/auth/login?auth=login');
          setValue(0);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({ message: err?.response?.data?.message, type: 'error' })
        );
        setIsLoading(false);
      });
  };

  const renderAdornment = (name) => {
    const meta = fieldMeta[name];

    if (name === 'password' || name === 'confirmPassword') {
      return {
        startAdornment: <InputAdornment position="start">{meta.icon}</InputAdornment>,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))
              }
              sx={{ color: 'rgba(214, 228, 245, 0.72)' }}
            >
              {showPassword[name] ? <VisibilityOffRounded /> : <VisibilityRounded />}
            </IconButton>
          </InputAdornment>
        ),
      };
    }

    return {
      startAdornment: <InputAdornment position="start">{meta.icon}</InputAdornment>,
    };
  };

  const renderField = (name) => {
    const meta = fieldMeta[name];
    const error = registerErrors[name];
    const isPasswordField = name === 'password' || name === 'confirmPassword';

    return (
      <Box key={name}>
        <Typography
          sx={{
            mb: 0.9,
            fontSize: 14,
            fontWeight: 700,
            color: '#edf6ff',
          }}
        >
          {name !== 'address' ? (
            <Box component="span" sx={{ mr: 0.5, color: '#ff8fb4' }}>
              *
            </Box>
          ) : null}
          {meta.label}
        </Typography>

        <Controller
          name={name}
          control={registerControl}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select={name === 'gender'}
              type={
                isPasswordField
                  ? showPassword[name]
                    ? 'text'
                    : 'password'
                  : meta.type ?? 'text'
              }
              placeholder={meta.placeholder}
              error={!!error}
              helperText={error?.message}
              sx={registerFieldSx}
              InputLabelProps={meta.type === 'date' ? { shrink: true } : undefined}
              InputProps={renderAdornment(name)}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: '16px',
                      color: '#edf6ff',
                      background:
                        'linear-gradient(180deg, rgba(10, 31, 70, 0.98) 0%, rgba(8, 24, 58, 0.98) 100%)',
                      border: '1px solid rgba(101, 171, 235, 0.18)',
                      '& .MuiMenuItem-root': {
                        fontSize: 14.5,
                      },
                      '& .MuiMenuItem-root:hover': {
                        backgroundColor: alpha('#4aa3f0', 0.12),
                      },
                      '& .Mui-selected': {
                        backgroundColor: alpha('#ff8fb4', 0.14),
                      },
                    },
                  },
                },
              }}
            >
              {name === 'gender' ? (
                [
                  <MenuItem key="placeholder" disabled value="">
                    {meta.placeholder}
                  </MenuItem>,
                  <MenuItem key="male" value="MALE">
                    Nam
                  </MenuItem>,
                  <MenuItem key="female" value="FEMALE">
                    Nữ
                  </MenuItem>,
                  <MenuItem key="other" value="OTHER">
                    Khác
                  </MenuItem>,
                ]
              ) : null}
            </TextField>
          )}
        />
      </Box>
    );
  };

  return (
    <Box component="form" onSubmit={handleRegisterSubmit(handleRegister)}>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {[
          'fullName',
          'email',
          'password',
          'confirmPassword',
          'phoneNumber',
          'address',
          'dateOfBirth',
          'gender',
        ].map(renderField)}
      </Box>

      <Stack spacing={1.4} sx={{ mt: 2.6 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            minHeight: 54,
            borderRadius: '999px',
            color: '#f8fbff',
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'none',
            background:
              'linear-gradient(180deg, #f173a2 0%, #df5d91 55%, #c84b7c 100%)',
            boxShadow: `0 18px 36px ${alpha('#c84b7c', 0.32)}`,
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} sx={{ color: '#f8fbff', mr: 1.2 }} />
          ) : null}
          Đăng kí tài khoản
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={startGoogleAuth}
          disabled={isGoogleLoading}
          sx={{
            minHeight: 54,
            borderRadius: '999px',
            color: '#f8fbff',
            fontSize: 16,
            fontWeight: 800,
            textTransform: 'none',
            background:
              'linear-gradient(180deg, #132f66 0%, #0f2552 52%, #0a1938 100%)',
            boxShadow: `0 18px 36px ${alpha('#09162d', 0.34)}`,
          }}
        >
          {isGoogleLoading ? (
            <CircularProgress size={22} sx={{ color: '#f8fbff', mr: 1.2 }} />
          ) : (
            <FcGoogle size={24} style={{ marginRight: 12 }} />
          )}
          Đăng kí bằng Google
        </Button>
      </Stack>
    </Box>
  );
};

export default RegisterComponent;
