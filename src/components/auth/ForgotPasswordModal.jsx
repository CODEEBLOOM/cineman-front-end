import { forgotPassword } from '@apis/authService';
import { useModelContext } from '@context/ModalContext.jsx';
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import * as yup from 'yup';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#d6dae0' },
    '&:hover fieldset': { borderColor: '#0a4d9c' },
    '&.Mui-focused fieldset': {
      borderColor: '#0a4d9c',
      borderWidth: '1px',
    },
  },
  '& .MuiInputBase-input': {
    py: 1.4,
    fontSize: 15,
    color: '#1f2937',
    '&::placeholder': { color: '#9ca3af', opacity: 1 },
  },
  '& .MuiFormHelperText-root': { mx: 0.5, fontSize: 12.5 },
};

const formSchema = yup.object({
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email chưa đúng định dạng!'
    )
    .required('Email không được để trống!'),
});

const ForgotPasswordModal = () => {
  const { closeTopModal } = useModelContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: { email: '' },
  });

  const handleForgotPassword = async (data) => {
    try {
      const response = await forgotPassword({ email: data.email.trim() });
      toast.success(
        response?.message ||
          'Nếu email hợp lệ, hệ thống đã gửi liên kết đặt lại mật khẩu.'
      );
      reset();
      closeTopModal();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Không thể gửi yêu cầu quên mật khẩu lúc này.'
      );
    }
  };

  return (
    <div
      data-modal-placement="center"
      className="relative w-full max-w-md rounded-md bg-white p-6 shadow-xl sm:p-7"
    >
      <button
        type="button"
        onClick={closeTopModal}
        className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
        aria-label="Đóng"
      >
        <IoClose size={22} />
      </button>

      <div className="mb-5">
        <h2 className="text-[20px] font-bold text-primary">Quên mật khẩu</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
        </p>
      </div>

      <Box component="form" onSubmit={handleSubmit(handleForgotPassword)}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ mb: 0.8, fontSize: 14, color: '#374151' }}>
              Email
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  placeholder="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineRounded
                          sx={{ color: '#9ca3af', fontSize: 20 }}
                        />
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
              mt: 1,
              minHeight: 44,
              borderRadius: '999px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              backgroundColor: '#0a4d9c',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#083d7c', boxShadow: 'none' },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={18} sx={{ color: '#fff', mr: 1 }} />
            ) : null}
            Gửi liên kết
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={closeTopModal}
            sx={{
              p: 0,
              minWidth: 0,
              alignSelf: 'center',
              color: '#6b7280',
              fontSize: 13,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', color: '#0a4d9c' },
            }}
          >
            Quay lại đăng nhập
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default ForgotPasswordModal;
