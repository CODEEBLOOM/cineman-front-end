import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useModelContext } from '@context/ModalContext';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { Button, CircularProgress } from '@mui/material';
import { create, update } from '@apis/cinemaTheaterService';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { useEffect, useState } from 'react';
import CustomSelect from '@component/form_field/CustomSelect';
import { findAll } from '@apis/cinemaTypeService';
import { findAllMovieTheater } from '@apis/movieTheaterService';
import AdminModal from '@component/admin/common/AdminModal';

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

  useEffect(() => {
    findAll().then((res) => {
      const data = res.data.map((item) => ({
        label: `${item.code} - ${item.name}`,
        value: item.cinemaTypeId,
      }));
      setCinemaTypes(data);
    });
  }, []);

  useEffect(() => {
    findAllMovieTheater().then((res) => {
      const data = res.data.movieTheaters.map((item) => ({
        label: item.name,
        value: item.movieTheaterId,
      }));
      setMovieTheaters(data);
    });
  }, []);

  const formSchema = yup.object().shape({
    name: yup.string().required('Tên phòng chiếu không được để trống!'),
    numberOfRows: yup
      .number()
      .typeError('Vui lòng nhập số hàng ghế hợp lệ!')
      .required('Số lượng hàng ghế không được để trống!')
      .min(1, 'Số hàng ghế phải lớn hơn 0!'),
    numberOfColumns: yup
      .number()
      .typeError('Vui lòng nhập số cột ghế hợp lệ!')
      .required('Số lượng cột ghế không được để trống!')
      .min(1, 'Số cột ghế phải lớn hơn 0!'),
    regularSeatRow: yup
      .number()
      .typeError('Vui lòng nhập số hàng ghế thường hợp lệ!')
      .required('Số lượng hàng ghế thường không được để trống!')
      .min(1, 'Số hàng ghế thường phải lớn hơn 0!'),
    vipSeatRow: yup
      .number()
      .typeError('Vui lòng nhập số hàng ghế VIP hợp lệ!')
      .required('Số lượng hàng ghế VIP không được để trống!')
      .min(0, 'Số hàng ghế VIP phải lớn hơn hoặc bằng 0!'),
    doubleSeatRow: yup
      .number()
      .typeError('Vui lòng nhập số hàng ghế đôi hợp lệ!')
      .required('Số lượng hàng ghế đôi không được để trống!')
      .min(0, 'Số hàng ghế đôi phải lớn hơn hoặc bằng 0!'),
    cinemaTypeId: yup
      .number()
      .typeError('Vui lòng chọn loại phòng chiếu!')
      .required('Loại phòng chiếu không được để trống!'),
    movieTheaterId: yup
      .number()
      .typeError('Vui lòng chọn rạp chiếu!')
      .required('Rạp chiếu không được để trống!'),
  });

  const buildDefaultValues = () => ({
    name: cinemaTheaters?.name ?? '',
    numberOfRows: cinemaTheaters?.numberOfRows ?? 0,
    numberOfColumns: cinemaTheaters?.numberOfColumns ?? 0,
    regularSeatRow: cinemaTheaters?.regularSeatRow ?? 0,
    vipSeatRow: cinemaTheaters?.vipSeatRow ?? 0,
    doubleSeatRow: cinemaTheaters?.doubleSeatRow ?? 0,
    movieTheaterId: cinemaTheaters?.movieTheater?.movieTheaterId ?? '',
    cinemaTypeId: cinemaTheaters?.cinemaType?.cinemaTypeId ?? '',
  });

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
    if (isUpdate && movieTheaters.length > 0 && cinemaTypes.length > 0) {
      reset(buildDefaultValues());
    }
  }, [reset, isUpdate, cinemaTheaters, movieTheaters, cinemaTypes]);

  const handleSubmitForm = (data) => {
    setLoading(true);
    const total = data.regularSeatRow + data.vipSeatRow + data.doubleSeatRow;

    if (total > data.numberOfRows) {
      alert('Tổng số hàng ghế vượt quá số hàng của phòng chiếu!');
      setLoading(false);
      return;
    }

    if (isUpdate) {
      update({ id: cinemaTheaters.cinemaTheaterId, data })
        .then((res) => {
          if (res.status === 200) {
            dispatch(openSnackbar({ message: 'Cập nhật phòng chiếu thành công.' }));
            closeTopModal();
            fetchCinemaTheaters({ page: 0, size: 5, status: null });
          }
        })
        .catch((err) => {
          dispatch(
            openSnackbar({
              message: err?.response?.data?.message,
              type: 'error',
            })
          );
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    create(data)
      .then((res) => {
        if (res.status === 201) {
          dispatch(openSnackbar({ message: 'Tạo mới phòng chiếu thành công.' }));
          closeTopModal();
          fetchCinemaTheaters({ page: 0, size: 5, status: null });
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({ message: err?.response?.data?.message, type: 'error' })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    reset(buildDefaultValues());
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
          <Button variant="outlined" onClick={handleReset}>
            Làm mới
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
          <Button type="submit" form={formId} variant="contained" color={isUpdate ? 'warning' : 'primary'}>
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
            disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
            disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
            disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
            disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
            disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
          disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
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
          disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
          placeHolder="Chọn rạp chiếu"
          options={movieTheaters}
          error={errors.movieTheaterId}
        />
      </form>
    </AdminModal>
  );
};

export default ModalCreateCinemaTheater;
