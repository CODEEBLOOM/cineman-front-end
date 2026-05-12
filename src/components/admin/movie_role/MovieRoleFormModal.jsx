import { createMovieRole, updateMovieRole } from '@apis/movieRoleService';
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
    .required('Tên vai trò không được để trống!')
    .max(100, 'Tên vai trò phải nhỏ hơn hoặc bằng 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(250, 'Mô tả phải nhỏ hơn hoặc bằng 250 ký tự!'),
});

const MovieRoleFormModal = ({ movieRole, onSuccess, placement = 'top-center' }) => {
  const { closeTopModal } = useModelContext();
  const movieRoleId = movieRole?.movieRoleId ?? movieRole?.id;
  const isEditing = Boolean(movieRoleId);
  const formId = 'movie-role-form';

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
      name: movieRole?.name ?? '',
      description: movieRole?.description ?? '',
    });
  }, [movieRole, reset]);

  const handleReset = () => {
    reset({
      name: movieRole?.name ?? '',
      description: movieRole?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        name: value.name.trim(),
        description: value.description?.trim() || '',
      };

      if (isEditing) {
        await updateMovieRole(movieRoleId, payload);
        toast.success('Cập nhật vai trò phim thành công!');
      } else {
        await createMovieRole(payload);
        toast.success('Thêm vai trò phim thành công!');
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
        isEditing ? 'Cập nhật vai trò phim thất bại!' : 'Thêm vai trò phim thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật vai trò phim' : 'Tạo vai trò phim'}
      description="Danh mục vai trò được dùng để gắn người tham gia vào từng bộ phim, ví dụ đạo diễn, diễn viên hoặc biên kịch."
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
          name="name"
          require={true}
          label="Tên vai trò"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Đạo diễn, Diễn viên, Biên kịch"
          error={errors.name}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho vai trò phim"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default MovieRoleFormModal;
