import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useModelContext } from '@context/ModalContext';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { create, update } from '@apis/cinemaTheaterService';
import {
  extractCinemaTypeList,
  findAll as findAllCinemaType,
} from '@apis/cinemaTypeService';
import {
  extractMovieTheaterList,
  findAllMovieTheater,
} from '@apis/movieTheaterService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextInput from '@component/form_field/TextInput';
import CustomSelect from '@component/form_field/CustomSelect';

const DEFAULT_SEAT_LAYOUT = {
  numberOfRows: 10,
  numberOfColumns: 10,
  regularSeatRow: 7,
  vipSeatRow: 2,
  doubleSeatRow: 1,
};

const formSchema = yup.object({
  name: yup.string().trim().required('Tên phòng chiếu không được để trống!'),
  numberOfRows: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng nhập số hàng ghế hợp lệ!')
    .required('Số lượng hàng ghế không được để trống!')
    .min(1, 'Số hàng ghế phải lớn hơn 0!'),
  numberOfColumns: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng nhập số cột ghế hợp lệ!')
    .required('Số lượng cột ghế không được để trống!')
    .min(1, 'Số cột ghế phải lớn hơn 0!'),
  regularSeatRow: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng nhập số hàng ghế thường hợp lệ!')
    .required('Số lượng hàng ghế thường không được để trống!')
    .min(1, 'Số hàng ghế thường phải lớn hơn 0!'),
  vipSeatRow: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng nhập số hàng ghế VIP hợp lệ!')
    .required('Số lượng hàng ghế VIP không được để trống!')
    .min(0, 'Số hàng ghế VIP phải lớn hơn hoặc bằng 0!'),
  doubleSeatRow: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng nhập số hàng ghế đôi hợp lệ!')
    .required('Số lượng hàng ghế đôi không được để trống!')
    .min(0, 'Số hàng ghế đôi phải lớn hơn hoặc bằng 0!'),
  cinemaTypeId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng chọn loại phòng chiếu!')
    .required('Loại phòng chiếu không được để trống!'),
  movieTheaterId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? NaN : value
    )
    .typeError('Vui lòng chọn rạp chiếu!')
    .required('Rạp chiếu không được để trống!'),
});

const ModalCreateCinemaTheater = ({
  fetchCinemaTheaters,
  isUpdate = false,
  cinemaTheaters,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const dispatch = useDispatch();
  const [cinemaTypes, setCinemaTypes] = useState([]);
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const formId = 'cinema-theater-form';
  const isPublished = isUpdate && cinemaTheaters?.status === 'PUBLISHED';

  const buildDefaultValues = useCallback(
    () => ({
      name: cinemaTheaters?.name ?? '',
      numberOfRows:
        cinemaTheaters?.numberOfRows ?? DEFAULT_SEAT_LAYOUT.numberOfRows,
      numberOfColumns:
        cinemaTheaters?.numberOfColumns ?? DEFAULT_SEAT_LAYOUT.numberOfColumns,
      regularSeatRow:
        cinemaTheaters?.regularSeatRow ?? DEFAULT_SEAT_LAYOUT.regularSeatRow,
      vipSeatRow: cinemaTheaters?.vipSeatRow ?? DEFAULT_SEAT_LAYOUT.vipSeatRow,
      doubleSeatRow:
        cinemaTheaters?.doubleSeatRow ?? DEFAULT_SEAT_LAYOUT.doubleSeatRow,
      movieTheaterId: cinemaTheaters?.movieTheater?.movieTheaterId ?? '',
      cinemaTypeId: cinemaTheaters?.cinemaType?.cinemaTypeId ?? '',
    }),
    [cinemaTheaters]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: buildDefaultValues(),
  });

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [cinemaTypeResponse, movieTheaterResponse] = await Promise.all([
          findAllCinemaType(),
          findAllMovieTheater(),
        ]);

        setCinemaTypes(
          extractCinemaTypeList(cinemaTypeResponse).map((item) => ({
            label: `${item.code} - ${item.name}`,
            value: item.cinemaTypeId ?? item.id,
          }))
        );

        setMovieTheaters(
          extractMovieTheaterList(movieTheaterResponse).map((item) => ({
            label: item.name,
            value: item.movieTheaterId ?? item.id,
          }))
        );
      } catch {
        toast.error('Không thể tải dữ liệu rạp và loại phòng!');
      }
    };

    loadDependencies();
  }, []);

  useEffect(() => {
    reset(buildDefaultValues());
  }, [buildDefaultValues, reset]);

  const handleSubmitForm = async (value) => {
    const totalSeatRows =
      Number(value.regularSeatRow) + Number(value.vipSeatRow) + Number(value.doubleSeatRow);

    if (totalSeatRows > Number(value.numberOfRows)) {
      toast.error('Tổng số hàng ghế vượt quá số hàng của phòng chiếu!');
      return;
    }

    const payload = {
      name: value.name.trim(),
      numberOfRows: Number(value.numberOfRows),
      numberOfColumns: Number(value.numberOfColumns),
      regularSeatRow: Number(value.regularSeatRow),
      vipSeatRow: Number(value.vipSeatRow),
      doubleSeatRow: Number(value.doubleSeatRow),
      cinemaTypeId: Number(value.cinemaTypeId),
      movieTheaterId: Number(value.movieTheaterId),
    };

    setLoading(true);

    try {
      if (isUpdate) {
        await update({ id: cinemaTheaters.cinemaTheaterId, data: payload });
        dispatch(openSnackbar({ message: 'Cập nhật phòng chiếu thành công.' }));
      } else {
        await create(payload);
        dispatch(openSnackbar({ message: 'Tạo mới phòng chiếu thành công.' }));
      }

      closeTopModal();
      await fetchCinemaTheaters({ page: 0, size: 5, status: null });
    } catch (error) {
      dispatch(
        openSnackbar({
          message:
            error?.response?.data?.message ||
            (isUpdate
              ? 'Cập nhật phòng chiếu thất bại!'
              : 'Tạo mới phòng chiếu thất bại!'),
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminModal
      title={isUpdate ? 'Cập nhật phòng chiếu' : 'Tạo phòng chiếu'}
      description="Điền đầy đủ thông tin cấu hình phòng chiếu để quản lý sơ đồ ghế và lập lịch chiếu."
      onClose={closeTopModal}
      size="lg"
      placement={placement}
      actions={
        <>
          <Button variant="outlined" onClick={() => reset(buildDefaultValues())}>
            Làm mới
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            color={isUpdate ? 'warning' : 'primary'}
          >
            {loading ? <CircularProgress size={20} color="inherit" className="mr-2" /> : null}
            {isUpdate ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(handleSubmitForm)}>
        <FormField
          name="name"
          label="Tên phòng chiếu"
          control={control}
          Component={TextInput}
          type="text"
          require={true}
          placeHolder="Tên phòng chiếu"
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            name="numberOfRows"
            label="Số hàng ghế"
            control={control}
            Component={TextInput}
            type="number"
            require={true}
            disabled={isPublished}
            placeHolder="Số hàng ghế"
            error={errors.numberOfRows}
          />
          <FormField
            name="numberOfColumns"
            label="Số cột ghế"
            control={control}
            Component={TextInput}
            type="number"
            require={true}
            disabled={isPublished}
            placeHolder="Số cột ghế"
            error={errors.numberOfColumns}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FormField
            name="regularSeatRow"
            label="Hàng ghế thường"
            control={control}
            Component={TextInput}
            type="number"
            require={true}
            disabled={isPublished}
            placeHolder="Số hàng ghế thường"
            error={errors.regularSeatRow}
          />
          <FormField
            name="vipSeatRow"
            label="Hàng ghế VIP"
            control={control}
            Component={TextInput}
            type="number"
            require={true}
            disabled={isPublished}
            placeHolder="Số hàng ghế VIP"
            error={errors.vipSeatRow}
          />
          <FormField
            name="doubleSeatRow"
            label="Hàng ghế đôi"
            control={control}
            Component={TextInput}
            type="number"
            require={true}
            disabled={isPublished}
            placeHolder="Số hàng ghế đôi"
            error={errors.doubleSeatRow}
          />
        </div>

        <FormField
          name="cinemaTypeId"
          label="Loại phòng chiếu"
          control={control}
          Component={CustomSelect}
          type="text"
          disabled={isPublished}
          placeHolder="Chọn loại phòng chiếu"
          options={cinemaTypes}
          error={errors.cinemaTypeId}
        />

        <FormField
          name="movieTheaterId"
          label="Rạp chiếu"
          control={control}
          Component={CustomSelect}
          type="text"
          disabled={isPublished}
          placeHolder="Chọn rạp chiếu"
          options={movieTheaters}
          error={errors.movieTheaterId}
        />
      </form>
    </AdminModal>
  );
};

export default ModalCreateCinemaTheater;
