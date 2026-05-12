import { updateInfoUser } from '@apis/userService';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import {
  accountFieldFlatSx,
  accountUpdateButtonSx,
} from '@component/account-customer/accountUiStyles';
import ChangePasswordPanel from '@component/account-customer/ChangePasswordPanel';
import UploadAvatar from '@component/account-customer/UploadAvatar';
import { updateUser } from '@redux/slices/userSlice';
import DateFormatter from '@utils/DateFormatter';
import { Controller, useForm } from 'react-hook-form';
import {
  FiCalendar,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
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
  fullName: yup.string().trim().required('Họ tên không được để trống!'),
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
  gender: yup.string().nullable(),
  idCard: yup.string().trim().nullable(),
  province: yup.string().nullable(),
  district: yup.string().nullable(),
  address: yup.string().trim().nullable(),
});

const RequiredLabel = ({ children, required = false }) => (
  <label className="mb-1.5 block text-[13px] font-normal text-slate-700">
    {required ? <span className="mr-1 text-red-500">*</span> : null}
    {children}
  </label>
);

const adornment = (icon) => (
  <InputAdornment position="start">
    <span className="text-[16px] text-slate-400">{icon}</span>
  </InputAdornment>
);

const TextFieldControl = ({
  control,
  name,
  label,
  placeholder,
  icon,
  type = 'text',
  required = false,
  disabled = false,
  error,
}) => (
  <div>
    <RequiredLabel required={required}>{label}</RequiredLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          size="small"
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          error={!!error}
          helperText={error?.message || ''}
          sx={accountFieldFlatSx}
          slotProps={{
            input: icon
              ? {
                  startAdornment: adornment(icon),
                }
              : undefined,
            htmlInput: type === 'date' ? { max: '9999-12-31' } : undefined,
          }}
        />
      )}
    />
  </div>
);

const SelectFieldControl = ({
  control,
  name,
  label,
  icon,
  placeholder,
  required = false,
  options,
  error,
}) => (
  <div>
    <RequiredLabel required={required}>{label}</RequiredLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          select
          fullWidth
          size="small"
          displayEmpty
          error={!!error}
          helperText={error?.message || ''}
          sx={accountFieldFlatSx}
          slotProps={{
            input: icon
              ? {
                  startAdornment: adornment(icon),
                }
              : undefined,
            select: {
              displayEmpty: true,
              renderValue: (value) => {
                if (!value) {
                  return (
                    <span className="text-[14px] text-slate-400">
                      {placeholder}
                    </span>
                  );
                }
                const match = options.find((opt) => opt.value === value);
                return match ? match.label : value;
              },
            },
          }}
        >
          <MenuItem value="">
            <span className="text-slate-400">{placeholder}</span>
          </MenuItem>
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

const FormInfoUser = ({ avatar, onAvatarChange }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
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
      idCard: user?.idCard || '',
      province: user?.province || '',
      district: user?.district || '',
      dateOfBirth: resolveDateValue(user?.dateOfBirth),
      avatar: avatar || '',
    },
  });

  useEffect(() => {
    setValue('avatar', avatar || '');
  }, [avatar, setValue]);

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
    }
  };

  return (
    <div>
      <div className="mb-6">
        <UploadAvatar setAvatar={onAvatarChange} avatar={avatar} />
      </div>

      <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
        <div className="grid gap-x-6 gap-y-3 md:grid-cols-2">
          <TextFieldControl
            control={control}
            name="fullName"
            label="Họ tên"
            placeholder="Nguyễn Văn A"
            icon={<FiUser />}
            required
            error={errors.fullName}
          />

          <TextFieldControl
            control={control}
            name="email"
            label="Email"
            icon={<FiMail />}
            required
            disabled
            error={errors.email}
          />

          <TextFieldControl
            control={control}
            name="phoneNumber"
            label="Số điện thoại"
            placeholder="Số điện thoại"
            icon={<FiPhone />}
            required
            error={errors.phoneNumber}
          />

          <TextFieldControl
            control={control}
            name="idCard"
            label="CMND/Hộ chiếu"
            placeholder="CMND/Hộ chiếu"
            icon={<FiCreditCard />}
            error={errors.idCard}
          />

          <TextFieldControl
            control={control}
            name="dateOfBirth"
            label="Ngày sinh"
            type="date"
            icon={<FiCalendar />}
            required
            error={errors.dateOfBirth}
          />

          <SelectFieldControl
            control={control}
            name="gender"
            label="Giới tính"
            icon={<FiUsers />}
            placeholder="Giới tính"
            options={[
              { label: 'Nam', value: 'MALE' },
              { label: 'Nữ', value: 'FEMALE' },
              { label: 'Khác', value: 'OTHER' },
            ]}
            error={errors.gender}
          />

          <SelectFieldControl
            control={control}
            name="province"
            label="Tỉnh/Thành phố"
            placeholder="Tỉnh/Thành phố"
            options={[]}
            error={errors.province}
          />

          <SelectFieldControl
            control={control}
            name="district"
            label="Quận/Huyện"
            placeholder=""
            options={[]}
            error={errors.district}
          />

          <div className="md:col-span-2">
            <TextFieldControl
              control={control}
              name="address"
              label="Địa chỉ"
              placeholder="Địa chỉ"
              error={errors.address}
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={() => setIsChangePasswordOpen((prev) => !prev)}
            className="text-[13px] font-normal text-[#1f5fa0] underline-offset-2 hover:underline"
          >
            Đổi mật khẩu?
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={accountUpdateButtonSx}
          >
            Cập nhật
          </Button>
        </div>
      </form>

      {isChangePasswordOpen ? (
        <div className="mt-6">
          <ChangePasswordPanel
            email={user?.email || ''}
            open
            onClose={() => setIsChangePasswordOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default FormInfoUser;
