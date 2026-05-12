import {
  createMovieVariation,
  updateMovieVariation,
} from '@apis/movieVariationService';
import AdminModal from '@component/admin/common/AdminModal';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
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
    .required('Tên biến thể không được để trống!')
    .max(60, 'Tên biến thể phải nhỏ hơn hoặc bằng 60 ký tự!'),
});

const MovieVariationFormModal = ({
  movieVariation,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const isEditing = Boolean(movieVariation?.id);
  const formId = 'movie-variation-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    reset({
      name: movieVariation?.name ?? '',
    });
  }, [movieVariation, reset]);

  const handleReset = () => {
    reset({
      name: movieVariation?.name ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = { ...value, name: value.name.trim() };

      if (isEditing) {
        await updateMovieVariation(movieVariation.id, payload);
        toast.success('Cập nhật biến thể suất chiếu thành công!');
      } else {
        await createMovieVariation(payload);
        toast.success('Thêm biến thể suất chiếu thành công!');
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
          ? 'Cập nhật biến thể suất chiếu thất bại!'
          : 'Thêm biến thể suất chiếu thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={
        isEditing ? 'Cập nhật biến thể suất chiếu' : 'Tạo biến thể suất chiếu'
      }
      description="Dùng màn hình này để quản lý các định dạng như 2D, 3D, IMAX, phụ đề hoặc lồng tiếng."
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
          label="Tên biến thể"
          control={control}
          Component={TextInput}
          placeHolder=": 2D Phụ đề, IMAX, Lồng tiếng"
          error={errors.name}
        />
      </form>
    </AdminModal>
  );
};

export default MovieVariationFormModal;
