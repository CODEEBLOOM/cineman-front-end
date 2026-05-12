import {
  createProvince,
  updateProvince,
} from '@apis/provinceService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const formSchema = yup.object({
  code: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Mã tỉnh/thành phải là số hợp lệ!')
    .required('Mã tỉnh/thành không được để trống!')
    .min(0, 'Mã tỉnh/thành phải lớn hơn hoặc bằng 0!'),
  name: yup
    .string()
    .trim()
    .required('Tên tỉnh/thành không được để trống!')
    .max(150, 'Tên tỉnh/thành tối đa 150 ký tự!'),
});

const ProvinceFormModal = ({ province, onSuccess, placement = 'top-center' }) => {
  const { closeTopModal } = useModelContext();
  const isEditing = Boolean(province?.id);
  const formId = 'province-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
    },
  });

  useEffect(() => {
    reset({
      code: province?.code ?? '',
      name: province?.name ?? '',
    });
  }, [province, reset]);

  const handleReset = () => {
    reset({
      code: province?.code ?? '',
      name: province?.name ?? '',
    });
  };

  const onSubmit = async (value) => {
    const payload = {
      code: Number(value.code),
      name: value.name.trim(),
    };

    try {
      if (isEditing) {
        await updateProvince(province.id, payload);
        toast.success('Cập nhật chi nhánh thành công!');
      } else {
        await createProvince(payload);
        toast.success('Tạo chi nhánh thành công!');
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

      toast.error(isEditing ? 'Cập nhật chi nhánh thất bại!' : 'Tạo chi nhánh thất bại!');
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật chi nhánh' : 'Tạo chi nhánh'}
      description="Quản lý danh mục tỉnh/thành để gắn rạp vào từng khu vực hoạt động của hệ thống."
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
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="code"
          require={true}
          label="Mã tỉnh/thành"
          control={control}
          Component={TextInput}
          type="number"
          placeHolder="Ví dụ: 48"
          error={errors.code}
        />

        <FormField
          name="name"
          require={true}
          label="Tên tỉnh/thành"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Đà Nẵng"
          error={errors.name}
        />
      </form>
    </AdminModal>
  );
};

export default ProvinceFormModal;