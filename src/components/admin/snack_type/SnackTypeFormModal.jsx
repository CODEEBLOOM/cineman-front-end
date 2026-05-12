import { createSnackType, updateSnackType } from '@apis/snackTypeAdminService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const formSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên loại đồ ăn vặt không được để trống!')
    .max(100, 'Tên loại đồ ăn vặt phải nhỏ hơn hoặc bằng 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .required('Mô tả không được để trống!')
    .max(200, 'Mô tả phải nhỏ hơn hoặc bằng 200 ký tự!'),
});

const SnackTypeFormModal = ({
  snackType,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const snackTypeId = snackType?.snackTypeId ?? snackType?.id;
  const isEditing = Boolean(snackTypeId);
  const formId = 'snack-type-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    reset({
      name: snackType?.name ?? '',
      description: snackType?.description ?? '',
    });
  }, [snackType, reset]);

  const handleReset = () => {
    reset({
      name: snackType?.name ?? '',
      description: snackType?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        name: value.name.trim(),
        description: value.description.trim(),
      };

      if (isEditing) {
        await updateSnackType(snackTypeId, payload);
        toast.success('Cập nhật loại đồ ăn vặt thành công!');
      } else {
        await createSnackType(payload);
        toast.success('Thêm loại đồ ăn vặt thành công!');
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
          ? 'Cập nhật loại đồ ăn vặt thất bại!'
          : 'Thêm loại đồ ăn vặt thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật loại đồ ăn vặt' : 'Tạo loại đồ ăn vặt'}
      description="Loại đồ ăn vặt dùng để nhóm sản phẩm như bắp rang, nước uống hoặc combo trong khu vực dịch vụ."
      onClose={closeTopModal}
      size="sm"
      placement={placement}
      actions={
        <>
          <Button
            type="button"
            variant="outlined"
            color="info"
            onClick={handleReset}
          >
            Làm mới
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="warning"
            onClick={closeTopModal}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isSubmitting}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="name"
          require={true}
          label="Tên loại đồ ăn vặt"
          control={control}
          Component={TextInput}
          placeHolder=": Bắp rang, Nước uống, Combo"
          error={errors.name}
        />

        <FormField
          name="description"
          require={true}
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho loại đồ ăn vặt"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default SnackTypeFormModal;
