import { findAllMovieTheater } from '@apis/movieTheaterService';
import {
  extractMovieTheaterMappingList,
  findAllMovieTheaterMappingsByMovieTheaterId,
  normalizeMovieTheaterMapping,
} from '@apis/movieTheaterMappingService';
import {
  extractMovieVariationList,
  findAllMovieVariationsAdmin,
} from '@apis/movieVariationService';
import { autoFillShowTimes } from '@apis/showTimeService';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import MulSelect from '@component/form_field/MulSelect';
import TextInput from '@component/form_field/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import MovieRounded from '@mui/icons-material/MovieRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import TheaterComedyRounded from '@mui/icons-material/TheaterComedyRounded';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { extractCollection, getTodayValue } from './showTimeUtils';

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const formSchema = yup.object({
  movieTheaterId: yup.string().required('Vui lòng chọn rạp chiếu!'),
  showDate: yup.string().required('Ngày chiếu không được để trống!'),
  movieIds: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Vui lòng chọn ít nhất 1 phim!')
    .required('Vui lòng chọn ít nhất 1 phim!'),
  movieVariationId: yup.string().required('Vui lòng chọn biến thể suất chiếu!'),
  originPrice: yup
    .number()
    .typeError('Giá gốc không hợp lệ!')
    .required('Giá gốc không được để trống!')
    .min(0, 'Giá gốc phải lớn hơn hoặc bằng 0!'),
  startTime: yup
    .string()
    .required('Giờ bắt đầu không được để trống!')
    .matches(timePattern, 'Giờ bắt đầu phải theo định dạng HH:mm'),
  endTime: yup
    .string()
    .required('Giờ kết thúc không được để trống!')
    .matches(timePattern, 'Giờ kết thúc phải theo định dạng HH:mm')
    .test(
      'is-after-start',
      'Giờ kết thúc phải lớn hơn giờ bắt đầu!',
      function validateEndTime(value) {
        const startTime = this.parent?.startTime;

        if (!startTime || !value) {
          return true;
        }

        return startTime < value;
      }
    ),
  bufferMinutes: yup
    .number()
    .typeError('Khoảng nghỉ không hợp lệ!')
    .required('Khoảng nghỉ không được để trống!')
    .integer('Khoảng nghỉ phải là số nguyên!')
    .min(0, 'Khoảng nghỉ phải lớn hơn hoặc bằng 0!'),
  status: yup
    .string()
    .oneOf(['INVALID', 'VALID'], 'Trạng thái không hợp lệ!')
    .required('Trạng thái không được để trống!'),
  special: yup
    .string()
    .oneOf(['true', 'false'], 'Loại suất chiếu không hợp lệ!')
    .required('Loại suất chiếu không được để trống!'),
});

const showTimeStatusOptions = [
  { value: 'INVALID', label: 'Tạm ẩn' },
  { value: 'VALID', label: 'Đang áp dụng' },
];

const showTimeSpecialOptions = [
  { value: 'false', label: 'Suất thường' },
  { value: 'true', label: 'Suất đặc biệt' },
];

const mapMovieTheaterOptions = (response) => {
  return extractCollection(response, ['movieTheaters']).map((item) => ({
    value: String(item?.movieTheaterId ?? item?.id ?? ''),
    label: item?.name ?? `Rạp ${item?.movieTheaterId ?? item?.id ?? ''}`,
  }));
};

const mapMovieVariationOptions = (response) => {
  return extractMovieVariationList(response).map((item) => ({
    value: String(item?.id ?? ''),
    label: item?.name ?? `Biến thể ${item?.id ?? ''}`,
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

const buildSuccessMessage = (response) => {
  const createdShowTimes = extractCollection(response, [
    'showTimes',
    'createdShowTimes',
    'items',
    'content',
  ]);

  if (createdShowTimes.length > 0) {
    return `Tạo tự động ${createdShowTimes.length} suất chiếu thành công!`;
  }

  return response?.data?.message || 'Tạo lịch chiếu tự động thành công!';
};

const defaultValues = {
  movieTheaterId: '',
  showDate: getTodayValue(),
  movieIds: [],
  movieVariationId: '',
  originPrice: 90000,
  startTime: '08:00',
  endTime: '22:00',
  bufferMinutes: 15,
  status: 'INVALID',
  special: 'false',
};

const ShowTimeAutoFillPanel = ({ onSuccess }) => {
  const { user } = useSelector((state) => state.user);
  const [movieTheaters, setMovieTheaters] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [movieVariations, setMovieVariations] = useState([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      movieTheaterId: String(user?.movieTheater?.movieTheaterId ?? ''),
    },
  });

  const selectedMovieTheaterId = useWatch({
    control,
    name: 'movieTheaterId',
  });

  const selectedMovieIds = useWatch({
    control,
    name: 'movieIds',
  });

  const selectedStartTime = useWatch({
    control,
    name: 'startTime',
  });

  const selectedEndTime = useWatch({
    control,
    name: 'endTime',
  });

  const selectedMovieTheaterLabel = useMemo(() => {
    return (
      movieTheaters.find((item) => item.value === selectedMovieTheaterId)?.label ??
      'Chưa chọn rạp'
    );
  }, [movieTheaters, selectedMovieTheaterId]);

  const selectedMovieLabels = useMemo(() => {
    const selectedValues = Array.isArray(selectedMovieIds) ? selectedMovieIds : [];

    return selectedValues
      .map(
        (movieId) =>
          movieOptions.find((option) => option.value === String(movieId))?.label ??
          null
      )
      .filter(Boolean);
  }, [movieOptions, selectedMovieIds]);

  const loadMovieOptions = useCallback(
    async (movieTheaterId) => {
      if (!movieTheaterId) {
        setMovieOptions([]);
        setValue('movieIds', []);
        return;
      }

      setIsLoadingMovies(true);

      try {
        const response =
          await findAllMovieTheaterMappingsByMovieTheaterId(movieTheaterId);
        const nextMovieOptions = mapMovieOptionsFromMappings(response);
        const currentMovieIds = (getValues('movieIds') || []).map(String);
        const allowedMovieIds = currentMovieIds.filter((movieId) =>
          nextMovieOptions.some((option) => option.value === movieId)
        );

        setMovieOptions(nextMovieOptions);
        setValue('movieIds', allowedMovieIds);
      } catch {
        setMovieOptions([]);
        setValue('movieIds', []);
        toast.error('Không thể tải danh sách phim đã gắn cho rạp này!');
      } finally {
        setIsLoadingMovies(false);
      }
    },
    [getValues, setValue]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingInitial(true);

      try {
        const [movieTheaterResponse, movieVariationResponse] = await Promise.all([
          findAllMovieTheater(),
          findAllMovieVariationsAdmin(),
        ]);

        const movieTheaterOptions = mapMovieTheaterOptions(movieTheaterResponse);
        const preferredMovieTheaterId = String(
          user?.movieTheater?.movieTheaterId ?? movieTheaterOptions[0]?.value ?? ''
        );

        setMovieTheaters(movieTheaterOptions);
        setMovieVariations(mapMovieVariationOptions(movieVariationResponse));
        setValue('movieTheaterId', getValues('movieTheaterId') || preferredMovieTheaterId);
      } catch {
        toast.error('Không thể tải dữ liệu tạo lịch chiếu tự động!');
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadInitialData();
  }, [getValues, setValue, user?.movieTheater?.movieTheaterId]);

  useEffect(() => {
    loadMovieOptions(selectedMovieTheaterId);
  }, [loadMovieOptions, selectedMovieTheaterId]);

  const handleSelectAllMovies = useCallback(() => {
    setValue(
      'movieIds',
      movieOptions.map((option) => option.value),
      { shouldValidate: true }
    );
  }, [movieOptions, setValue]);

  const handleClearMovies = useCallback(() => {
    setValue('movieIds', [], { shouldValidate: true });
  }, [setValue]);

  const handleReset = useCallback(() => {
    reset({
      ...defaultValues,
      movieTheaterId: String(user?.movieTheater?.movieTheaterId ?? ''),
    });
  }, [reset, user?.movieTheater?.movieTheaterId]);

  const onSubmit = async (values) => {
    const payload = {
      showDate: values.showDate,
      movieTheaterId: Number(values.movieTheaterId),
      movieIds: values.movieIds.map(Number),
      movieVariationId: Number(values.movieVariationId),
      originPrice: Number(values.originPrice),
      startTime: `${values.startTime}:00`,
      endTime: `${values.endTime}:00`,
      bufferMinutes: Number(values.bufferMinutes),
      status: values.status,
      special: values.special === 'true',
    };

    try {
      const response = await autoFillShowTimes(payload);

      toast.success(buildSuccessMessage(response));
      onSuccess?.({
        movieTheaterId: String(values.movieTheaterId),
        showDate: values.showDate,
        showTimeStatus: values.status,
        special: values.special,
      });
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Tạo lịch chiếu tự động thất bại!');
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Loading content="Đang tải dữ liệu tạo lịch chiếu tự động..." />
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Auto Fill
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Tạo lịch chiếu tự động theo rạp
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Chọn rạp, ngày, danh sách phim và thông số mặc định. Hệ thống sẽ tự lấp
              các khoảng trống trong ngày trên toàn bộ phòng đang publish của rạp.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Phim đã chọn
            </p>
            <p className="mt-1 text-2xl font-semibold">{selectedMovieLabels.length}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              name="showDate"
              require={true}
              label="Ngày chiếu"
              control={control}
              Component={TextInput}
              type="date"
              placeHolder="Chọn ngày chiếu"
              error={errors.showDate}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Danh sách phim cần rải lịch</p>
                <p className="mt-1 text-sm text-slate-500">
                  Chỉ những phim còn hiệu lực và có mapping active với rạp mới được backend
                  xếp lịch.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  disabled={movieOptions.length === 0 || isLoadingMovies}
                  onClick={handleSelectAllMovies}
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  size="small"
                  disabled={selectedMovieLabels.length === 0}
                  onClick={handleClearMovies}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <FormField
                name="movieIds"
                require={true}
                label="Phim"
                control={control}
                Component={MulSelect}
                options={movieOptions}
                placeHolder={
                  !selectedMovieTheaterId
                    ? 'Chọn rạp trước'
                    : isLoadingMovies
                      ? 'Đang tải phim đã gắn cho rạp...'
                      : movieOptions.length === 0
                        ? 'Rạp này chưa có phim được gắn'
                        : 'Chọn một hoặc nhiều phim'
                }
                disabled={!selectedMovieTheaterId || isLoadingMovies || movieOptions.length === 0}
                error={errors.movieIds}
              />
            </div>

            {selectedMovieLabels.length > 0 ? (
              <div className="rounded-2xl bg-white p-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Đã chọn:</span>{' '}
                {selectedMovieLabels.join(', ')}
              </div>
            ) : movieOptions.length === 0 && selectedMovieTheaterId ? (
              <EmptyList content="Rạp này hiện chưa có phim khả dụng để auto-fill" />
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
              name="bufferMinutes"
              require={true}
              label="Khoảng nghỉ (phút)"
              control={control}
              Component={TextInput}
              type="number"
              placeHolder="Nhập số phút nghỉ"
              error={errors.bufferMinutes}
            />
            <FormField
              name="startTime"
              require={true}
              label="Bắt đầu từ"
              control={control}
              Component={TextInput}
              type="time"
              placeHolder="08:00"
              error={errors.startTime}
            />
            <FormField
              name="endTime"
              require={true}
              label="Kết thúc lúc"
              control={control}
              Component={TextInput}
              type="time"
              placeHolder="22:00"
              error={errors.endTime}
            />
            <FormField
              name="status"
              require={true}
              label="Trạng thái tạo mới"
              control={control}
              Component={CustomSelect}
              options={showTimeStatusOptions}
              placeHolder="Chọn trạng thái"
              error={errors.status}
            />
            <FormField
              name="special"
              require={true}
              label="Loại suất chiếu"
              control={control}
              Component={CustomSelect}
              options={showTimeSpecialOptions}
              placeHolder="Chọn loại suất chiếu"
              error={errors.special}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <Button type="button" variant="outlined" color="inherit" onClick={handleReset}>
              Làm mới
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AutoAwesomeRounded />}
              disabled={isSubmitting}
            >
              Tạo lịch tự động
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Tóm tắt
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <TheaterComedyRounded fontSize="small" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rạp</p>
                  <p className="font-semibold text-slate-900">{selectedMovieTheaterLabel}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <MovieRounded fontSize="small" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phim</p>
                  <p className="font-semibold text-slate-900">
                    {selectedMovieLabels.length > 0
                      ? `${selectedMovieLabels.length} phim`
                      : 'Chưa chọn phim'}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <ScheduleRounded fontSize="small" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Khung giờ
                  </p>
                  <p className="font-semibold text-slate-900">
                    {selectedStartTime || '--:--'} - {selectedEndTime || '--:--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quy tắc API
          </p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            <p>Hệ thống tự lấy toàn bộ phòng đang publish của rạp đã chọn.</p>
            <p>Backend bỏ qua phim hết hạn, qua hạn NC/CNS hoặc không còn mapping active.</p>
            <p>Auto-fill luôn né các suất chiếu đã tồn tại trong ngày trước khi xếp lịch mới.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTimeAutoFillPanel;
