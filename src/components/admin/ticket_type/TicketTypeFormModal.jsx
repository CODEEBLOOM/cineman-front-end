import { createTicketType, updateTicketType } from '@apis/ticketTypeService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const TICKET_TYPE_OPTIONS = [
  { value: 'ADULT', label: 'Người lớn' },
  { value: 'CHILD', label: 'Trẻ em' },
  { value: 'STUDENT', label: 'Học sinh / Sinh viên' },
  { value: 'SENIOR', label: 'Người cao tuổi' },
];

const formSchema = yup.object({
  name: yup
    .string()
    .oneOf(
      TICKET_TYPE_OPTIONS.map((option) => option.value),
      'Loại vé không hợp lệ!'
    )
    .required('Vui lòng chọn loại vé!'),
  description: yup
    .string()
    .trim()
    .max(200, 'Mô tả phải nhỏ hơn hoặc bằng 200 ký tự!')
    .nullable(),
  price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Giá vé phải là số hợp lệ!')
    .required('Giá vé không được để trống!')
    .min(0, 'Giá vé phải lớn hơn hoặc bằng 0!'),
});

const TicketTypeFormModal = ({
  ticketType,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const isEditing = Boolean(ticketType?.id);
  const formId = 'ticket-type-form';

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
      price: '',
    },
  });

  useEffect(() => {
    reset({
      name: ticketType?.name ?? '',
      description: ticketType?.description ?? '',
      price: ticketType?.price ?? '',
    });
  }, [ticketType, reset]);

  const handleReset = () => {
    reset({
      name: ticketType?.name ?? '',
      description: ticketType?.description ?? '',
      price: ticketType?.price ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        name: value.name,
        description: value.description?.trim() || null,
        price: Number(value.price),
      };

      if (isEditing) {
        await updateTicketType(ticketType.id, payload);
        toast.success('Cập nhật loại vé thành công!');
      } else {
        await createTicketType(payload);
        toast.success('Thêm loại vé thành công!');
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
        isEditing ? 'Cập nhật loại vé thất bại!' : 'Thêm loại vé thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật loại vé' : 'Tạo loại vé'}
      description="Quản lý cấu hình loại vé và mức giá áp dụng cho từng nhóm khách hàng trong hệ thống."
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
          label="Loại vé"
          control={control}
          Component={CustomSelect}
          placeHolder="Chọn loại vé"
          options={TICKET_TYPE_OPTIONS}
          error={errors.name}
        />

        <FormField
          name="price"
          require={true}
          label="Giá vé"
          control={control}
          Component={TextInput}
          type="number"
          placeHolder=": 90000"
          error={errors.price}
        />

        <FormField
          name="description"
          label="Mô tả"
          control={control}
          Component={TextAreaInput}
          placeHolder="Mô tả ngắn về loại vé, đối tượng áp dụng hoặc ghi chú nội bộ"
          error={errors.description}
          rows={4}
        />
      </form>
    </AdminModal>
  );
};

export default TicketTypeFormModal;
