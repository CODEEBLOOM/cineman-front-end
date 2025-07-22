import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useModelContext } from '@context/ModalContext';
import TextInput from '@component/form_field/TextInput';
import { IoClose } from 'react-icons/io5';
import FormField from '@component/FormField';
import { Button, CircularProgress } from '@mui/material';
import { create, update } from '@apis/cinemaTheaterService';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { useEffect, useState } from 'react';
import CustomSelect from '@component/form_field/CustomSelect';
import { findAll } from '@apis/cinemaTypeService';
import { findAllMovieTheater } from '@apis/movieTheaterService';

const ModalCreateCinemaTheater = ({
  fetchCinemaTheaters,
  isUpdate = false,
  cinemaTheaters,
}) => {
  const { closeTopModal } = useModelContext();
  const dispatch = useDispatch();
  const [cinemaTypes, setCinemaTypes] = useState([]);
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch cinema type and Movie theater
   */
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

  /*Xử lý create */
  const formSchema = yup.object().shape({
    name: yup.string().required('Tên mẫu sơ đồ không được để trống !'),
    numberOfRows: yup
      .number()
      .typeError('Vui điền số hàng ghế rạp chiếu hợp lệ')
      .required('Số lượng hàng ghế không được để trống !')
      .min(1, 'Số hàng ghế phải lớn hơn 0'),
    numberOfColumns: yup
      .number()
      .typeError('Vui điền số lượng cột ghế rạp chiếu hợp lệ')
      .required('Số lượng cột ghế không được để trống !')
      .min(1, 'Số cột ghế phải lớn hơn 0 !'),
    regularSeatRow: yup
      .number()
      .typeError('Vui điền số lượng hàng ghế rạp chiếu hợp lệ')
      .required('Số lượng hàng ghế thường không được để trống !')
      .min(1, 'Số hàng ghế thường phải lớn hơn 0'),
    vipSeatRow: yup
      .number()
      .typeError('Vui điền số lượng hàng ghế rạp chiếu hợp lệ')
      .required('Số lượng hàng ghế VIP không được để trống !')
      .min(0, 'Số hàng ghế VIP phải lớn hơn hoặc bằng 0'),
    doubleSeatRow: yup
      .number()
      .typeError('Vui điền số lượng hàng ghế rạp chiếu hợp lệ')
      .required('Số lượng hàng ghế đôi không được để trống !')
      .min(0, 'Số hàng ghế đôi phải lớn hơn hoặc bằng 0'),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      numberOfRows: 0,
      numberOfColumns: 0,
      regularSeatRow: 0,
      vipSeatRow: 0,
      doubleSeatRow: 0,
      description: '',
    },
  });

  useEffect(() => {
    if (isUpdate && movieTheaters.length > 0 && cinemaTypes.length > 0) {
      const data = {
        name: cinemaTheaters.name,
        numberOfRows: cinemaTheaters.numberOfRows,
        numberOfColumns: cinemaTheaters.numberOfColumns,
        regularSeatRow: cinemaTheaters.regularSeatRow,
        vipSeatRow: cinemaTheaters.vipSeatRow,
        doubleSeatRow: cinemaTheaters.doubleSeatRow,
        movieTheaterId: cinemaTheaters.movieTheater?.movieTheaterId,
        cinemaTypeId: cinemaTheaters.cinemaType?.cinemaTypeId,
      };
      reset(data);
    }
  }, [reset, isUpdate, cinemaTheaters, movieTheaters, cinemaTypes]);

  /**
   * Handles the creation of a new seat map.
   * Validates the total number of seat rows against the matrix size.
   * If valid, prepares and submits the seat map data for creation.
   *
   * @param {Object} data - The form data for creating a seat map.
   * @param {string} data.name - The name of the seat map.
   * @param {number} data.matrix - The size of the matrix (number of rows and columns).
   * @param {number} data.regularSeatRow - The number of regular seat rows.
   * @param {number} data.vipSeatRow - The number of VIP seat rows.
   * @param {number} data.doubleSeatRow - The number of double seat rows.
   * @param {string} data.description - The description of the seat map.
   */
  const handleSubmitForm = (data) => {
    setLoading(true);
    const total = data?.regularSeatRow + data?.vipSeatRow + data?.doubleSeatRow;
    if (total > data.numberOfRows) {
      alert('Tổng số hàng của bạn vượt quá kích thước ma trận !');
      setLoading(false);
      return;
    }
    if (isUpdate) {
      update({ id: cinemaTheaters.cinemaTheaterId, data })
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              openSnackbar({ message: 'Cập nhật phòng chiếu thành công ' })
            );
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
    /* Xử lý create */
    create(data)
      .then((res) => {
        if (res.status === 201) {
          dispatch(
            openSnackbar({ message: 'Tạo tạo mới phòng chiếu thành công ' })
          );
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
    reset();
  };

  return (
    <div className="relative max-h-screen w-[80vw] rounded-lg bg-white p-5 md:w-[50vw]">
      <span
        className={'absolute right-3 top-3 hover:cursor-pointer'}
        onClick={() => closeTopModal()}
      >
        <IoClose size={25} />
      </span>
      <div className="border-b-2 pb-2">
        <h2 className="text-[20px]">Thêm mới mẫu sơ đồ ghế</h2>
      </div>
      <div className="mt-2 max-h-[500px] overflow-y-auto">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <FormField
            name="name"
            label="Tên phòng chiếu"
            control={control}
            Component={TextInput}
            type="text"
            require={true}
            placeHolder="Tên phòng chiếu"
            error={errors['name']}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              name="numberOfRows"
              label="Số hàng ghế"
              control={control}
              Component={TextInput}
              type="number"
              require={true}
              disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
              placeHolder="Số hàng ghế"
              error={errors['numberOfRows']}
            />
            <FormField
              name="numberOfColumns"
              label="Số cột ghế"
              control={control}
              Component={TextInput}
              type="number"
              require={true}
              disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
              placeHolder="Sốc cột ghế"
              error={errors['numberOfColumns']}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FormField
              name="regularSeatRow"
              label="Hàng ghế thường"
              control={control}
              Component={TextInput}
              type="number"
              require={true}
              disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
              placeHolder="số ghế thường"
              error={errors['regularSeatRow']}
            />
            <FormField
              name="vipSeatRow"
              label="Hàng ghế vip"
              control={control}
              Component={TextInput}
              type="number"
              require={true}
              disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
              placeHolder="số ghế thường"
              error={errors['vipSeatRow']}
            />
            <FormField
              name="doubleSeatRow"
              label="Hàng ghế đôi"
              control={control}
              Component={TextInput}
              type="number"
              require={true}
              disabled={isUpdate && cinemaTheaters.status === 'PUBLISHED'}
              placeHolder="số ghế đôi"
              error={errors['doubleSeatRow']}
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
            error={errors['cinemaTypeId']}
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
            error={errors['movieTheaterId']}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outlined" onClick={handleReset}>
              Làm mới
            </Button>
            {isUpdate ? (
              <Button variant="contained" type={'submit'} color="warning">
                {loading && <CircularProgress size={25} className="mr-2" />}
                Cập nhật
              </Button>
            ) : (
              <Button variant="contained" type={'submit'}>
                {loading && <CircularProgress size={25} className="mr-2" />}
                Thêm mới
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default ModalCreateCinemaTheater;
