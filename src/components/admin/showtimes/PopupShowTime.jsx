import { findByMovieTheaterId } from '@apis/cinemaTheaterService';
import {
  extractMovieTheaterMappingList,
  findAllMovieTheaterMappingsByMovieTheaterId,
  normalizeMovieTheaterMapping,
} from '@apis/movieTheaterMappingService';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  movieTheaterId: yup.string().required('Vui lòng chọn rạp chiếu!'),
  cinemaTheaterId: yup.string().required('Vui lòng chọn phòng chiếu!'),
  showDate: yup.string().required('Ngày chiếu không được để trống!'),
  startTime: yup
    .string()
    .required('Giờ bắt đầu không được để trống!')
    .matches(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      'Giờ bắt đầu phải theo định dạng HH:mm'
    ),
  originPrice: yup
    .number()
    .typeError('Giá gốc không hợp lệ!')
    .required('Giá gốc không được để trống!')
    .min(0, 'Giá gốc phải lớn hơn hoặc bằng 0!'),
  status: yup
    .string()
    .oneOf(['INVALID', 'VALID', 'DELETED'], 'Trạng thái không hợp lệ!')
    .required('Trạng thái không được để trống!'),
  movieId: yup.string().required('Vui lòng chọn phim!'),
  movieVariationId: yup.string().required('Vui lòng chọn biến thể suất chiếu!'),
});

const showTimeStatusOptions = [
  { value: 'VALID', label: 'Đang áp dụng' },
  { value: 'INVALID', label: 'Tạm ẩn' },
  { value: 'DELETED', label: 'Đã xóa' },
];

const mapMovieTheaterOptions = (response) => {
  return extractCollection(response, ['movieTheaters']).map((item) => ({
    value: String(item?.movieTheaterId ?? item?.id ?? ''),
    label: item?.name ?? `Rạp ${item?.movieTheaterId ?? item?.id ?? ''}`,
  }));
};

const mapCinemaTheaterOptions = (response) => {
  return extractCollection(response, ['cinemaTheaters']).map((item) => ({
    value: String(item?.cinemaTheaterId ?? item?.id ?? ''),
    label: item?.name ?? `Phòng ${item?.cinemaTheaterId ?? item?.id ?? ''}`,
  }));
};

const mapMovieOptionsFromMappings = (response) => {
  return Array.from(
    new Map(
      extractMovieTheaterMappingList(response)
        .map(normalizeMovieTheaterMapping)
        .map((mapping) => {
          if (!mapping.movieId) {
            return null;
          }

          return [
            String(mapping.movieId),
            {
              value: String(mapping.movieId),
              label: mapping.movieTitle || `Phim ${mapping.movieId}`,
            },
          ];
        })
        .filter(Boolean)
    ).values()
  );
};

const mapMovieVariationOptions = (response) => {
  return extractMovieVariationList(response).map((item) => ({
    value: String(item?.id ?? ''),
    label: item?.name ?? `Biến thể ${item?.id ?? ''}`,
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
      normalizedItem?.showDate ||
      normalizeDateValue(defaults?.showDate) ||
      getTodayValue(),
    startTime:
      normalizedItem?.startTime ||
      normalizeTimeValue(defaults?.startTime) ||
      '',
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
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
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

  const fallbackMovieOption = useMemo(() => {
    const normalizedShowTime = loadedShowTimeDetail
      ? normalizeShowTimeItem(loadedShowTimeDetail)
      : null;

    if (!normalizedShowTime?.movieId) {
      return null;
    }

    return {
      value: String(normalizedShowTime.movieId),
      label:
        normalizedShowTime.movieTitle || `Phim ${normalizedShowTime.movieId}`,
    };
  }, [loadedShowTimeDetail]);

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
        const currentCinemaTheaterId = String(
          getValues('cinemaTheaterId') || ''
        );

        setCinemaTheaters(options);

        if (
          currentCinemaTheaterId &&
          !options.some((option) => option.value === currentCinemaTheaterId)
        ) {
          setValue('cinemaTheaterId', '');
        }
      } catch (error) {
        setCinemaTheaters([]);
        toast.error('Không thể tải danh sách phòng chiếu!');
      } finally {
        setIsLoadingCinemaTheaters(false);
      }
    },
    [getValues, setValue]
  );

  const loadMoviesByMovieTheater = useCallback(
    async (movieTheaterId) => {
      if (!movieTheaterId) {
        setMovies(fallbackMovieOption ? [fallbackMovieOption] : []);
        setValue('movieId', fallbackMovieOption?.value ?? '');
        return;
      }

      setIsLoadingMovies(true);

      try {
        const response =
          await findAllMovieTheaterMappingsByMovieTheaterId(movieTheaterId);
        const nextMovieOptions = mapMovieOptionsFromMappings(response);

        if (
          fallbackMovieOption &&
          !nextMovieOptions.some(
            (option) => option.value === fallbackMovieOption.value
          )
        ) {
          nextMovieOptions.unshift(fallbackMovieOption);
        }

        setMovies(nextMovieOptions);

        const currentMovieId = String(getValues('movieId') || '');
        const hasCurrentMovie = nextMovieOptions.some(
          (option) => option.value === currentMovieId
        );

        if (!hasCurrentMovie) {
          setValue('movieId', fallbackMovieOption?.value ?? '');
        }
      } catch (error) {
        setMovies(fallbackMovieOption ? [fallbackMovieOption] : []);
        toast.error('Không thể tải danh sách phim đã gán cho rạp này!');
      } finally {
        setIsLoadingMovies(false);
      }
    },
    [fallbackMovieOption, getValues, setValue]
  );

  useEffect(() => {
    loadCinemaTheaters(selectedMovieTheaterId);
  }, [loadCinemaTheaters, selectedMovieTheaterId]);

  useEffect(() => {
    loadMoviesByMovieTheater(selectedMovieTheaterId);
  }, [loadMoviesByMovieTheater, selectedMovieTheaterId]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingInitial(true);

      try {
        const [movieTheaterResponse, movieVariationResponse, showTimeResponse] =
          await Promise.all([
            findAllMovieTheater(),
            findAllMovieVariationsAdmin(),
            isEditing
              ? findAdminShowTimeById(showTimeId)
              : Promise.resolve(null),
          ]);

        setMovieTheaters(mapMovieTheaterOptions(movieTheaterResponse));
        setMovieVariations(mapMovieVariationOptions(movieVariationResponse));

        const showTimeDetail = unwrapData(showTimeResponse);

        setLoadedShowTimeDetail(showTimeDetail);
        reset(buildDefaultValues({ showTimeDetail, defaults }));
      } catch (error) {
        toast.error(
          isEditing
            ? 'Không thể tải chi tiết suất chiếu!'
            : 'Không thể tải dữ liệu tạo suất chiếu!'
        );
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadInitialData();
  }, [defaults, isEditing, reset, showTimeId]);

  const handleReset = useCallback(() => {
    reset(
      buildDefaultValues({ showTimeDetail: loadedShowTimeDetail, defaults })
    );
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
        toast.success('Cập nhật suất chiếu thành công!');
      } else {
        await addShowTime(payload);
        toast.success('Tạo suất chiếu thành công!');
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
        isEditing ? 'Cập nhật suất chiếu thất bại!' : 'Tạo suất chiếu thất bại!'
      );
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật suất chiếu' : 'Tạo suất chiếu'}
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
      {isLoadingInitial ? (
        <Loading content="Đang tải dữ liệu suất chiếu..." />
      ) : (
        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
        >
          <FormField
            name="movieTheaterId"
            require={true}
            label="Rạp chiếu"
            control={control}
            Component={CustomSelect}
            options={movieTheaters}
            placeHolder="Chọn rạp chiếu"
            error={errors.movieTheaterId}
          />
          <FormField
            name="cinemaTheaterId"
            require={true}
            label="Phòng chiếu"
            control={control}
            Component={CustomSelect}
            options={cinemaTheaters}
            placeHolder={
              isLoadingCinemaTheaters
                ? 'Đang tải phòng chiếu...'
                : 'Chọn phòng chiếu'
            }
            disabled={isLoadingCinemaTheaters || !selectedMovieTheaterId}
            error={errors.cinemaTheaterId}
          />
          <FormField
            name="showDate"
            require={true}
            label="Ngày chiếu"
            control={control}
            Component={TextInput}
            type="date"
            placeHolder="Chọn ngày chiếu"
            error={errors.showDate}
          />
          <FormField
            name="startTime"
            require={true}
            label="Giờ bắt đầu"
            control={control}
            Component={TextInput}
            type="time"
            placeHolder="Chọn giờ bắt đầu"
            error={errors.startTime}
          />
          <FormField
            name="movieId"
            require={true}
            label="Phim"
            control={control}
            Component={CustomSelect}
            options={movies}
            placeHolder={
              !selectedMovieTheaterId
                ? 'Chọn rạp trước'
                : isLoadingMovies
                  ? 'Đang tải phim đã gán...'
                  : movies.length === 0
                    ? 'Rạp này chưa có phim được gán'
                    : 'Chọn phim'
            }
            disabled={
              !selectedMovieTheaterId || isLoadingMovies || movies.length === 0
            }
            error={errors.movieId}
          />
          <FormField
            name="movieVariationId"
            require={true}
            label="Biến thể"
            control={control}
            Component={CustomSelect}
            options={movieVariations}
            placeHolder="Chọn biến thể"
            error={errors.movieVariationId}
          />
          <FormField
            name="originPrice"
            require={true}
            label="Giá gốc"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder="Nhập giá gốc"
            error={errors.originPrice}
          />
          <FormField
            name="status"
            require={true}
            label="Trạng thái"
            control={control}
            Component={CustomSelect}
            options={showTimeStatusOptions}
            placeHolder="Chọn trạng thái"
            error={errors.status}
          />
        </form>
      )}
    </AdminModal>
  );
};

export default PopupShowTime;
