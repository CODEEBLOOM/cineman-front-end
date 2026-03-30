import { createUserAdmin, updateUserAdmin } from '@apis/userService';
import { uploadPhoto } from '@apis/uploadFileService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import ImageComponent from '@component/ImageComponent';
import CustomSelect from '@component/form_field/CustomSelect';
import MulSelect from '@component/form_field/MulSelect';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const genderOptions = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

const resolveAvatarSrc = (avatar) => {
  if (!avatar) {
    return '';
  }

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  return `${import.meta.env.VITE_STORAGES}/${avatar}`;
};

const resolveDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

const transformRoleIds = (value) =>
  Array.from(
    new Set(
      (Array.isArray(value) ? value : [])
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );

const createSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Họ và tên không được để trống!')
    .max(100, 'Họ và tên phải nhỏ hơn hoặc bằng 100 ký tự!'),
  email: yup
    .string()
    .trim()
    .email('Email chưa đúng định dạng!')
    .required('Email không được để trống!'),
  password: yup
    .string()
    .required('Mật khẩu không được để trống!')
    .max(100, 'Mật khẩu phải nhỏ hơn hoặc bằng 100 ký tự!'),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^0[0-9]{9,10}$/, 'Số điện thoại chưa đúng định dạng!')
    .required('Số điện thoại không được để trống!'),
  address: yup
    .string()
    .trim()
    .max(200, 'Địa chỉ phải nhỏ hơn hoặc bằng 200 ký tự!'),
  dateOfBirth: yup.string().required('Ngày sinh không được để trống!'),
  gender: yup
    .string()
    .required('Giới tính không được để trống!')
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ!'),
  avatar: yup.string().trim(),
  roleIds: yup.array().default([]),
});

const updateSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Họ và tên không được để trống!')
    .max(100, 'Họ và tên phải nhỏ hơn hoặc bằng 100 ký tự!'),
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
  address: yup
    .string()
    .trim()
    .max(200, 'Địa chỉ phải nhỏ hơn hoặc bằng 200 ký tự!'),
  dateOfBirth: yup.string(),
  gender: yup
    .string()
    .required('Giới tính không được để trống!')
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ!'),
  avatar: yup.string().trim(),
  roleIds: yup.array().default([]),
});

const UserFormModal = ({
  user,
  roles = [],
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const userId = user?.userId ?? null;
  const isEditing = Boolean(userId);
  const formId = 'user-form';
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const roleOptions = useMemo(
    () =>
      roles.map((role) => ({
        value: String(role?.roleId),
        label: role?.name ? `${role.name} (${role.roleId})` : String(role?.roleId),
      })),
    [roles]
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(isEditing ? updateSchema : createSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      avatar: '',
      roleIds: [],
    },
  });

  const selectedRoleIds = watch('roleIds');

  useEffect(() => {
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      password: '',
      phoneNumber: user?.phoneNumber ?? '',
      address: user?.address ?? '',
      dateOfBirth: resolveDateInputValue(user?.dateOfBirth),
      gender: user?.gender ?? '',
      avatar: user?.avatar ?? '',
      roleIds: (user?.roleIds ?? []).map((value) => String(value)),
    });
    setAvatarPreview(resolveAvatarSrc(user?.avatar ?? ''));
  }, [reset, user]);

  const handleReset = () => {
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      password: '',
      phoneNumber: user?.phoneNumber ?? '',
      address: user?.address ?? '',
      dateOfBirth: resolveDateInputValue(user?.dateOfBirth),
      gender: user?.gender ?? '',
      avatar: user?.avatar ?? '',
      roleIds: (user?.roleIds ?? []).map((value) => String(value)),
    });
    setAvatarPreview(resolveAvatarSrc(user?.avatar ?? ''));
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const avatarValue = await uploadPhoto(file);
      setValue('avatar', avatarValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setAvatarPreview(resolveAvatarSrc(avatarValue));
      toast.success('Tải ảnh đại diện thành công!');
    } catch (error) {
      if (error?.response?.status === 400 || error?.response?.status === 401) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Tải ảnh đại diện thất bại!');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        fullName: value.fullName.trim(),
        email: value.email.trim(),
        phoneNumber: value.phoneNumber.trim(),
        gender: value.gender,
        roleIds: transformRoleIds(value.roleIds),
      };

      if (!isEditing) {
        payload.password = value.password;
      }

      if (userId) {
        payload.userId = userId;
      }

      if (value.address?.trim()) {
        payload.address = value.address.trim();
      }

      if (value.dateOfBirth) {
        payload.dateOfBirth = `${value.dateOfBirth}T00:00:00`;
      }

      if (value.avatar?.trim()) {
        payload.avatar = value.avatar.trim();
      }

      if (isEditing) {
        await updateUserAdmin(payload);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        await createUserAdmin(payload);
        toast.success('Tạo người dùng thành công!');
      }

      await onSuccess?.();
      closeTopModal();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error(
        isEditing
          ? 'Cập nhật người dùng thất bại!'
          : 'Tạo người dùng thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật người dùng' : 'Tạo người dùng'}
      description="Thiết lập thông tin tài khoản, vai trò và ảnh đại diện cho người dùng trong hệ thống."
      onClose={closeTopModal}
      size="lg"
      placement={placement}
      actions={
        <>
          <Button type="button" variant="outlined" color="info" onClick={handleReset}>
            Làm mới
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isSubmitting || isUploading}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
        Vai trò được chọn sẽ quyết định quyền truy cập của tài khoản trong hệ thống quản trị.
      </div>

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 grid gap-4 md:grid-cols-[170px_1fr]">
          <div>
            <p className="mb-1 font-medium">Ảnh đại diện</p>
            <ImageComponent
              src={avatarPreview}
              width={160}
              height={200}
              className="h-[200px] w-[160px] rounded-md border border-slate-200 object-cover"
            />
          </div>

          <div className="flex flex-col justify-end gap-3">
            <div>
              <Button
                variant="contained"
                color="warning"
                component="label"
                disabled={isUploading}
              >
                {isUploading ? 'Đang tải ảnh...' : 'Tải ảnh đại diện'}
                <input
                  type="file"
                  hidden
                  onChange={handleUploadAvatar}
                  accept="image/*"
                  multiple={false}
                />
              </Button>
            </div>

            {errors.avatar ? (
              <p className="text-sm text-red-600">{errors.avatar.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="fullName"
            require={true}
            label="Họ và tên"
            control={control}
            Component={TextInput}
            placeHolder="Nhập họ và tên"
            error={errors.fullName}
          />

          <FormField
            name="email"
            require={true}
            label="Email"
            control={control}
            Component={TextInput}
            placeHolder="Nhập email"
            error={errors.email}
            disabled={isEditing}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="phoneNumber"
            require={true}
            label="Số điện thoại"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: 0912345678"
            error={errors.phoneNumber}
          />

          {!isEditing ? (
            <FormField
              name="password"
              require={true}
              label="Mật khẩu"
              control={control}
              Component={TextInput}
              type="password"
              placeHolder="Nhập mật khẩu"
              error={errors.password}
            />
          ) : (
            <div className="flex items-end rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              Email là định danh đăng nhập hiện tại nên được khóa khi cập nhật người dùng.
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="gender"
            require={true}
            label="Giới tính"
            control={control}
            Component={CustomSelect}
            placeHolder="Chọn giới tính"
            options={genderOptions}
            error={errors.gender}
          />

          <FormField
            name="dateOfBirth"
            label="Ngày sinh"
            control={control}
            Component={TextInput}
            type="date"
            error={errors.dateOfBirth}
          />
        </div>

        <FormField
          name="address"
          label="Địa chỉ"
          control={control}
          Component={TextInput}
          placeHolder="Nhập địa chỉ"
          error={errors.address}
        />

        <FormField
          name="roleIds"
          label="Vai trò"
          control={control}
          Component={MulSelect}
          placeHolder={
            roleOptions.length > 0
              ? 'Chọn một hoặc nhiều vai trò'
              : 'Chưa có vai trò để chọn'
          }
          options={roleOptions}
          error={errors.roleIds}
          disabled={roleOptions.length === 0}
        />

        <p className="mt-1 text-sm text-slate-500">
          Đã chọn {selectedRoleIds?.length ?? 0} vai trò cho tài khoản này.
        </p>
      </form>
    </AdminModal>
  );
};

export default UserFormModal;
