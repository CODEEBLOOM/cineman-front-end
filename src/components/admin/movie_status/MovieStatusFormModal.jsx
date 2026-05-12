import { createMovieStatus, updateMovieStatus } from '@apis/movieStatusService';
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
  id: yup
    .string()
    .transform((value) => value?.trim()?.toUpperCase() ?? '')
    .required('Mã trạng thái không được để trống!')
    .max(25, 'Mã trạng thái phải nhỏ hơn hoặc bằng 25 ký tự!')
    .matches(
      /^[A-Z0-9_-]+$/,
      'Mã trạng thái chỉ được gồm chữ in hoa, số, gạch dưới hoặc gạch nối!'
    ),
  name: yup
    .string()
    .trim()
    .required('Tên trạng thái không được để trống!')
    .max(100, 'Tên trạng thái phải nhỏ hơn hoặc bằng 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(250, 'Mô tả phải nhỏ hơn hoặc bằng 250 ký tự!'),
});

const MovieStatusFormModal = ({
  movieStatus,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const movieStatusId = movieStatus?.statusId ?? movieStatus?.id;
  const isEditing = Boolean(movieStatusId);
  const formId = 'movie-status-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    reset({
      id: movieStatusId ?? '',
      name: movieStatus?.name ?? '',
      description: movieStatus?.description ?? '',
    });
  }, [movieStatus, movieStatusId, reset]);

  const handleReset = () => {
    reset({
      id: movieStatusId ?? '',
      name: movieStatus?.name ?? '',
      description: movieStatus?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        id: isEditing ? movieStatusId : value.id.trim().toUpperCase(),
        name: value.name.trim(),
        description: value.description?.trim() || '',
      };

      if (isEditing) {
        await updateMovieStatus(payload);
        toast.success('Cập nhật trạng thái phim thành công!');
      } else {
        await createMovieStatus(payload);
        toast.success('Thêm trạng thái phim thành công!');
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
          ? 'Cập nhật trạng thái phim thất bại!'
          : 'Thêm trạng thái phim thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật trạng thái phim' : 'Tạo trạng thái phim'}
      description="Quản lý các mã trạng thái như Sắp chiếu, Đang chiếu, Chiếu đặc biệt hoặc các trạng thái nghiệp vụ khác."
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
          name="id"
          require={true}
          label="Mã trạng thái"
          control={control}
          Component={TextInput}
          placeHolder=": SC, DC, DB"
          error={errors.id}
          disabled={isEditing}
        />

        <FormField
          name="name"
          require={true}
          label="Tên trạng thái"
          control={control}
          Component={TextInput}
          placeHolder=": Sắp chiếu, Đang chiếu"
          error={errors.name}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho trạng thái phim"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default MovieStatusFormModal;
