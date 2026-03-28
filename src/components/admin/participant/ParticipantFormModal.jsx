import { createParticipant, updateParticipant } from '@apis/participantService';
import { uploadPhoto } from '@apis/uploadFileService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import ImageComponent from '@component/ImageComponent';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const formSchema = yup.object({
  birthName: yup
    .string()
    .trim()
    .required('Tên thật không được để trống!')
    .max(100, 'Tên thật phải nhỏ hơn hoặc bằng 100 ký tự!'),
  nickname: yup
    .string()
    .trim()
    .max(100, 'Nghệ danh phải nhỏ hơn hoặc bằng 100 ký tự!'),
  gender: yup
    .string()
    .required('Giới tính không được để trống!')
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ!'),
  nationality: yup
    .string()
    .trim()
    .required('Quốc tịch không được để trống!')
    .max(100, 'Quốc tịch phải nhỏ hơn hoặc bằng 100 ký tự!'),
  miniBio: yup
    .string()
    .trim()
    .max(500, 'Tiểu sử ngắn phải nhỏ hơn hoặc bằng 500 ký tự!'),
  avatar: yup.string().trim().required('Ảnh đại diện không được để trống!'),
});

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

const ParticipantFormModal = ({
  participant,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const participantId = participant?.participantId ?? participant?.id;
  const isEditing = Boolean(participantId);
  const formId = 'participant-form';
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      birthName: '',
      nickname: '',
      gender: '',
      nationality: '',
      miniBio: '',
      avatar: '',
    },
  });

  useEffect(() => {
    reset({
      birthName: participant?.birthName ?? '',
      nickname: participant?.nickname ?? '',
      gender: participant?.gender ?? '',
      nationality: participant?.nationality ?? '',
      miniBio: participant?.miniBio ?? '',
      avatar: participant?.avatar ?? '',
    });

    setAvatarPreview(resolveAvatarSrc(participant?.avatar ?? ''));
  }, [participant, reset]);

  const handleReset = () => {
    reset({
      birthName: participant?.birthName ?? '',
      nickname: participant?.nickname ?? '',
      gender: participant?.gender ?? '',
      nationality: participant?.nationality ?? '',
      miniBio: participant?.miniBio ?? '',
      avatar: participant?.avatar ?? '',
    });

    setAvatarPreview(resolveAvatarSrc(participant?.avatar ?? ''));
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
        birthName: value.birthName.trim(),
        nickname: value.nickname?.trim() || '',
        gender: value.gender,
        nationality: value.nationality.trim(),
        miniBio: value.miniBio?.trim() || '',
        avatar: value.avatar,
      };

      if (isEditing) {
        await updateParticipant(participantId, payload);
        toast.success('Cập nhật người tham gia thành công!');
      } else {
        await createParticipant(payload);
        toast.success('Thêm người tham gia thành công!');
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
          ? 'Cập nhật người tham gia thất bại!'
          : 'Thêm người tham gia thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật người tham gia' : 'Tạo người tham gia'}
      onClose={closeTopModal}
      size="md"
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
            disabled={isSubmitting || isUploading}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 grid gap-4 md:grid-cols-[170px_1fr]">
          <div>
            <p className="mb-1 font-medium">
              <span className="text-red-600">*</span>&nbsp;Ảnh đại diện
            </p>
            <ImageComponent
              src={avatarPreview}
              width={160}
              height={220}
              className="h-[220px] w-[160px] rounded-md border border-slate-200 object-cover"
            />
          </div>

          <div className="flex flex-col justify-end gap-3">
            <FormField
              name="avatar"
              require={true}
              label="Giá trị ảnh"
              control={control}
              Component={TextInput}
              placeHolder="Đường dẫn ảnh sau khi tải lên"
              error={errors.avatar}
              disabled={true}
            />

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
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="birthName"
            require={true}
            label="Tên thật"
            control={control}
            Component={TextInput}
            placeHolder="Nhập tên thật"
            error={errors.birthName}
          />

          <FormField
            name="nickname"
            label="Nghệ danh"
            control={control}
            Component={TextInput}
            placeHolder="Nhập nghệ danh hoặc tên hiển thị"
            error={errors.nickname}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="gender"
            require={true}
            label="Giới tính"
            control={control}
            Component={CustomSelect}
            options={genderOptions}
            placeHolder="Chọn giới tính"
            error={errors.gender}
          />

          <FormField
            name="nationality"
            require={true}
            label="Quốc tịch"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: Việt Nam, Hàn Quốc, Mỹ"
            error={errors.nationality}
          />
        </div>

        <FormField
          name="miniBio"
          label="Tiểu sử ngắn"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn về người tham gia"
          rows={4}
          error={errors.miniBio}
        />
      </form>
    </AdminModal>
  );
};

export default ParticipantFormModal;
