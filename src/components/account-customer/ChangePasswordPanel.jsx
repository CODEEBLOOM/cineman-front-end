import { changePassword } from '@apis/authService';
import {
  accountFieldSx,
  accountPrimaryButtonSx,
  accountSecondaryButtonSx,
} from '@component/account-customer/accountUiStyles';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEyeOff,
  FiLock,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { clearInfoUser } from '@redux/slices/userSlice';
import { clearInfoAuth, fetchLogout } from '@redux/slices/authSlice';

const formSchema = yup.object({
  oldPassword: yup.string().required('Mật khẩu hiện tại không được để trống!'),
  password: yup
    .string()
    .required('Mật khẩu mới không được để trống!')
    .notOneOf(
      [yup.ref('oldPassword')],
      'Mật khẩu mới phải khác mật khẩu hiện tại!'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Xác nhận mật khẩu chưa khớp!')
    .required('Xác nhận mật khẩu không được để trống!'),
});

const labelClass = 'mb-2 block text-[15px] font-medium text-slate-800';
const iconClass = 'text-[18px] text-slate-500';

const FieldLabel = ({ children }) => (
  <label className={labelClass}>
    <span className="mr-1 text-[#b45309]">*</span>
    {children}
  </label>
);

const PasswordField = ({
  control,
  name,
  label,
  placeholder,
  error,
  visible,
  onToggle,
}) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message || ' '}
          sx={accountFieldSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <span className={iconClass}>
                    <FiLock />
                  </span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={onToggle}>
                    {visible ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  </div>
);

const ChangePasswordPanel = ({ email = '', open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isControlled = typeof open === 'boolean';
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = isControlled ? open : internalExpanded;
  const [visibleFields, setVisibleFields] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleToggleVisibility = (fieldName) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleToggleExpanded = () => {
    if (isControlled) {
      onClose?.();
      return;
    }
    setInternalExpanded((prev) => !prev);
  };

  const handleResetForm = () => {
    reset();
  };

  const handleLogoutAfterChange = async () => {
    try {
      await dispatch(fetchLogout()).unwrap();
    } catch {
      // server-side logout failure is non-fatal; local state still cleared below
    }
    dispatch(clearInfoUser());
    dispatch(clearInfoAuth());
    navigate('/auth/login', { replace: true });
  };

  const handleSubmitChangePassword = async (data) => {
    if (!email) {
      toast.error('Không tìm thấy email tài khoản để đổi mật khẩu.');
      return;
    }

    try {
      const response = await changePassword({
        email,
        oldPassword: data.oldPassword,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success(
        response?.message || 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
      );
      await handleLogoutAfterChange();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          'Đổi mật khẩu thất bại. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div className="mt-6 rounded-[20px] border border-slate-200 bg-slate-50/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-slate-900">
            Đổi mật khẩu
          </h2>
        </div>

        <button
          type="button"
          onClick={handleToggleExpanded}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#083d7c]/15 bg-white px-4 py-2 text-[14px] font-semibold text-[#083d7c] transition hover:border-[#083d7c]/35 hover:bg-[#f6fbff]"
        >
          {isControlled ? 'Đóng' : isExpanded ? 'Ẩn biểu mẫu' : 'Mở biểu mẫu'}
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      <Collapse in={isExpanded}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleSubmitChangePassword)}
          sx={{ mt: 3 }}
        >
          <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
            <PasswordField
              control={control}
              name="oldPassword"
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              error={errors.oldPassword}
              visible={visibleFields.oldPassword}
              onToggle={() => handleToggleVisibility('oldPassword')}
            />

            <div className="hidden md:block" />

            <PasswordField
              control={control}
              name="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              error={errors.password}
              visible={visibleFields.password}
              onToggle={() => handleToggleVisibility('password')}
            />

            <PasswordField
              control={control}
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              error={errors.confirmPassword}
              visible={visibleFields.confirmPassword}
              onToggle={() => handleToggleVisibility('confirmPassword')}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outlined"
              onClick={handleResetForm}
              sx={accountSecondaryButtonSx}
            >
              Xóa nội dung
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={isSubmitting}
              sx={accountPrimaryButtonSx}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Box>
      </Collapse>
    </div>
  );
};

export default ChangePasswordPanel;
