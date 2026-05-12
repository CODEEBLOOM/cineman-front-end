import { createCinemaType, updateCinemaType } from '@apis/cinemaTypeService';
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
  code: yup
    .string()
    .trim()
    .required('Mã loại phòng chiếu không được để trống!')
    .max(25, 'Mã loại phòng chiếu tối đa 25 ký tự!'),
  name: yup
    .string()
    .trim()
    .required('Tên loại phòng chiếu không được để trống!')
    .max(200, 'Tên loại phòng chiếu tối đa 200 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(250, 'Mô tả tối đa 250 ký tự!')
    .nullable(),
});

const CinemaTypeFormModal = ({
  cinemaType,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const cinemaTypeId = cinemaType?.cinemaTypeId ?? cinemaType?.id;
  const isEditing = Boolean(cinemaTypeId);
  const formId = 'cinema-type-form';

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
      description: '',
    },
  });

  useEffect(() => {
    reset({
      code: cinemaType?.code ?? '',
      name: cinemaType?.name ?? '',
      description: cinemaType?.description ?? '',
    });
  }, [cinemaType, reset]);

  const handleReset = () => {
    reset({
      code: cinemaType?.code ?? '',
      name: cinemaType?.name ?? '',
      description: cinemaType?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    const payload = {
      code: value.code.trim(),
      name: value.name.trim(),
      description: value.description?.trim() || '',
    };

    try {
      if (isEditing) {
        await updateCinemaType(cinemaTypeId, payload);
        toast.success('Cập nhật loại phòng chiếu thành công!');
      } else {
        await createCinemaType(payload);
        toast.success('Tạo loại phòng chiếu thành công!');
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
          ? 'Cập nhật loại phòng chiếu thất bại!'
          : 'Tạo loại phòng chiếu thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật loại phòng chiếu' : 'Tạo loại phòng chiếu'}
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
          name="code"
          require={true}
          label="Mã loại phòng chiếu"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: IMAX, 2D, 4DX"
          error={errors.code}
        />

        <FormField
          name="name"
          require={true}
          label="Tên loại phòng chiếu"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Phòng IMAX"
          error={errors.name}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho loại phòng chiếu"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default CinemaTypeFormModal;
