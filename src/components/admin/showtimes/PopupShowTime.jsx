import { findByMovieTheaterId } from '@apis/cinemaTheaterService';
import { findAllByFilterAdmin } from '@apis/movieService';
import {
  extractMovieVariationList,
  findAllMovieVariationsAdmin,
} from '@apis/movieVariationService';
import { findAllMovieTheater } from '@apis/movieTheaterService';
import {
  addShowTime,
  findAdminShowTimeById,
  updateShowTime,
} from '@apis/showTimeService';
import AdminModal from '@component/admin/common/AdminModal';
import Loading from '@component/Loading';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
  extractCollection,
  getTodayValue,
  normalizeDateValue,
  normalizeShowTimeItem,
  normalizeTimeValue,
  unwrapData,
} from './showTimeUtils';

const formSchema = yup.object({
  movieTheaterId: yup.string().required('Vui long chon rap chieu!'),
  cinemaTheaterId: yup.string().required('Vui long chon phong chieu!'),
  showDate: yup.string().required('Ngay chieu khong duoc de trong!'),
  startTime: yup
    .string()
    .required('Gio bat dau khong duoc de trong!')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/, 'Gio bat dau phai theo dinh dang HH:mm'),
  originPrice: yup
    .number()
    .typeError('Gia goc khong hop le!')
    .required('Gia goc khong duoc de trong!')
    .min(0, 'Gia goc phai lon hon hoac bang 0!'),
  status: yup
    .string()
    .oneOf(['INVALID', 'VALID', 'DELETED'], 'Trang thai khong hop le!')
    .required('Trang thai khong duoc de trong!'),
  movieId: yup.string().required('Vui long chon phim!'),
  movieVariationId: yup.string().required('Vui long chon bien the suat chieu!'),
});

const showTimeStatusOptions = [
  { value: 'VALID', label: 'Dang ap dung' },
  { value: 'INVALID', label: 'Tam an' },
  { value: 'DELETED', label: 'Da xoa' },
];

const mapMovieTheaterOptions = (response) => {
  return extractCollection(response, ['movieTheaters']).map((item) => ({
    value: String(item?.movieTheaterId ?? item?.id ?? ''),
    label: item?.name ?? `Rap ${item?.movieTheaterId ?? item?.id ?? ''}`,
  }));
};

const mapCinemaTheaterOptions = (response) => {
  return extractCollection(response, ['cinemaTheaters']).map((item) => ({
    value: String(item?.cinemaTheaterId ?? item?.id ?? ''),
    label: item?.name ?? `Phong ${item?.cinemaTheaterId ?? item?.id ?? ''}`,
  }));
};

const mapMovieOptions = (response) => {
  return extractCollection(response, ['movies']).map((item) => ({
    value: String(item?.movieId ?? item?.id ?? ''),
    label: item?.title ?? `Phim ${item?.movieId ?? item?.id ?? ''}`,
  }));
};

const mapMovieVariationOptions = (response) => {
  return extractMovieVariationList(response).map((item) => ({
    value: String(item?.id ?? ''),
    label: item?.name ?? `Bien the ${item?.id ?? ''}`,
  }));
};

const buildDefaultValues = ({ showTimeDetail, defaults }) => {
  const normalizedItem = showTimeDetail
    ? normalizeShowTimeItem(showTimeDetail)
    : null;
  const rawShowTime = showTimeDetail?.showTime ?? showTimeDetail ?? {};

  return {
    movieTheaterId: String(
      normalizedItem?.movieTheaterId ?? defaults?.movieTheaterId ?? ''
    ),
    cinemaTheaterId: String(
      normalizedItem?.cinemaTheaterId ?? defaults?.cinemaTheaterId ?? ''
    ),
    showDate:
      normalizedItem?.showDate || normalizeDateValue(defaults?.showDate) || getTodayValue(),
    startTime: normalizedItem?.startTime || normalizeTimeValue(defaults?.startTime) || '',
    originPrice: rawShowTime?.originPrice ?? defaults?.originPrice ?? 0,
    status: rawShowTime?.status ?? defaults?.status ?? 'VALID',
    movieId: String(normalizedItem?.movieId ?? defaults?.movieId ?? ''),
    movieVariationId: String(
      normalizedItem?.movieVariationId ?? defaults?.movieVariationId ?? ''
    ),
  };
};

const PopupShowTime = ({
  showTimeId,
  defaults,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [cinemaTheaters, setCinemaTheaters] = useState([]);
  const [movies, setMovies] = useState([]);
  const [movieVariations, setMovieVariations] = useState([]);
  const [loadedShowTimeDetail, setLoadedShowTimeDetail] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingCinemaTheaters, setIsLoadingCinemaTheaters] = useState(false);
  const isEditing = Boolean(showTimeId);
  const formId = 'showtime-form';

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: buildDefaultValues({ showTimeDetail: null, defaults }),
  });

  const selectedMovieTheaterId = useWatch({
    control,
    name: 'movieTheaterId',
  });

  const loadCinemaTheaters = useCallback(
    async (movieTheaterId) => {
      if (!movieTheaterId) {
        setCinemaTheaters([]);
        setValue('cinemaTheaterId', '');
        return;
      }

      setIsLoadingCinemaTheaters(true);

      try {
        const response = await findByMovieTheaterId(movieTheaterId);
        const options = mapCinemaTheaterOptions(response);
        const currentCinemaTheaterId = String(getValues('cinemaTheaterId') || '');

        setCinemaTheaters(options);

        if (
          currentCinemaTheaterId &&
          !options.some((option) => option.value === currentCinemaTheaterId)
        ) {
          setValue('cinemaTheaterId', '');
        }
      } catch (error) {
        setCinemaTheaters([]);
        toast.error('Khong the tai danh sach phong chieu!');
      } finally {
        setIsLoadingCinemaTheaters(false);
      }
    },
    [getValues, setValue]
  );

  useEffect(() => {
    loadCinemaTheaters(selectedMovieTheaterId);
  }, [loadCinemaTheaters, selectedMovieTheaterId]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingInitial(true);

      try {
        const [movieTheaterResponse, movieResponse, movieVariationResponse, showTimeResponse] =
          await Promise.all([
            findAllMovieTheater(),
            findAllByFilterAdmin({ page: 0, size: 1000, status: 'ALL' }),
            findAllMovieVariationsAdmin(),
            isEditing ? findAdminShowTimeById(showTimeId) : Promise.resolve(null),
          ]);

        setMovieTheaters(mapMovieTheaterOptions(movieTheaterResponse));
        setMovies(mapMovieOptions(movieResponse));
        setMovieVariations(mapMovieVariationOptions(movieVariationResponse));

        const showTimeDetail = unwrapData(showTimeResponse);

        setLoadedShowTimeDetail(showTimeDetail);
        reset(buildDefaultValues({ showTimeDetail, defaults }));
      } catch (error) {
        toast.error(
          isEditing
            ? 'Khong the tai chi tiet suat chieu!'
            : 'Khong the tai du lieu tao suat chieu!'
        );
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadInitialData();
  }, [defaults, isEditing, reset, showTimeId]);

  const handleReset = useCallback(() => {
    reset(buildDefaultValues({ showTimeDetail: loadedShowTimeDetail, defaults }));
  }, [defaults, loadedShowTimeDetail, reset]);

  const onSubmit = async (values) => {
    const payload = {
      cinemaTheaterId: Number(values.cinemaTheaterId),
      movieId: Number(values.movieId),
      movieVariationId: Number(values.movieVariationId),
      showDate: values.showDate,
      startTime: `${values.startTime}:00`,
      originPrice: Number(values.originPrice),
      status: values.status,
    };

    try {
      if (isEditing) {
        await updateShowTime(showTimeId, payload);
        toast.success('Cap nhat suat chieu thanh cong!');
      } else {
        await addShowTime(payload);
        toast.success('Tao suat chieu thanh cong!');
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
          ? 'Cap nhat suat chieu that bai!'
          : 'Tao suat chieu that bai!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cap nhat suat chieu' : 'Tao suat chieu'}
      description="Form nay dung cho luong admin scheduler: chon rap, phong, phim, bien the va khung gio."
      onClose={closeTopModal}
      size="lg"
      placement={placement}
      actions={
        <>
          <Button type="button" variant="outlined" color="info" onClick={handleReset}>
            Lam moi
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Huy bo
          </Button>
          <Button type="submit" form={formId} variant="contained" disabled={isSubmitting}>
            {isEditing ? 'Cap nhat' : 'Tao moi'}
          </Button>
        </>
      }
    >
      {isLoadingInitial ? (
        <Loading content="Dang tai du lieu suat chieu..." />
      ) : (
        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <FormField
            name="movieTheaterId"
            require={true}
            label="Rap chieu"
            control={control}
            Component={CustomSelect}
            options={movieTheaters}
            placeHolder="Chon rap chieu"
            error={errors.movieTheaterId}
          />
          <FormField
            name="cinemaTheaterId"
            require={true}
            label="Phong chieu"
            control={control}
            Component={CustomSelect}
            options={cinemaTheaters}
            placeHolder={
              isLoadingCinemaTheaters ? 'Dang tai phong chieu...' : 'Chon phong chieu'
            }
            disabled={isLoadingCinemaTheaters || !selectedMovieTheaterId}
            error={errors.cinemaTheaterId}
          />
          <FormField
            name="showDate"
            require={true}
            label="Ngay chieu"
            control={control}
            Component={TextInput}
            type="date"
            placeHolder="Chon ngay chieu"
            error={errors.showDate}
          />
          <FormField
            name="startTime"
            require={true}
            label="Gio bat dau"
            control={control}
            Component={TextInput}
            type="time"
            placeHolder="Chon gio bat dau"
            error={errors.startTime}
          />
          <FormField
            name="movieId"
            require={true}
            label="Phim"
            control={control}
            Component={CustomSelect}
            options={movies}
            placeHolder="Chon phim"
            error={errors.movieId}
          />
          <FormField
            name="movieVariationId"
            require={true}
            label="Bien the"
            control={control}
            Component={CustomSelect}
            options={movieVariations}
            placeHolder="Chon bien the"
            error={errors.movieVariationId}
          />
          <FormField
            name="originPrice"
            require={true}
            label="Gia goc"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder="Nhap gia goc"
            error={errors.originPrice}
          />
          <FormField
            name="status"
            require={true}
            label="Trang thai"
            control={control}
            Component={CustomSelect}
            options={showTimeStatusOptions}
            placeHolder="Chon trang thai"
            error={errors.status}
          />
        </form>
      )}
    </AdminModal>
  );
};

export default PopupShowTime;
