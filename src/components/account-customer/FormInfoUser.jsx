import { updateInfoUser } from '@apis/userService';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, InputAdornment, MenuItem, TextField } from '@mui/material';
import {
  accountFieldFlatSx,
  accountUpdateButtonSx,
} from '@component/account-customer/accountUiStyles';
import ChangePasswordModal from '@component/auth/ChangePasswordModal';
import UploadAvatar from '@component/account-customer/UploadAvatar';
import { useModelContext } from '@context/ModalContext.jsx';
import { updateUser } from '@redux/slices/userSlice';
import DateFormatter from '@utils/DateFormatter';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  FiCalendar,
  FiMail,
  FiMap,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import * as yup from 'yup';

const PROVINCES_API = 'https://provinces.open-api.vn/api/v2';

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
  province: yup.string().nullable(),
  ward: yup.string().nullable(),
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
  const { openPopup } = useModelContext();
  const { user } = useSelector((state) => state.user);

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);

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
      province: user?.province || '',
      ward: user?.ward || '',
      dateOfBirth: resolveDateValue(user?.dateOfBirth),
      avatar: avatar || '',
    },
  });

  const selectedProvinceName = useWatch({ control, name: 'province' });

  useEffect(() => {
    setValue('avatar', avatar || '');
  }, [avatar, setValue]);

  useEffect(() => {
    let cancelled = false;

    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${PROVINCES_API}/p/`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setProvinces(data);
        }
      } catch {
        if (!cancelled) setProvinces([]);
      }
    };

    fetchProvinces();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProvinceName || provinces.length === 0) {
      setWards([]);
      return undefined;
    }

    const matched = provinces.find((p) => p.name === selectedProvinceName);
    if (!matched) {
      setWards([]);
      return undefined;
    }

    let cancelled = false;
    setLoadingWards(true);

    fetch(`${PROVINCES_API}/p/${matched.code}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setWards(Array.isArray(data?.wards) ? data.wards : []);
        }
      })
      .catch(() => {
        if (!cancelled) setWards([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingWards(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProvinceName, provinces]);

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

          <div>
            <RequiredLabel>Tỉnh/Thành phố</RequiredLabel>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  size="small"
                  error={!!errors.province}
                  helperText={errors.province?.message || ''}
                  sx={accountFieldFlatSx}
                  onChange={(e) => {
                    field.onChange(e);
                    setValue('ward', '');
                  }}
                  slotProps={{
                    input: { startAdornment: adornment(<FiMap />) },
                    select: {
                      displayEmpty: true,
                      renderValue: (value) =>
                        value || (
                          <span className="text-[14px] text-slate-400">
                            Tỉnh/Thành phố
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-slate-400">Tỉnh/Thành phố</span>
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province.code} value={province.name}>
                      {province.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

          <div>
            <RequiredLabel>Xã/Phường</RequiredLabel>
            <Controller
              name="ward"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  size="small"
                  disabled={!selectedProvinceName || loadingWards}
                  error={!!errors.ward}
                  helperText={errors.ward?.message || ''}
                  sx={accountFieldFlatSx}
                  slotProps={{
                    input: { startAdornment: adornment(<FiMapPin />) },
                    select: {
                      displayEmpty: true,
                      renderValue: (value) =>
                        value || (
                          <span className="text-[14px] text-slate-400">
                            {loadingWards
                              ? 'Đang tải...'
                              : selectedProvinceName
                                ? 'Xã/Phường'
                                : 'Chọn Tỉnh/Thành phố trước'}
                          </span>
                        ),
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-slate-400">Xã/Phường</span>
                  </MenuItem>
                  {wards.map((ward) => (
                    <MenuItem key={ward.code} value={ward.name}>
                      {ward.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>

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
            onClick={() =>
              openPopup(<ChangePasswordModal email={user?.email || ''} />)
            }
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

    </div>
  );
};

export default FormInfoUser;
