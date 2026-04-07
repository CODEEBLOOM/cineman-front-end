import {
  createPromotionType,
  extractPromotionTypeDetail,
  findPromotionTypeById,
  normalizePromotionType,
  updatePromotionType,
} from '@apis/promotionTypeAdminService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const formSchema = yup.object({
  code: yup
    .string()
    .trim()
    .required('Mã loại khuyến mãi không được để trống!')
    .max(50, 'Mã loại khuyến mãi tối đa 50 ký tự!'),
  name: yup
    .string()
    .trim()
    .required('Tên loại khuyến mãi không được để trống!')
    .max(100, 'Tên loại khuyến mãi tối đa 100 ký tự!'),
  description: yup
    .string()
    .trim()
    .max(500, 'Mô tả tối đa 500 ký tự!')
    .nullable(),
});

const PromotionTypeFormModal = ({
  promotionType,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const promotionTypeId = promotionType?.promotionTypeId ?? promotionType?.id;
  const isEditing = Boolean(promotionTypeId);
  const formId = 'promotion-type-form';
  const [promotionTypeDetail, setPromotionTypeDetail] = useState(
    promotionType ? normalizePromotionType(promotionType) : null
  );
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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
    setPromotionTypeDetail(
      promotionType ? normalizePromotionType(promotionType) : null
    );
  }, [promotionType]);

  useEffect(() => {
    reset({
      code: promotionTypeDetail?.code ?? '',
      name: promotionTypeDetail?.name ?? '',
      description: promotionTypeDetail?.description ?? '',
    });
  }, [promotionTypeDetail, reset]);

  useEffect(() => {
    if (!isEditing || !promotionTypeId) {
      return;
    }

    const fetchPromotionTypeDetail = async () => {
      setIsLoadingDetail(true);

      try {
        const response = await findPromotionTypeById(promotionTypeId);
        const detail = normalizePromotionType(
          extractPromotionTypeDetail(response)
        );

        if (detail) {
          setPromotionTypeDetail(detail);
        }
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error('Không thể tải chi tiết loại khuyến mãi!');
        }
      } finally {
        setIsLoadingDetail(false);
      }
    };

    fetchPromotionTypeDetail();
  }, [isEditing, promotionTypeId]);

  const handleReset = () => {
    reset({
      code: promotionTypeDetail?.code ?? '',
      name: promotionTypeDetail?.name ?? '',
      description: promotionTypeDetail?.description ?? '',
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
        await updatePromotionType(promotionTypeId, payload);
        toast.success('Cập nhật loại khuyến mãi thành công!');
      } else {
        await createPromotionType(payload);
        toast.success('Tạo loại khuyến mãi thành công!');
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
          ? 'Cập nhật loại khuyến mãi thất bại!'
          : 'Tạo loại khuyến mãi thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={
        isEditing ? 'Cập nhật loại khuyến mãi' : 'Tạo loại khuyến mãi'
      }
      description="Loại khuyến mãi giúp nhóm các chương trình ưu đãi theo chiến dịch, mục tiêu hoặc cách áp dụng trong hệ thống."
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
            disabled={isLoadingDetail || isSubmitting}
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
            disabled={isLoadingDetail || isSubmitting}
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
          label="Mã loại khuyến mãi"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: FLASH, MEMBER, FESTIVAL"
          error={errors.code}
          disabled={isLoadingDetail}
        />

        <FormField
          name="name"
          require={true}
          label="Tên loại khuyến mãi"
          control={control}
          Component={TextInput}
          placeHolder="Ví dụ: Giảm giá chớp nhoáng"
          error={errors.name}
          disabled={isLoadingDetail}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập mô tả ngắn cho loại khuyến mãi"
          rows={4}
          error={errors.description}
          disabled={isLoadingDetail}
        />
      </form>
    </AdminModal>
  );
};

export default PromotionTypeFormModal;
