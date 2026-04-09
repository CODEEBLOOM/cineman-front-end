import { createPermission, updatePermission } from '@apis/permissionService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((method) => ({
  value: method,
  label: method,
}));

const formSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Tên quyền hạn không được để trống!')
    .max(100, 'Tên quyền hạn phải nhỏ hơn hoặc bằng 100 ký tự!'),
  method: yup
    .string()
    .trim()
    .oneOf(methodOptions.map((option) => option.value), 'Method không hợp lệ!')
    .required('Method không được để trống!'),
  url: yup
    .string()
    .trim()
    .required('API URL không được để trống!')
    .max(200, 'API URL phải nhỏ hơn hoặc bằng 200 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(500, 'Mô tả phải nhỏ hơn hoặc bằng 500 ký tự!'),
});

const PermissionFormModal = ({
  permission,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const permissionId = permission?.id ?? permission?.permissionId ?? null;
  const isEditing = Boolean(permissionId);
  const formId = 'permission-form';

  const defaultValues = useMemo(
    () => ({
      title: '',
      method: 'GET',
      url: '',
      description: '',
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
      title: permission?.title ?? '',
      method: permission?.method ?? 'GET',
      url: permission?.url ?? '',
      description: permission?.description ?? '',
    });
  }, [permission, reset]);

  const handleReset = () => {
    reset({
      title: permission?.title ?? '',
      method: permission?.method ?? 'GET',
      url: permission?.url ?? '',
      description: permission?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        title: value.title.trim(),
        method: value.method.trim().toUpperCase(),
        url: value.url.trim(),
        description: value.description?.trim() || '',
      };

      if (isEditing) {
        await updatePermission(permissionId, payload);
        toast.success('Cập nhật quyền hạn thành công!');
      } else {
        await createPermission(payload);
        toast.success('Tạo quyền hạn thành công!');
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
          ? 'Cập nhật quyền hạn thất bại!'
          : 'Tạo quyền hạn thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật quyền hạn' : 'Tạo quyền hạn'}
      description="Thiết lập tên quyền, HTTP method và endpoint để phục vụ cấu hình phân quyền trong trang quản trị."
      onClose={closeTopModal}
      size="sm"
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
        Mỗi permission tương ứng với một API cụ thể, vì vậy method và URL cần khớp với endpoint thực tế của backend.
      </div>

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="title"
          require={true}
          label="Tên quyền hạn"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Xem danh sách quyền hạn"
          error={errors.title}
        />

        <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
          <FormField
            name="method"
            require={true}
            label="Method"
            control={control}
            Component={CustomSelect}
            options={methodOptions}
            placeHolder="Chọn method"
            error={errors.method}
          />

          <FormField
            name="url"
            require={true}
            label="API URL"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: /admin/permissions/all"
            error={errors.url}
          />
        </div>

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho quyền hạn này"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default PermissionFormModal;
