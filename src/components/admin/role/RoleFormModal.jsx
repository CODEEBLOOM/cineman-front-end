import { createRole, updateRole } from '@apis/roleService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import MulSelect from '@component/form_field/MulSelect';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const uniqueNumberList = (values) => {
  const normalizedValues = (Array.isArray(values) ? values : [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Array.from(new Set(normalizedValues));
};

const formSchema = yup.object({
  roleId: yup
    .string()
    .trim()
    .required('Mã vai trò không được để trống!')
    .max(25, 'Mã vai trò phải nhỏ hơn hoặc bằng 25 ký tự!'),
  name: yup
    .string()
    .trim()
    .required('Tên vai trò không được để trống!')
    .max(100, 'Tên vai trò phải nhỏ hơn hoặc bằng 100 ký tự!'),
  permissionIds: yup.array().default([]),
});

const RoleFormModal = ({
  role,
  permissions = [],
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const roleId = role?.roleId ?? '';
  const isEditing = Boolean(roleId);
  const formId = 'role-form';

  const permissionOptions = useMemo(
    () =>
      permissions.map((permission) => ({
        value: String(permission?.id),
        label:
          permission?.method && permission?.url
            ? `${permission.title} (${permission.method} ${permission.url})`
            : permission?.title,
      })),
    [permissions]
  );

  const defaultValues = useMemo(
    () => ({
      roleId: '',
      name: '',
      permissionIds: [],
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    reset({
      roleId: role?.roleId ?? '',
      name: role?.name ?? '',
      permissionIds: (role?.permissionIds ?? []).map((value) => String(value)),
    });
  }, [role, reset]);

  const handleReset = () => {
    reset({
      roleId: role?.roleId ?? '',
      name: role?.name ?? '',
      permissionIds: (role?.permissionIds ?? []).map((value) => String(value)),
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        roleId: value.roleId.trim(),
        name: value.name.trim(),
        permissionIds: uniqueNumberList(value.permissionIds),
      };

      if (isEditing) {
        await updateRole(roleId, payload);
        toast.success('Cập nhật vai trò thành công!');
      } else {
        await createRole(payload);
        toast.success('Tạo vai trò thành công!');
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

      toast.error(isEditing ? 'Cập nhật vai trò thất bại!' : 'Tạo vai trò thất bại!');
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật vai trò' : 'Tạo vai trò'}
      description="Thiết lập mã vai trò, tên hiển thị và danh sách quyền được gán cho vai trò trong hệ thống."
      onClose={closeTopModal}
      size="md"
      placement={placement}
      actions={
        <>
          <Button type="button" variant="outlined" color="info" onClick={handleReset}>
            Làm mới
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
          <Button type="submit" form={formId} variant="contained" disabled={isSubmitting}>
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
        Vai trò sẽ quyết định nhóm quyền mà tài khoản được sử dụng trong trang quản trị.
      </div>

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="roleId"
            require={true}
            label="Mã vai trò"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: ADMIN, CADMIN, RCP"
            error={errors.roleId}
            disabled={isEditing}
          />

          <FormField
            name="name"
            require={true}
            label="Tên vai trò"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: Quản trị viên, Quản lý chi nhánh"
            error={errors.name}
          />
        </div>

        <FormField
          name="permissionIds"
          label="Danh sách quyền"
          control={control}
          Component={MulSelect}
          placeHolder={
            permissionOptions.length > 0
              ? 'Chọn một hoặc nhiều quyền'
              : 'Chưa có dữ liệu quyền để chọn'
          }
          error={errors.permissionIds}
          options={permissionOptions}
          disabled={permissionOptions.length === 0}
        />
      </form>
    </AdminModal>
  );
};

export default RoleFormModal;
