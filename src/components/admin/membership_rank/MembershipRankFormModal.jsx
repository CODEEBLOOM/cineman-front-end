import {
  createMembershipRank,
  updateMembershipRank,
} from '@apis/membershipRankService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  name: yup
    .string()
    .trim()
    .required('Tên hạng thẻ không được để trống!')
    .max(50, 'Tên hạng thẻ phải nhỏ hơn hoặc bằng 50 ký tự!'),
  requiredPoint: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Điểm yêu cầu phải là số hợp lệ!')
    .required('Điểm yêu cầu không được để trống!')
    .integer('Điểm yêu cầu phải là số nguyên!')
    .min(0, 'Điểm yêu cầu phải lớn hơn hoặc bằng 0!'),
  returnPointsTicket: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Tỷ lệ hoàn điểm vé phải là số hợp lệ!')
    .required('Tỷ lệ hoàn điểm vé không được để trống!')
    .min(0, 'Tỷ lệ hoàn điểm vé phải lớn hơn hoặc bằng 0!'),
  returnPointsSnack: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Tỷ lệ hoàn điểm snack phải là số hợp lệ!')
    .required('Tỷ lệ hoàn điểm snack không được để trống!')
    .min(0, 'Tỷ lệ hoàn điểm snack phải lớn hơn hoặc bằng 0!'),
  priorityLevel: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Mức ưu tiên phải là số hợp lệ!')
    .required('Mức ưu tiên không được để trống!')
    .integer('Mức ưu tiên phải là số nguyên!')
    .min(0, 'Mức ưu tiên phải lớn hơn hoặc bằng 0!'),
});

const MembershipRankFormModal = ({
  membershipRank,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const membershipRankId =
    membershipRank?.id ?? membershipRank?.membershipRankId ?? null;
  const isEditing = Boolean(membershipRankId);
  const formId = 'membership-rank-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      requiredPoint: '',
      returnPointsTicket: '',
      returnPointsSnack: '',
      priorityLevel: '',
    },
  });

  useEffect(() => {
    reset({
      name: membershipRank?.name ?? '',
      requiredPoint: membershipRank?.requiredPoint ?? '',
      returnPointsTicket: membershipRank?.returnPointsTicket ?? '',
      returnPointsSnack: membershipRank?.returnPointsSnack ?? '',
      priorityLevel: membershipRank?.priorityLevel ?? '',
    });
  }, [membershipRank, reset]);

  const handleReset = () => {
    reset({
      name: membershipRank?.name ?? '',
      requiredPoint: membershipRank?.requiredPoint ?? '',
      returnPointsTicket: membershipRank?.returnPointsTicket ?? '',
      returnPointsSnack: membershipRank?.returnPointsSnack ?? '',
      priorityLevel: membershipRank?.priorityLevel ?? '',
    });
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        name: value.name.trim(),
        requiredPoint: Number(value.requiredPoint),
        returnPointsTicket: Number(value.returnPointsTicket),
        returnPointsSnack: Number(value.returnPointsSnack),
        priorityLevel: Number(value.priorityLevel),
      };

      if (isEditing) {
        await updateMembershipRank(membershipRankId, payload);
        toast.success('Cập nhật hạng thẻ thành công!');
      } else {
        await createMembershipRank(payload);
        toast.success('Tạo hạng thẻ thành công!');
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
        isEditing ? 'Cập nhật hạng thẻ thất bại!' : 'Tạo hạng thẻ thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật hạng thẻ' : 'Tạo hạng thẻ'}
      description="Thiết lập các mốc thẻ thành viên, số điểm yêu cầu và tỷ lệ hoàn điểm áp dụng cho vé và snack."
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
            disabled={isSubmitting}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
        Nhập tỷ lệ hoàn điểm dưới dạng số thập phân.
        <br />: <strong>0.05</strong> tương ứng <strong>5%</strong>,{' '}
        <strong>0.1</strong> tương ứng <strong>10%</strong>.
      </div>

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="name"
            require={true}
            label="Tên hạng thẻ"
            control={control}
            Component={TextInput}
            placeHolder=": Silver, Gold, Platinum"
            error={errors.name}
          />

          <FormField
            name="priorityLevel"
            require={true}
            label="Mức ưu tiên"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder=": 1"
            error={errors.priorityLevel}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="requiredPoint"
            require={true}
            label="Điểm yêu cầu"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder=": 10000"
            error={errors.requiredPoint}
          />

          <div className="flex items-end rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            Điểm yêu cầu là mốc tối thiểu để khách hàng được xét lên hạng thẻ
            này.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="returnPointsTicket"
            require={true}
            label="Tỷ lệ hoàn điểm vé"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder=": 0.05"
            error={errors.returnPointsTicket}
          />

          <FormField
            name="returnPointsSnack"
            require={true}
            label="Tỷ lệ hoàn điểm snack"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder=": 0.03"
            error={errors.returnPointsSnack}
          />
        </div>
      </form>
    </AdminModal>
  );
};

export default MembershipRankFormModal;
