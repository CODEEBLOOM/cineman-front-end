import { forgotPassword } from '@apis/authService';
import EmailRounded from '@mui/icons-material/EmailRounded';
import MarkEmailReadRounded from '@mui/icons-material/MarkEmailReadRounded';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
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
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email chưa �úng ��9nh dạng!'
    )
    .required('Email không �ược �Ồ tr�ng!'),
});

const ForgotPasswordComponent = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (data) => {
    try {
      const response = await forgotPassword({
        email: data.email.trim(),
      });

      toast.success(
        response?.message ||
          'Nếu email hợp l�!, h�! th�ng �ã gửi liên kết �ặt lại mật khẩu.'
      );
      reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Không thỒ gửi yêu cầu quên mật khẩu lúc này.'
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleForgotPassword)}>
      <Stack spacing={2.4}>
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
            Email tài khoản
          </Typography>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="email"
                placeholder="user@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={authFieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded sx={{ color: '#ff8fb4' }} />
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
            <MarkEmailReadRounded sx={{ mr: 1.2 }} />
          )}
          Gửi liên kết �ặt lại mật khẩu
        </Button>

        <Button
          component={RouterLink}
          to="/auth/login?auth=login"
          variant="text"
          sx={{
            p: 0,
            minWidth: 0,
            color: 'rgba(214, 228, 245, 0.72)',
            fontSize: 14.5,
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          Quay lại �Ēng nhập
        </Button>

        {isSubmitSuccessful ? (
          <Typography
            sx={{
              fontSize: 13.5,
              lineHeight: 1.7,
              color: 'rgba(214, 228, 245, 0.72)',
            }}
          >
            Nếu không thấy email, bạn hãy kiỒm tra thư mục spam hoặc thử gửi lại
            sau ít phút.
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default ForgotPasswordComponent;
