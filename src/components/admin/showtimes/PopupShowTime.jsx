import { findAllMovies } from '@apis/movieService';
import { findAllMovieTheater } from '@apis/movieTheaterService';
import { addShowTime } from '@apis/showTimeService';
import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const PopupShowTime = ({ showTime, movieId, cinemaTheaterId }) => {
  console.log(showTime);
  const { closeTopModal } = useModelContext();
  const [cinemaTheaters, setCinemaTheaters] = useState();
  const [movies, setMovies] = useState();

  const formSchema = yup.object({
    showDate: yup
      .date()
      .typeError('Ngày chiếu không được để trống !')
      .required('Ngày chiếu không được để trống !')
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        'Ngày chiếu phải lớn hơn hoặc bằng ngày hiện tại !'
      ),

    startTime: yup
      .string()
      .required('Giờ bắt đầu không được để trống !')
      .matches(
        /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
        'Giờ bắt đầu phải có định dạng HH:mm:ss'
      ),

    originPrice: yup
      .number()
      .typeError('Giá gốc không được để trống !')
      .required('Giá gốc không được để trống !')
      .min(0, 'Giá gốc phải lớn hơn hoặc bằng 0 !'),

    status: yup
      .string()
      .oneOf(['INVALID', 'VALID', 'CANCEL'], 'Trạng thái không hợp lệ')
      .default('INVALID'),

    movieId: yup
      .number()
      .typeError('Mã phim không được để trống !')
      .required('Mã phim không được để trống !')
      .min(1, 'Mã phim phải lớn hơn 0 !'),

    cinemaTheaterId: yup
      .number()
      .typeError('Mã rạp chiếu không được để trống !')
      .required('Mã rạp chiếu không được để trống !')
      .min(1, 'Mã rạp chiếu phải lớn hơn 0 !'),
  });

  const showTimeStatus = [
    { value: 'INVALID', label: 'Chưa áp dụng' },
    { value: 'VALID', label: 'Áp dụng' },
  ];

  const variations = [
    { value: '1', label: 'Lồng tiếng' },
    { value: '2', label: 'Phụ đề' },
    { value: '3', label: 'Thuyết minh' },
  ];

  const {
    control,
    handleSubmit: handleSubmitForm,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      showDate: new DateFormatter().format('YYYY-MM-DD'),
      startTime: new DateFormatter().format('HH:mm:ss'),
      originPrice: 0,
      status: 'VALID',
      movieId: movieId,
      cinemaTheaterId: 0,
    },
  });

  if (showTime) {
    setValue(
      'showDate',
      new DateFormatter(showTime.showDate).format('YYYY-MM-DD')
    );
    setValue(
      'startTime',
      new DateFormatter(showTime.startTime).format('HH:mm:ss')
    );
    setValue('originPrice', showTime.originPrice);
    setValue('status', showTime.status);
    setValue('movieId', movieId);
    setValue('cinemaTheaterId', cinemaTheaterId);
  }

  useEffect(() => {
    if (showTime) {
      resetForm(
        {
          showDate: new DateFormatter(showTime.showDate).format('YYYY-MM-DD'),
          startTime: new DateFormatter(showTime.startTime).format('HH:mm:ss'),
          originPrice: showTime.originPrice,
          status: showTime.status ?? 'VALID',
          movieId,
          cinemaTheaterId,
          movieVariationId: showTime.movieVariationId,
        },
        { keepDirty: false, keepTouched: false }
      );
    } else {
      resetForm({
        showDate: new DateFormatter(showTime.showDate).format('YYYY-MM-DD'),
        startTime: new DateFormatter(showTime.startTime).format('HH:mm:ss'),
        originPrice: 0,
        status: 'VALID',
        movieId: null,
        cinemaTheaterId: null,
        movieVariationId: 1,
      });
    }
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    addShowTime(data)
      .then((res) => {
        console.log(res.data);
        toast.success('Thêm lịch chiếu thành công !');
        closeTopModal();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 400 || error.response.status === 404) {
          return toast.error(error.response.data.message);
        }
        toast.error('Thêm lịch chiếu thất bại !');
      });
  };

  useEffect(() => {
    findAllMovieTheater()
      .then((res) => {
        console.log(res.data);
        const cinemaTheaters = res.data.movieTheaters.map((movieTheater) => ({
          label: movieTheater.name,
          value: movieTheater.movieTheaterId,
        }));
        setCinemaTheaters(cinemaTheaters);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    findAllMovies({ page: 0, size: 1000, status: 'ALL' })
      .then((res) => {
        console.log(res.data);
        const movies = res.data.movies.map((movie) => ({
          label: movie.title,
          value: movie.movieId,
        }));
        console.log(movies);
        setMovies(movies);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="max-h-[80vh] w-[60vw] rounded-md bg-white px-3 py-5">
      <form
        onSubmit={handleSubmitForm(onSubmit)}
        className="grid grid-cols-2 gap-2"
      >
        <FormField
          name="showDate"
          require={true}
          label="Ngày chiếu"
          control={control}
          Component={TextInput}
          type="date"
          placeHolder="Chọn ngày chiếu"
          error={errors['showDate']}
        />
        <FormField
          name="startTime"
          require={true}
          label="Thời gian bắt đầu chiếu"
          control={control}
          Component={TextInput}
          type="time"
          placeHolder="Chọn thời gian bắt đầu chiếu"
          error={errors['startTime']}
        />
        <FormField
          name="originPrice"
          require={true}
          label="Giá cho suất chiếu"
          control={control}
          Component={TextInput}
          type="number"
          placeHolder={'Nhập giá cho suất chiếu'}
          error={errors['originPrice']}
        />
        <FormField
          name="status"
          require={true}
          label="Trạng thái"
          control={control}
          Component={CustomSelect}
          options={showTimeStatus}
          placeHolder={'Chọn trạng thái'}
          error={errors['status']}
        />
        <FormField
          name="movieId"
          require={true}
          label="Phim chiếu"
          control={control}
          Component={CustomSelect}
          type="text"
          options={movies}
          placeHolder="Chọn phim"
          error={errors['movieId']}
        />
        <FormField
          name="cinemaTheaterId"
          label="Phòng chiếu"
          control={control}
          Component={CustomSelect}
          require={true}
          options={cinemaTheaters}
          type="text"
          placeHolder="Chọn phòng chiếu"
          error={errors['cinemaTheaterId']}
        />
        <FormField
          name="movieVariationId"
          label="Biến thể"
          control={control}
          Component={CustomSelect}
          require={true}
          options={variations}
          type="text"
          placeHolder="Chọn biến thể"
          error={errors['movieVariationId']}
        />
        <div className="col-span-2 flex justify-end gap-2">
          <Button type="submit" variant="contained" color="primary">
            Thêm
          </Button>
          <Button onClick={() => resetForm()} variant="outlined" color="info">
            Làm mới
          </Button>
          <Button
            variant="outlined"
            color="warning"
            className="ml-2"
            onClick={() => closeTopModal()}
          >
            Hủy bỏ
          </Button>
        </div>
      </form>
    </div>
  );
};
export default PopupShowTime;
