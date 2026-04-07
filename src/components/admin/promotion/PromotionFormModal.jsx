import {
  createPromotion,
  extractPromotionDetail,
  findPromotionById,
  normalizePromotion,
  updatePromotion,
} from '@apis/promotionAdminService';
import {
  extractPromotionTypeList,
  findAllPromotionTypesAdmin,
  normalizePromotionType,
} from '@apis/promotionTypeAdminService';
import {
  extractMembershipRankList,
  findAllMembershipRanksAdmin,
  normalizeMembershipRank,
} from '@apis/membershipRankService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import MulSelect from '@component/form_field/MulSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
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

const isValidDateTime = (value) => {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
};

const formSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Tên khuyến mãi không được để trống!')
    .max(100, 'Tên khuyến mãi phải nhỏ hơn hoặc bằng 100 ký tự!'),
  content: yup
    .string()
    .trim()
    .required('Nội dung khuyến mãi không được để trống!')
    .max(500, 'Nội dung khuyến mãi phải nhỏ hơn hoặc bằng 500 ký tự!'),
  startDate: yup
    .string()
    .required('Thời gian bắt đầu không được để trống!')
    .test(
      'valid-start-date',
      'Thời gian bắt đầu không hợp lệ!',
      (value) => !value || isValidDateTime(value)
    ),
  endDate: yup
    .string()
    .nullable()
    .test(
      'valid-end-date',
      'Thời gian kết thúc không hợp lệ!',
      (value) => !value || isValidDateTime(value)
    )
    .test(
      'end-after-start',
      'Thời gian kết thúc phải sau thời gian bắt đầu!',
      (value, context) => {
        if (!value || !context.parent?.startDate) {
          return true;
        }

        return (
          new Date(value).getTime() >=
          new Date(context.parent.startDate).getTime()
        );
      }
    ),
  discount: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Mức giảm phải là số hợp lệ!')
    .required('Mức giảm không được để trống!')
    .moreThan(0, 'Mức giảm phải lớn hơn 0!')
    .max(1, 'Mức giảm không được lớn hơn 1!'),
  quantity: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Số lượng phải là số hợp lệ!')
    .required('Số lượng không được để trống!')
    .integer('Số lượng phải là số nguyên!')
    .min(1, 'Số lượng phải lớn hơn hoặc bằng 1!'),
  limitAmount: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Giá trị đơn tối thiểu phải là số hợp lệ!')
    .required('Giá trị đơn tối thiểu không được để trống!')
    .min(1, 'Giá trị đơn tối thiểu phải lớn hơn hoặc bằng 1!'),
  promotionTypeId: yup
    .number()
    .transform((_, originalValue) => transformNumber(originalValue))
    .typeError('Loại khuyến mãi không hợp lệ!')
    .required('Loại khuyến mãi không được để trống!')
    .integer('Loại khuyến mãi không hợp lệ!')
    .min(1, 'Loại khuyến mãi không hợp lệ!'),
  membershipRankIds: yup.array().of(yup.string().trim()),
});

const pad = (value) => String(value).padStart(2, '0');

const toDateTimeLocalInput = (value) => {
  if (!value) {
    return '';
  }

  const normalizedValue = String(value).trim().replace(' ', 'T');
  const matchedValue = normalizedValue.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/
  );

  if (matchedValue) {
    return matchedValue[1];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toApiDateTime = (value) => {
  if (!value) {
    return undefined;
  }

  return value.length === 16 ? `${value}:00` : value;
};

const buildDefaultValues = ({ promotion }) => ({
  name: promotion?.name ?? '',
  content: promotion?.content ?? '',
  startDate: toDateTimeLocalInput(promotion?.startDate),
  endDate: toDateTimeLocalInput(promotion?.endDate),
  discount:
    promotion?.discount || promotion?.discount === 0
      ? String(promotion.discount)
      : '',
  quantity:
    promotion?.quantity || promotion?.quantity === 0
      ? String(promotion.quantity)
      : '',
  limitAmount:
    promotion?.limitAmount || promotion?.limitAmount === 0
      ? String(promotion.limitAmount)
      : '',
  promotionTypeId:
    promotion?.promotionTypeId || promotion?.promotionTypeId === 0
      ? String(promotion.promotionTypeId)
      : '',
  membershipRankIds: Array.isArray(promotion?.membershipRankIds)
    ? promotion.membershipRankIds.map((id) => String(id))
    : [],
});

const PromotionFormModal = ({
  promotion = null,
  promotionId,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const { user } = useSelector((state) => state.user);
  const [promotionDetail, setPromotionDetail] = useState(
    promotion ? normalizePromotion(promotion) : null
  );
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [promotionTypeOptions, setPromotionTypeOptions] = useState([]);
  const [membershipRankOptions, setMembershipRankOptions] = useState([]);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);
  const effectivePromotionId =
    promotionId ?? promotion?.id ?? promotion?.promotionId ?? null;
  const isEditing = Boolean(effectivePromotionId);
  const formId = 'promotion-form';

  const currentPromotion = useMemo(
    () => (promotionDetail ? normalizePromotion(promotionDetail) : null),
    [promotionDetail]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: buildDefaultValues({
      promotion: currentPromotion,
    }),
  });

  const startDateValue = watch('startDate');
  const selectedMembershipRankIds = watch('membershipRankIds');

  useEffect(() => {
    setPromotionDetail(promotion ? normalizePromotion(promotion) : null);
  }, [promotion]);

  useEffect(() => {
    reset(
      buildDefaultValues({
        promotion: currentPromotion,
      })
    );
  }, [currentPromotion, reset]);

  useEffect(() => {
    let isMounted = true;

    if (!effectivePromotionId) {
      return () => {
        isMounted = false;
      };
    }

    const fetchPromotionDetail = async () => {
      setIsFetchingDetail(true);

      try {
        const response = await findPromotionById(effectivePromotionId);
        const detail = normalizePromotion(extractPromotionDetail(response));

        if (isMounted) {
          setPromotionDetail(detail);
        }
      } catch {
        if (isMounted) {
          toast.error('Không thể tải chi tiết khuyến mãi!');
        }
      } finally {
        if (isMounted) {
          setIsFetchingDetail(false);
        }
      }
    };

    fetchPromotionDetail();

    return () => {
      isMounted = false;
    };
  }, [effectivePromotionId]);

  useEffect(() => {
    let isMounted = true;

    const fetchDependencies = async () => {
      setIsLoadingDependencies(true);

      try {
        const [promotionTypesResponse, membershipRanksResponse] =
          await Promise.all([
            findAllPromotionTypesAdmin(),
            findAllMembershipRanksAdmin(),
          ]);

        if (!isMounted) {
          return;
        }

        setPromotionTypeOptions(
          extractPromotionTypeList(promotionTypesResponse)
            .map(normalizePromotionType)
            .map((item) => ({
              value: String(item.id ?? item.promotionTypeId),
              label: item.name || item.code || `#${item.id}`,
            }))
        );

        setMembershipRankOptions(
          extractMembershipRankList(membershipRanksResponse)
            .map(normalizeMembershipRank)
            .filter((item) => item.status !== false)
            .map((item) => ({
              value: String(item.id ?? item.membershipRankId),
              label: item.name,
            }))
        );
      } catch {
        if (isMounted) {
          toast.error('Không thể tải dữ liệu cấu hình khuyến mãi!');
        }
      } finally {
        if (isMounted) {
          setIsLoadingDependencies(false);
        }
      }
    };

    fetchDependencies();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReset = () => {
    reset(
      buildDefaultValues({
        promotion: currentPromotion,
      })
    );
  };

  const onSubmit = async (value) => {
    if (!user?.userId) {
      toast.error('Không tìm thấy nhân viên tạo khuyến mãi!');
      return;
    }

    try {
      const payload = {
        name: value.name.trim(),
        content: value.content.trim(),
        startDate: toApiDateTime(value.startDate),
        discount: Number(value.discount),
        quantity: Number(value.quantity),
        limitAmount: Number(value.limitAmount),
        staffId: Number(user.userId),
        promotionTypeId: Number(value.promotionTypeId),
        membershipRankIds: Array.isArray(value.membershipRankIds)
          ? value.membershipRankIds.map((id) => Number(id))
          : [],
      };

      if (value.endDate) {
        payload.endDate = toApiDateTime(value.endDate);
      }

      if (isEditing) {
        await updatePromotion(effectivePromotionId, payload);
        toast.success('Cập nhật khuyến mãi thành công!');
      } else {
        await createPromotion(payload);
        toast.success('Tạo khuyến mãi thành công!');
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
          ? 'Cập nhật khuyến mãi thất bại!'
          : 'Tạo khuyến mãi thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi'}
      onClose={closeTopModal}
      size="lg"
      placement={placement}
      actions={
        <>
          <Button
            type="button"
            variant="outlined"
            color="info"
            onClick={handleReset}
            disabled={isSubmitting || isFetchingDetail || isLoadingDependencies}
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
            disabled={isSubmitting || isFetchingDetail || isLoadingDependencies}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
        Nhập mức giảm dưới dạng số thập phân.
        <br />
        Ví dụ: <strong>0.1</strong> tương ứng <strong>10%</strong>,{' '}
        <strong>0.25</strong> tương ứng <strong>25%</strong>.
      </div>

      {currentPromotion?.code ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          <p className="font-semibold">Mã voucher: {currentPromotion.code}</p>
          <p>
            Mã sử dụng được hệ thống sinh tự động và sẽ hiển thị cho khách hàng
            sau khi lưu.
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          Mã voucher sẽ được hệ thống tự động sinh sau khi tạo khuyến mãi thành
          công.
        </div>
      )}

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="name"
            require={true}
            label="Tên khuyến mãi"
            control={control}
            Component={TextInput}
            placeHolder="Ví dụ: Giảm 20% cuối tuần"
            error={errors.name}
          />

          <FormField
            name="promotionTypeId"
            require={true}
            label="Loại khuyến mãi"
            control={control}
            Component={CustomSelect}
            placeHolder="Chọn loại khuyến mãi"
            options={promotionTypeOptions}
            disabled={isLoadingDependencies || isFetchingDetail}
            error={errors.promotionTypeId}
          />
        </div>

        <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Người tạo hiện tại:{' '}
          <strong>
            {currentPromotion?.staffName ?? user?.fullName ?? 'Chưa xác định'}
          </strong>
        </div>

        <FormField
          name="content"
          require={true}
          label="Nội dung khuyến mãi"
          control={control}
          Component={TextAreaInput}
          placeHolder="Mô tả điều kiện và lợi ích của chương trình khuyến mãi"
          rows={4}
          error={errors.content}
        />

        <FormField
          name="membershipRankIds"
          label="Hạng thành viên áp dụng"
          control={control}
          Component={MulSelect}
          placeHolder="Để trống nếu áp dụng cho tất cả hạng thành viên"
          options={membershipRankOptions}
          disabled={isLoadingDependencies || isFetchingDetail}
          error={errors.membershipRankIds}
        />

        <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {Array.isArray(selectedMembershipRankIds) &&
          selectedMembershipRankIds.length > 0
            ? 'Khuyến mãi sẽ chỉ áp dụng cho các hạng thành viên đã chọn.'
            : 'Không chọn hạng thành viên nghĩa là khuyến mãi áp dụng cho tất cả hạng thành viên.'}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="discount"
            require={true}
            label="Mức giảm"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder="Ví dụ: 0.15"
            error={errors.discount}
          />

          <FormField
            name="quantity"
            require={true}
            label="Số lượng voucher"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder="Ví dụ: 200"
            error={errors.quantity}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="limitAmount"
            require={true}
            label="Giá trị đơn tối thiểu"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder="Ví dụ: 120000"
            error={errors.limitAmount}
          />

          <div className="flex items-end rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            Voucher chỉ áp dụng khi tổng giá trị hóa đơn lớn hơn hoặc bằng
            ngưỡng này.
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="startDate"
            require={true}
            label="Thời gian bắt đầu"
            control={control}
            Component={TextInput}
            type="datetime-local"
            error={errors.startDate}
          />

          <FormField
            name="endDate"
            label="Thời gian kết thúc"
            control={control}
            Component={TextInput}
            type="datetime-local"
            placeHolder="Có thể để trống nếu chưa xác định"
            error={errors.endDate}
          />
        </div>

        {startDateValue ? (
          <p className="mt-1 text-sm text-slate-500">
            Nếu có thời gian kết thúc, chương trình phải kết thúc sau{' '}
            <strong>{startDateValue.replace('T', ' ')}</strong>.
          </p>
        ) : null}

        {isFetchingDetail ? (
          <p className="mt-4 text-sm text-slate-500">
            Đang tải chi tiết khuyến mãi...
          </p>
        ) : null}

        {isLoadingDependencies ? (
          <p className="mt-2 text-sm text-slate-500">
            Đang tải loại khuyến mãi và hạng thành viên...
          </p>
        ) : null}
      </form>
    </AdminModal>
  );
};

export default PromotionFormModal;
