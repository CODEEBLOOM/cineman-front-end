import { updateInfoUser } from '@apis/userService';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import {
  accountFieldSx,
  accountPrimaryButtonSx,
  accountSecondaryButtonSx,
} from '@component/account-customer/accountUiStyles';
import { updateUser } from '@redux/slices/userSlice';
import DateFormatter from '@utils/DateFormatter';
import { Controller, useForm } from 'react-hook-form';
import {
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const resolveDateValue = (dateOfBirth) => {
  if (!dateOfBirth) {
    return '';
  }

  return new DateFormatter(dateOfBirth).format('YYYY-MM-DD');
};

const formSchema = yup.object({
  fullName: yup.string().trim().required('Họ và tên không được để trống!'),
  email: yup
    .string()
    .trim()
    .email('Email chưa đúng định dạng!')
    .required('Email không được để trống!'),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^0[0-9]{9,10}$/, 'Số điện thoại chưa đúng định dạng!')
    .required('Số điện thoại không được để trống!'),
  dateOfBirth: yup.string().required('Ngày sinh không được để trống!'),
  gender: yup.string().required('Giới tính không được để trống!'),
  address: yup.string().trim().required('Địa chỉ không được để trống!'),
});

const labelClass = 'mb-2 block text-[15px] font-medium text-slate-800';
const iconClass = 'text-[18px] text-slate-500';

const FieldLabel = ({ children }) => (
  <label className={labelClass}>
    <span className="mr-1 text-[#b45309]">*</span>
    {children}
  </label>
);

const getStartAdornment = (icon) => (
  <InputAdornment position="start">
    <span className={iconClass}>{icon}</span>
  </InputAdornment>
);

const TextFieldControl = ({
  control,
  name,
  label,
  placeholder,
  icon,
  type = 'text',
  error,
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
          type={type}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message || ' '}
          sx={accountFieldSx}
          slotProps={{
            input: {
              startAdornment: getStartAdornment(icon),
            },
            htmlInput: type === 'date' ? { max: '9999-12-31' } : undefined,
          }}
        />
      )}
    />
  </div>
);

const SelectFieldControl = ({ control, name, label, icon, error, options }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          fullWidth
          error={!!error}
          helperText={error?.message || ' '}
          sx={accountFieldSx}
          slotProps={{
            input: {
              startAdornment: getStartAdornment(icon),
            },
          }}
        >
          <MenuItem value="">Chọn giới tính</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  </div>
);

const FormInfoUser = ({ avatar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      userId: user?.userId || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
      address: user?.address || '',
      dateOfBirth: resolveDateValue(user?.dateOfBirth),
      avatar: avatar || '',
    },
  });

  useEffect(() => {
    setValue('avatar', avatar || '');
  }, [avatar, setValue]);

  const handleResetForm = () => {
    reset({
      userId: user?.userId || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
      address: user?.address || '',
      dateOfBirth: resolveDateValue(user?.dateOfBirth),
      avatar: avatar || '',
    });
  };

  const handleSubmitForm = async (data) => {
    try {
      const response = await updateInfoUser(data);

      if (response?.status === 200) {
        dispatch(updateUser(response.data));
        toast.success('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Cập nhật thông tin thất bại!'
      );
      handleResetForm();
    }
  };

  return (
    <div>
      <div className="mb-4 max-w-3xl">
        <h1 className="text-[24px] font-semibold text-slate-900 md:text-[28px]">
          Hồ sơ thành viên
        </h1>
        <p className="mt-1 text-[14px] leading-6 text-slate-500 md:text-[15px]">
          Cập nhật thông tin cá nhân để đồng bộ tài khoản, lịch sử giao dịch và
          quyền lợi tích điểm của bạn tại Poly Cinemas.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid gap-x-4 gap-y-2 md:grid-cols-2">
          <TextFieldControl
            control={control}
            name="fullName"
            label="Họ và tên"
            placeholder="Lê Văn Huy"
            icon={<FiUser />}
            error={errors.fullName}
          />

          <TextFieldControl
            control={control}
            name="email"
            label="Email"
            placeholder="huy@gmail.com"
            icon={<FiMail />}
            error={errors.email}
          />

          <TextFieldControl
            control={control}
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="0993333225"
            icon={<FiPhone />}
            error={errors.phoneNumber}
          />

          <SelectFieldControl
            control={control}
            name="gender"
            label="Giới tính"
            icon={<FiUsers />}
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
            error={errors.gender}
          />

          <TextFieldControl
            control={control}
            name="dateOfBirth"
            label="Ngày sinh"
            type="date"
            icon={<FiCalendar />}
            error={errors.dateOfBirth}
          />

          <TextFieldControl
            control={control}
            name="address"
            label="Địa chỉ"
            placeholder="Quảng Ngãi"
            icon={<FiMapPin />}
            error={errors.address}
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            className="text-left text-[15px] font-medium text-[#23486c] transition hover:text-[#17324d] hover:underline"
          >
            Đổi mật khẩu?
          </button>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outlined"
              onClick={handleResetForm}
              sx={accountSecondaryButtonSx}
            >
              Khôi phục
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={isSubmitting}
              sx={accountPrimaryButtonSx}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormInfoUser;
