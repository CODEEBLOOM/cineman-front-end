import { createSnack, updateSnack } from '@apis/snackAdminService';
import {
  extractSnackTypeList,
  findAllSnackTypesAdmin,
} from '@apis/snackTypeAdminService';
import { uploadPhoto } from '@apis/uploadFileService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import ImageComponent from '@component/ImageComponent';
import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const transformNumber = (originalValue) => {
  if (
    originalValue === '' ||
    originalValue === null ||
    originalValue === undefined
  ) {
    return NaN;
  }

  return Number(originalValue);
};

const formSchema = yup.object({
  snackName: yup
    .string()
    .trim()
    .required('Tên đồ ăn vặt không được để trống!')
    .max(100, 'Tên đồ ăn vặt phải nhỏ hơn hoặc bằng 100 ký tự!'),
  unitPrice: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Giá bán không hợp lệ!')
    .required('Giá bán không được để trống!')
    .min(0, 'Giá bán phải lớn hơn hoặc bằng 0!'),
  image: yup
    .string()
    .trim()
    .required('Ảnh đồ ăn vặt không được để trống!')
    .max(100, 'Đường dẫn ảnh phải nhỏ hơn hoặc bằng 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(200, 'Mô tả phải nhỏ hơn hoặc bằng 200 ký tự!'),
  snackTypeId: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Loại đồ ăn vặt không hợp lệ!')
    .required('Loại đồ ăn vặt không được để trống!')
    .integer('Loại đồ ăn vặt không hợp lệ!')
    .min(1, 'Loại đồ ăn vặt không hợp lệ!'),
});

const resolveImageSrc = (image) => {
  if (!image) {
    return '';
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${import.meta.env.VITE_STORAGES}/${image}`;
};

const mapSnackTypeOptions = (snackTypes) =>
  snackTypes
    .map((snackType) => {
      const snackTypeId = snackType?.snackTypeId ?? snackType?.id;

      if (!snackTypeId) {
        return null;
      }

      return {
        value: snackTypeId,
        label: snackType?.name ?? `Loại đồ ăn vặt #${snackTypeId}`,
      };
    })
    .filter(Boolean);

const SnackFormModal = ({ snack, onSuccess, placement = 'top-center' }) => {
  const { closeTopModal } = useModelContext();
  const snackId = snack?.snackId ?? snack?.id;
  const isEditing = Boolean(snackId);
  const formId = 'snack-form';
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [snackTypeOptions, setSnackTypeOptions] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      snackName: '',
      unitPrice: '',
      image: '',
      description: '',
      snackTypeId: '',
    },
  });

  useEffect(() => {
    reset({
      snackName: snack?.snackName ?? snack?.name ?? '',
      unitPrice: snack?.unitPrice ?? '',
      image: snack?.image ?? '',
      description: snack?.description ?? '',
      snackTypeId:
        snack?.snackTypeId ??
        snack?.snackType?.snackTypeId ??
        snack?.snackType?.id ??
        snack?.snackTypes?.snackTypeId ??
        snack?.snackTypes?.id ??
        '',
    });

    setImagePreview(resolveImageSrc(snack?.image ?? ''));
  }, [snack, reset]);

  useEffect(() => {
    const bootstrapSnackTypes = async () => {
      setIsBootstrapping(true);

      try {
        const response = await findAllSnackTypesAdmin();
        setSnackTypeOptions(
          mapSnackTypeOptions(extractSnackTypeList(response))
        );
      } catch {
        toast.error('Không thể tải danh sách loại đồ ăn vặt!');
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapSnackTypes();
  }, []);

  const handleReset = () => {
    reset({
      snackName: snack?.snackName ?? snack?.name ?? '',
      unitPrice: snack?.unitPrice ?? '',
      image: snack?.image ?? '',
      description: snack?.description ?? '',
      snackTypeId:
        snack?.snackTypeId ??
        snack?.snackType?.snackTypeId ??
        snack?.snackType?.id ??
        snack?.snackTypes?.snackTypeId ??
        snack?.snackTypes?.id ??
        '',
    });

    setImagePreview(resolveImageSrc(snack?.image ?? ''));
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const imageValue = await uploadPhoto(file);
      setValue('image', imageValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setImagePreview(resolveImageSrc(imageValue));
      toast.success('Tải ảnh đồ ăn vặt thành công!');
    } catch (error) {
      if (error?.response?.status === 400 || error?.response?.status === 401) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Tải ảnh đồ ăn vặt thất bại!');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        snackName: value.snackName.trim(),
        unitPrice: Number(value.unitPrice),
        image: value.image.trim(),
        description: value.description?.trim() || '',
        snackTypeId: Number(value.snackTypeId),
      };

      if (isEditing) {
        await updateSnack(snackId, payload);
        toast.success('Cập nhật đồ ăn vặt thành công!');
      } else {
        await createSnack(payload);
        toast.success('Thêm đồ ăn vặt thành công!');
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
        isEditing ? 'Cập nhật đồ ăn vặt thất bại!' : 'Thêm đồ ăn vặt thất bại!'
      );
    }
  };

  const unitPriceValue = Number(watch('unitPrice'));
  const hasSnackTypeOptions = snackTypeOptions.length > 0;
  const isSubmitDisabled =
    isSubmitting || isUploading || isBootstrapping || !hasSnackTypeOptions;

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật đồ ăn vặt' : 'Tạo đồ ăn vặt'}
      description="Quản lý sản phẩm bán kèm tại rạp như bắp rang, nước uống hoặc combo theo từng loại đồ ăn vặt."
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
            disabled={isSubmitDisabled}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      {!hasSnackTypeOptions ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Hiện chưa có loại đồ ăn vặt nào trong hệ thống. Bạn cần tạo loại đồ ăn
          vặt trước khi thêm sản phẩm.
        </div>
      ) : null}

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 grid gap-4 md:grid-cols-[170px_1fr]">
          <div>
            <p className="mb-1 font-medium">
              <span className="text-red-600">*</span>&nbsp;Ảnh đồ ăn vặt
            </p>
            <ImageComponent
              src={imagePreview}
              width={160}
              height={160}
              className="h-40 w-40 rounded-md border border-slate-200 object-cover"
            />
          </div>

          <div className="flex flex-col justify-end gap-3">
            <div>
              <Button
                variant="contained"
                color="warning"
                component="label"
                disabled={isUploading}
              >
                {isUploading ? 'Đang tải ảnh...' : 'Tải ảnh đồ ăn vặt'}
                <input
                  type="file"
                  hidden
                  onChange={handleUploadImage}
                  accept="image/*"
                  multiple={false}
                />
              </Button>
            </div>

            {errors.image ? (
              <p className="text-sm text-red-600">{errors.image.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="snackName"
            require={true}
            label="Tên đồ ăn vặt"
            control={control}
            Component={TextInput}
            placeHolder="Nhập tên sản phẩm"
            error={errors.snackName}
          />

          <FormField
            name="snackTypeId"
            require={true}
            label="Loại đồ ăn vặt"
            control={control}
            Component={CustomSelect}
            options={snackTypeOptions}
            placeHolder={
              isBootstrapping
                ? 'Đang tải loại đồ ăn vặt...'
                : 'Chọn loại đồ ăn vặt'
            }
            error={errors.snackTypeId}
            disabled={isBootstrapping || !hasSnackTypeOptions}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormField
              name="unitPrice"
              require={true}
              label="Giá bán"
              control={control}
              Component={TextInput}
              type="number"
              placeHolder="Nhập giá bán"
              error={errors.unitPrice}
            />
            <p className="mt-1 text-sm text-slate-500">
              Giá hiển thị:{' '}
              {currencyFormatter(
                Number.isFinite(unitPriceValue) ? unitPriceValue : 0
              )}
            </p>
          </div>

          <div className="flex items-end rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Giá bán sẽ được dùng trực tiếp trong phần bán vé và hóa đơn dịch vụ.
          </div>
        </div>

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho đồ ăn vặt"
          rows={4}
          error={errors.description}
        />
      </form>
    </AdminModal>
  );
};

export default SnackFormModal;
