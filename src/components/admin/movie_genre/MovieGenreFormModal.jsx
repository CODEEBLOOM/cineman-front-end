import { createGenre, updateGenre } from '@apis/genreService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const formSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên thể loại không được để trống!')
    .max(100, 'Tên thể loại phải nhỏ hơn hoặc bằng 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(250, 'Mô tả phải nhỏ hơn hoặc bằng 250 ký tự!'),
});

const MovieGenreFormModal = ({ genre, onSuccess, placement = 'top-center' }) => {
  const { closeTopModal } = useModelContext();
  const genreId = genre?.genresId ?? genre?.id;
  const isEditing = Boolean(genreId);
  const formId = 'movie-genre-form';

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
      name: genre?.name ?? '',
      description: genre?.description ?? '',
    });
  }, [genre, reset]);

  const handleReset = () => {
    reset({
      name: genre?.name ?? '',
      description: genre?.description ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        name: value.name.trim(),
        description: value.description?.trim() || '',
      };

      if (isEditing) {
        await updateGenre(genreId, payload);
        toast.success('Cập nhật thể loại phim thành công!');
      } else {
        await createGenre(payload);
        toast.success('Thêm thể loại phim thành công!');
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
          ? 'Cập nhật thể loại phim thất bại!'
          : 'Thêm thể loại phim thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật thể loại phim' : 'Tạo thể loại phim'}
      description="Danh mục thể loại được dùng khi tạo và phân loại phim trong hệ thống."
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
          label="Tên thể loại"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Hành động, Kinh dị, Hoạt hình"
          error={errors.name}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho thể loại phim"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default MovieGenreFormModal;
