import { resetPassword } from '@apis/authService';
import { useModelContext } from '@context/ModalContext.jsx';
import LockOutlined from '@mui/icons-material/LockOutlined';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
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
  password: yup.string().required('Mật khẩu mới không được để trống!'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Xác nhận mật khẩu chưa khớp!')
    .required('Xác nhận mật khẩu không được để trống!'),
});

const ResetPasswordModal = ({ token = '' }) => {
  const { closeTopModal } = useModelContext();
  const navigate = useNavigate();
  const [visible, setVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const toggleVisibility = (name) =>
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleResetPassword = async (data) => {
    if (!token) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đang thiếu token.');
      return;
    }
    try {
      const response = await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success(response?.message || 'Đặt lại mật khẩu thành công.');
      closeTopModal();
      navigate('/auth/login?auth=login', { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Không thể đặt lại mật khẩu lúc này.'
      );
    }
  };

  const renderPasswordField = (name, label, placeholder) => (
    <Box>
      <Typography sx={{ mb: 0.8, fontSize: 14, color: '#374151' }}>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type={visible[name] ? 'text' : 'password'}
            placeholder={placeholder}
            error={!!errors[name]}
            helperText={errors[name]?.message}
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
                    onClick={() => toggleVisibility(name)}
                    sx={{ color: '#9ca3af' }}
                  >
                    {visible[name] ? (
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
        <h2 className="text-[20px] font-bold text-primary">
          Đặt lại mật khẩu
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Tạo mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      {!token ? (
        <Stack spacing={2}>
          <Box className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] leading-6 text-amber-700">
            Liên kết hiện tại không có token hợp lệ. Hãy gửi lại yêu cầu quên
            mật khẩu.
          </Box>
          <Button
            type="button"
            variant="contained"
            onClick={closeTopModal}
            sx={{
              minHeight: 44,
              borderRadius: '999px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              backgroundColor: '#0a4d9c',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#083d7c', boxShadow: 'none' },
            }}
          >
            Đóng
          </Button>
        </Stack>
      ) : (
        <Box component="form" onSubmit={handleSubmit(handleResetPassword)}>
          <Stack spacing={2}>
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
              Cập nhật mật khẩu
            </Button>
          </Stack>
        </Box>
      )}
    </div>
  );
};

export default ResetPasswordModal;
