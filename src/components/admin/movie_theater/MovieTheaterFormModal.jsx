import {
  createMovieTheater,
  updateMovieTheater,
} from '@apis/movieTheaterService';
import {
  extractProvinceList,
  findAll as findAllProvince,
} from '@apis/provinceService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const formSchema = yup.object({
  name: yup.string().trim().required('Tên rạp không được để trống!').max(200),
  address: yup
    .string()
    .trim()
    .required('Địa chỉ không được để trống!')
    .max(200),
  hotline: yup.string().trim().required('Hotline không được để trống!').max(20),
  iframeCode: yup
    .string()
    .trim()
    .required('Mã iframe không được để trống!')
    .max(300),
  provinceId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng chọn chi nhánh!')
    .required('Chi nhánh không được để trống!')
    .min(1, 'Chi nhánh không hợp lệ!'),
});

const MovieTheaterFormModal = ({
  movieTheater,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const [provinceOptions, setProvinceOptions] = useState([]);
  const isEditing = Boolean(movieTheater?.movieTheaterId ?? movieTheater?.id);
  const movieTheaterId = movieTheater?.movieTheaterId ?? movieTheater?.id;
  const formId = 'movie-theater-form';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      hotline: '',
      iframeCode: '',
      provinceId: '',
    },
  });

  useEffect(() => {
    const loadProvinceOptions = async () => {
      try {
        const response = await findAllProvince();
        const options = extractProvinceList(response).map((item) => ({
          value: item.id,
          label: `${item.code} - ${item.name}`,
        }));
        setProvinceOptions(options);
      } catch {
        toast.error('Không thể tải danh sách chi nhánh!');
      }
    };

    loadProvinceOptions();
  }, []);

  useEffect(() => {
    reset({
      name: movieTheater?.name ?? '',
      address: movieTheater?.address ?? '',
      hotline: movieTheater?.hotline ?? '',
      iframeCode: movieTheater?.iframeCode ?? '',
      provinceId: movieTheater?.province?.id ?? movieTheater?.provinceId ?? '',
    });
  }, [movieTheater, reset]);

  const handleReset = () => {
    reset({
      name: movieTheater?.name ?? '',
      address: movieTheater?.address ?? '',
      hotline: movieTheater?.hotline ?? '',
      iframeCode: movieTheater?.iframeCode ?? '',
      provinceId: movieTheater?.province?.id ?? movieTheater?.provinceId ?? '',
    });
  };

  const onSubmit = async (value) => {
    const payload = {
      name: value.name.trim(),
      address: value.address.trim(),
      hotline: value.hotline.trim(),
      iframeCode: value.iframeCode.trim(),
      provinceId: Number(value.provinceId),
    };

    try {
      if (isEditing) {
        await updateMovieTheater(movieTheaterId, payload);
        toast.success('Cập nhật rạp thành công!');
      } else {
        await createMovieTheater(payload);
        toast.success('Tạo rạp thành công!');
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

      toast.error(isEditing ? 'Cập nhật rạp thất bại!' : 'Tạo rạp thất bại!');
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật rạp' : 'Tạo rạp'}
      description="Quản lý thông tin rạp, địa chỉ liên hệ và chi nhánh vận hành của từng điểm chiếu."
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
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="name"
          require={true}
          label="Tên rạp"
          control={control}
          Component={TextInput}
          placeHolder=": Poly Đà Nẵng"
          error={errors.name}
        />

        <FormField
          name="provinceId"
          require={true}
          label="Chi nhánh"
          control={control}
          Component={CustomSelect}
          placeHolder="Chọn chi nhánh"
          options={provinceOptions}
          error={errors.provinceId}
        />

        <FormField
          name="address"
          require={true}
          label="Địa chỉ"
          control={control}
          Component={TextAreaInput}
          placeHolder="Nhập địa chỉ rạp"
          error={errors.address}
          rows={3}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormField
            name="hotline"
            require={true}
            label="Hotline"
            control={control}
            Component={TextInput}
            placeHolder=": 0909123456"
            error={errors.hotline}
          />
          <FormField
            name="iframeCode"
            require={true}
            label="Iframe map"
            control={control}
            Component={TextInput}
            placeHolder="Nhập iframe map hoặc embed URL"
            error={errors.iframeCode}
          />
        </div>
      </form>
    </AdminModal>
  );
};

export default MovieTheaterFormModal;
