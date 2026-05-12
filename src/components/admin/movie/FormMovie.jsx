import { extractGenreList, getAllGenre } from '@apis/genreService';
import {
  createMovieTheaterMapping,
  deleteMovieTheaterMapping,
  extractMovieTheaterMappingList,
  findAllMovieTheaterMappingsByMovieId,
  normalizeMovieTheaterMapping,
} from '@apis/movieTheaterMappingService';
import {
  extractMovieTheaterList,
  findAllMovieTheater,
} from '@apis/movieTheaterService';
import {
  addMovie,
  findAllByFilterAdmin,
  updateMovie,
} from '@apis/movieService';
import {
  extractParticipantList,
  findAll as findAllParticipants,
} from '@apis/participantService';
import { uploadPhoto } from '@apis/uploadFileService';
import FormField from '@component/FormField';
import ImageComponent from '@component/ImageComponent';
import CustomSelect from '@component/form_field/CustomSelect';
import MulSelect from '@component/form_field/MulSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import DateFormatter from '@utils/DateFormatter';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const statusOptions = [
  { label: 'Sắp chiếu', value: 'SC' },
  { label: 'Đang chiếu', value: 'DC' },
  { label: 'Ngưng chiếu', value: 'NC' },
  { label: 'Đặc biệt', value: 'DB' },
  { label: 'Đã hủy', value: 'CNS' },
];

const limitAgeOptions = [
  { label: 'Từ 13', value: 13 },
  { label: 'Từ 16', value: 16 },
  { label: 'Từ 18', value: 18 },
];

const createDefaultFormValues = () => ({
  title: '',
  synopsis: '',
  detailDescription: '',
  releaseDate: new DateFormatter().format('YYYY-MM-DD'),
  endDate: new DateFormatter().format('YYYY-MM-DD'),
  language: 'Vietnamese',
  duration: 60,
  age: 13,
  status: 'SC',
  trailerLink: '',
  posterImage: '',
  bannerImage: '',
  genres: [],
  directors: [],
  casts: [],
  movieTheaterIds: [],
});

const parseNumberArray = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);

const numberArraySchema = yup
  .array()
  .of(
    yup
      .number()
      .transform((parsedValue, originalValue) =>
        originalValue === '' || originalValue == null
          ? undefined
          : Number(originalValue)
      )
      .typeError('Giá trị lựa chọn không hợp lệ!')
  )
  .default([]);

const formSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Tiêu đề phim không được để trống!')
    .max(100, 'Tiêu đề phim phải nhỏ hơn hoặc bằng 100 ký tự!'),
  synopsis: yup
    .string()
    .trim()
    .required('Tóm tắt phim không được để trống!')
    .max(250, 'Tóm tắt phim phải nhỏ hơn hoặc bằng 250 ký tự!'),
  detailDescription: yup
    .string()
    .trim()
    .required('Mô tả chi tiết phim không được để trống!'),
  releaseDate: yup
    .date()
    .typeError('Ngày khởi chiếu phải là ngày hợp lệ!')
    .required('Ngày khởi chiếu không được để trống!'),
  endDate: yup
    .date()
    .typeError('Ngày kết thúc phải là ngày hợp lệ!')
    .required('Ngày kết thúc không được để trống!')
    .min(yup.ref('releaseDate'), 'Ngày kết thúc phải sau ngày khởi chiếu!'),
  language: yup.string().trim().required('Ngôn ngữ phim không được để trống!'),
  duration: yup
    .number()
    .typeError('Thời lượng phim phải là số!')
    .required('Thời lượng phim không được để trống!')
    .min(1, 'Thời lượng phim phải lớn hơn 0 phút!'),
  age: yup
    .number()
    .typeError('Độ tuổi phải là số!')
    .required('Giới hạn độ tuổi không được để trống!')
    .min(0, 'Độ tuổi phải từ 0 đến 100!')
    .max(100, 'Độ tuổi phải từ 0 đến 100!'),
  status: yup
    .string()
    .required('Trạng thái phim không được để trống!')
    .oneOf(['SC', 'DC', 'NC', 'DB', 'CNS'], 'Trạng thái phim không hợp lệ!'),
  genres: numberArraySchema
    .min(1, 'Phim phải có ít nhất một thể loại!')
    .required('Thể loại phim không được để trống!'),
  directors: numberArraySchema,
  casts: numberArraySchema,
  movieTheaterIds: numberArraySchema,
  trailerLink: yup
    .string()
    .trim()
    .required('Link trailer không được để trống!')
    .url('Định dạng link trailer không hợp lệ!'),
  posterImage: yup.string().trim().required('Ảnh poster không được để trống!'),
  bannerImage: yup.string().trim().required('Ảnh banner không được để trống!'),
});

const resolveStorageUrl = (value) => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const storageBase = (import.meta.env.VITE_STORAGES ?? '').replace(/\/$/, '');
  const normalizedValue = String(value).replace(/^\//, '');
  return storageBase ? `${storageBase}/${normalizedValue}` : normalizedValue;
};

const resolveParticipantId = (participant) =>
  participant?.participantId ?? participant?.id ?? null;

const mapParticipantsToOptions = (participants) =>
  participants
    .map((participant) => {
      const participantId = resolveParticipantId(participant);

      if (!participantId) {
        return null;
      }

      return {
        value: participantId,
        label:
          participant?.nickname ||
          participant?.birthName ||
          participant?.fullName ||
          `Participant #${participantId}`,
      };
    })
    .filter(Boolean);

const resolveMovieId = (movie) => movie?.movieId ?? movie?.id ?? null;

const extractMovieList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.movies)) {
    return response.movies;
  }

  if (Array.isArray(response?.data?.movies)) {
    return response.data.movies;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  return [];
};

const mapMovieTheaterOptions = (response) =>
  extractMovieTheaterList(response)
    .map((movieTheater) => {
      const movieTheaterId =
        movieTheater?.movieTheaterId ?? movieTheater?.id ?? null;

      if (!movieTheaterId) {
        return null;
      }

      return {
        value: Number(movieTheaterId),
        label: movieTheater?.name ?? `Rạp #${movieTheaterId}`,
      };
    })
    .filter(Boolean);

const resolveMovieIdFromResponse = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.movie,
    response?.data?.movie,
    response?.result,
    response?.data?.result,
  ];

  for (const candidate of candidates) {
    const movieId = resolveMovieId(candidate);

    if (movieId) {
      return Number(movieId);
    }
  }

  return null;
};

const resolveCreatedMovieId = async (response, payload) => {
  const movieIdFromResponse = resolveMovieIdFromResponse(response);

  if (movieIdFromResponse) {
    return movieIdFromResponse;
  }

  const movieResponse = await findAllByFilterAdmin({
    page: 0,
    size: 1000,
    status: 'ALL',
  });

  const matchedMovie = extractMovieList(movieResponse)
    .filter((movie) => {
      return (
        movie?.title?.trim() === payload.title &&
        (movie?.releaseDate
          ? new DateFormatter(movie.releaseDate).format('YYYY-MM-DD')
          : '') === payload.releaseDate
      );
    })
    .sort((firstMovie, secondMovie) => {
      return (
        Number(resolveMovieId(secondMovie) ?? 0) -
        Number(resolveMovieId(firstMovie) ?? 0)
      );
    })[0];

  return resolveMovieId(matchedMovie);
};

const mapStatus = (statusText = '') => {
  if (['SC', 'DC', 'NC', 'DB', 'CNS'].includes(statusText)) {
    return statusText;
  }

  switch (statusText) {
    case 'Sắp chiếu':
      return 'SC';
    case 'Đang chiếu':
      return 'DC';
    case 'Ngưng chiếu':
      return 'NC';
    case 'Đặc biệt':
      return 'DB';
    case 'Đã hủy':
      return 'CNS';
    default:
      return '';
  }
};

const resolveActionError = (error, fallbackMessage) => {
  const backendMessage = error?.response?.data?.message;
  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage.trim();
  }

  if (!error?.response) {
    return 'Không thể kết nối tới máy chủ. Vui lòng thử lại.';
  }

  return fallbackMessage;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
};

const previewVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.16 } },
};

const MotionDiv = motion.div;
const MotionSection = motion.section;

const FormMovie = ({ editingMovie, setEditingMovie }) => {
  const [posterImage, setPosterImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [genreOptions, setGenreOptions] = useState([]);
  const [participantOptions, setParticipantOptions] = useState([]);
  const [movieTheaterOptions, setMovieTheaterOptions] = useState([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [isLoadingMovieTheaters, setIsLoadingMovieTheaters] = useState(false);
  const [isLoadingMovieTheaterMappings, setIsLoadingMovieTheaterMappings] =
    useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const posterInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const {
    control,
    handleSubmit: handleSubmitForm,
    reset: resetForm,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: createDefaultFormValues(),
  });

  const isScheduleLocked = ['DC', 'DB'].includes(
    mapStatus(editingMovie?.status)
  );
  const isBootstrapping =
    isLoadingGenres ||
    isLoadingParticipants ||
    isLoadingMovieTheaters ||
    isLoadingMovieTheaterMappings;
  const isBusy =
    isSubmitting || isUploadingPoster || isUploadingBanner || isBootstrapping;

  const clearFileInputs = useCallback(() => {
    if (posterInputRef.current) {
      posterInputRef.current.value = '';
    }

    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  }, []);

  const applyDefaultState = useCallback(() => {
    resetForm(createDefaultFormValues());
    setPosterImage('');
    setBannerImage('');
    clearFileInputs();
  }, [clearFileInputs, resetForm]);

  const applyEditingState = useCallback(
    (movie) => {
      resetForm({
        title: movie?.title ?? '',
        synopsis: movie?.synopsis ?? '',
        detailDescription: movie?.detailDescription ?? '',
        releaseDate: movie?.releaseDate
          ? new DateFormatter(movie.releaseDate).format('YYYY-MM-DD')
          : '',
        endDate: movie?.endDate
          ? new DateFormatter(movie.endDate).format('YYYY-MM-DD')
          : '',
        language: movie?.language ?? 'Vietnamese',
        duration: Number(movie?.duration) || 60,
        age: Number(movie?.age) || 13,
        status: mapStatus(movie?.status),
        trailerLink: movie?.trailerLink ?? '',
        posterImage: movie?.posterImage ?? '',
        bannerImage: movie?.bannerImage ?? '',
        movieTheaterIds: [],
        genres: parseNumberArray(
          (movie?.genres ?? []).map((genre) => genre?.genresId)
        ),
        directors: parseNumberArray(
          (movie?.directors ?? []).map((participant) =>
            resolveParticipantId(participant)
          )
        ),
        casts: parseNumberArray(
          (movie?.casts ?? []).map((participant) =>
            resolveParticipantId(participant)
          )
        ),
      });

      setPosterImage(resolveStorageUrl(movie?.posterImage ?? ''));
      setBannerImage(resolveStorageUrl(movie?.bannerImage ?? ''));
      clearFileInputs();
    },
    [clearFileInputs, resetForm]
  );

  const loadMovieTheaterMappings = useCallback(
    async (movieId) => {
      if (!movieId) {
        setValue('movieTheaterIds', []);
        return;
      }

      setIsLoadingMovieTheaterMappings(true);

      try {
        const response = await findAllMovieTheaterMappingsByMovieId(movieId);
        const mappedMovieTheaterIds = extractMovieTheaterMappingList(response)
          .map(normalizeMovieTheaterMapping)
          .map((mapping) => Number(mapping.movieTheaterId))
          .filter(
            (movieTheaterId) =>
              Number.isInteger(movieTheaterId) && movieTheaterId > 0
          );

        setValue('movieTheaterIds', Array.from(new Set(mappedMovieTheaterIds)));
      } catch (error) {
        setValue('movieTheaterIds', []);
        toast.error(
          resolveActionError(
            error,
            'Không thể tải danh sách rạp đã gán cho bộ phim này!'
          )
        );
      } finally {
        setIsLoadingMovieTheaterMappings(false);
      }
    },
    [setValue]
  );

  const syncMovieTheaterMappings = useCallback(
    async (movieId, nextMovieTheaterIds) => {
      const response = await findAllMovieTheaterMappingsByMovieId(movieId);
      const currentMappings = extractMovieTheaterMappingList(response).map(
        normalizeMovieTheaterMapping
      );
      const normalizedNextMovieTheaterIds =
        parseNumberArray(nextMovieTheaterIds);
      const nextMovieTheaterIdSet = new Set(
        normalizedNextMovieTheaterIds.map((movieTheaterId) =>
          String(movieTheaterId)
        )
      );
      const currentMovieTheaterIdSet = new Set(
        currentMappings
          .map((mapping) => mapping.movieTheaterId)
          .filter((movieTheaterId) => movieTheaterId != null)
          .map((movieTheaterId) => String(movieTheaterId))
      );

      const mappingsToCreate = normalizedNextMovieTheaterIds.filter(
        (movieTheaterId) =>
          !currentMovieTheaterIdSet.has(String(movieTheaterId))
      );
      const mappingsToDelete = currentMappings.filter(
        (mapping) =>
          !nextMovieTheaterIdSet.has(String(mapping.movieTheaterId)) &&
          mapping.id
      );

      await Promise.all([
        ...mappingsToCreate.map((movieTheaterId) =>
          createMovieTheaterMapping({
            movieId: Number(movieId),
            movieTheaterId: Number(movieTheaterId),
          })
        ),
        ...mappingsToDelete.map((mapping) =>
          deleteMovieTheaterMapping(mapping.id)
        ),
      ]);
    },
    []
  );

  useEffect(() => {
    const bootstrapGenres = async () => {
      setIsLoadingGenres(true);

      try {
        const response = await getAllGenre();
        setGenreOptions(
          extractGenreList(response).map((genre) => ({
            value: genre.genresId,
            label: genre.name,
          }))
        );
      } catch (error) {
        toast.error(
          resolveActionError(
            error,
            'Không thể tải danh sách thể loại phim cho biểu mẫu phim!'
          )
        );
      } finally {
        setIsLoadingGenres(false);
      }
    };

    const bootstrapParticipants = async () => {
      setIsLoadingParticipants(true);

      try {
        const response = await findAllParticipants();
        setParticipantOptions(
          mapParticipantsToOptions(extractParticipantList(response))
        );
      } catch (error) {
        toast.error(
          resolveActionError(
            error,
            'Không thể tải danh sách người tham gia cho biểu mẫu phim!'
          )
        );
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    const bootstrapMovieTheaters = async () => {
      setIsLoadingMovieTheaters(true);

      try {
        const response = await findAllMovieTheater({ page: 0, size: 1000 });
        setMovieTheaterOptions(mapMovieTheaterOptions(response));
      } catch (error) {
        toast.error(
          resolveActionError(
            error,
            'Không thể tải danh sách rạp cho biểu mẫu phim!'
          )
        );
      } finally {
        setIsLoadingMovieTheaters(false);
      }
    };

    bootstrapGenres();
    bootstrapParticipants();
    bootstrapMovieTheaters();
  }, []);

  useEffect(() => {
    if (editingMovie) {
      applyEditingState(editingMovie);
      return;
    }

    applyDefaultState();
  }, [editingMovie, applyDefaultState, applyEditingState]);

  useEffect(() => {
    const movieId = resolveMovieId(editingMovie);

    if (!movieId) {
      setValue('movieTheaterIds', []);
      return;
    }

    loadMovieTheaterMappings(movieId);
  }, [editingMovie, loadMovieTheaterMappings, setValue]);

  const buildPayload = (value) => {
    const payload = {
      title: value.title.trim(),
      synopsis: value.synopsis.trim(),
      detailDescription: value.detailDescription.trim(),
      releaseDate: value.releaseDate,
      endDate: value.endDate,
      language: value.language.trim(),
      duration: Number(value.duration),
      age: Number(value.age),
      status: value.status,
      genres: parseNumberArray(value.genres),
      trailerLink: value.trailerLink.trim(),
      posterImage: value.posterImage.trim(),
      bannerImage: value.bannerImage.trim(),
    };

    const directors = parseNumberArray(value.directors);
    if (directors.length > 0) {
      payload.directors = directors;
    }

    const casts = parseNumberArray(value.casts);
    if (casts.length > 0) {
      payload.casts = casts;
    }

    return payload;
  };

  const handleUploadImage = async (event, type) => {
    const inputElement = event.target;
    const file = inputElement.files?.[0];
    inputElement.value = '';

    const isPoster = type === 'poster';
    const imageLabel = isPoster ? 'poster' : 'banner';

    if (!file) {
      toast.error(`Vui lòng chọn ảnh ${imageLabel} để tải lên!`);
      return;
    }

    if (!file.type?.startsWith('image/')) {
      toast.error(`Tệp ${imageLabel} phải là hình ảnh hợp lệ!`);
      return;
    }

    if (isPoster) {
      setIsUploadingPoster(true);
    } else {
      setIsUploadingBanner(true);
    }

    try {
      const uploadedValue = await uploadPhoto(file);
      const resolvedValue = resolveStorageUrl(uploadedValue);

      if (!resolvedValue) {
        throw new Error('empty-upload-value');
      }

      if (isPoster) {
        setPosterImage(resolvedValue);
        setValue('posterImage', resolvedValue, {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        setBannerImage(resolvedValue);
        setValue('bannerImage', resolvedValue, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }

      toast.success(`Tải ảnh ${imageLabel} thành công!`);
    } catch (error) {
      toast.error(resolveActionError(error, `Tải ảnh ${imageLabel} thất bại!`));
    } finally {
      if (isPoster) {
        setIsUploadingPoster(false);
      } else {
        setIsUploadingBanner(false);
      }
    }
  };

  const handleReset = () => {
    applyDefaultState();
    setEditingMovie(null);
  };

  const onSubmit = async (value) => {
    const payload = buildPayload(value);
    const selectedMovieTheaterIds = parseNumberArray(value.movieTheaterIds);

    try {
      if (editingMovie) {
        await updateMovie({ ...payload, movieId: editingMovie.movieId });

        try {
          await syncMovieTheaterMappings(
            editingMovie.movieId,
            selectedMovieTheaterIds
          );
          toast.success('Cập nhật thông tin phim thành công!');
        } catch (mappingError) {
          toast.warning(
            resolveActionError(
              mappingError,
              'Đã cập nhật phim nhưng đồng bộ rạp chiếu thất bại!'
            )
          );
        }

        return;
      }

      const createdMovieResponse = await addMovie(payload);
      const createdMovieId = await resolveCreatedMovieId(
        createdMovieResponse,
        payload
      );

      if (selectedMovieTheaterIds.length > 0) {
        if (createdMovieId) {
          try {
            await syncMovieTheaterMappings(
              createdMovieId,
              selectedMovieTheaterIds
            );
          } catch (mappingError) {
            toast.warning(
              resolveActionError(
                mappingError,
                'Bộ phim đã được tạo nhưng đồng bộ rạp chiếu chưa thành công. Vui lòng mở lại phim để kiểm tra mapping.'
              )
            );
          }
        } else {
          toast.warning(
            'Bộ phim đã được tạo nhưng chưa lấy được movieId để gắn rạp. Vui lòng mở lại phim và lưu mapping thêm lần nữa.'
          );
        }
      }

      toast.success('Thêm mới bộ phim thành công!');
      applyDefaultState();
    } catch (error) {
      toast.error(
        resolveActionError(
          error,
          editingMovie
            ? 'Cập nhật thông tin bộ phim thất bại!'
            : 'Thêm bộ phim thất bại!'
        )
      );
    }
  };

  const creditsHelperMessage =
    participantOptions.length === 0
      ? 'Chưa có người tham gia nào trong hệ thống. Hãy tạo participant trước khi gán đạo diễn hoặc diễn viên cho phim.'
      : 'Chọn người tham gia phù hợp cho vai trò đạo diễn và diễn viên nếu phim đã có dữ liệu credit.';

  const movieTheaterHelperMessage =
    movieTheaterOptions.length === 0
      ? 'Chưa có rạp nào trong hệ thống. Hãy tạo rạp trước khi gắn phim vào tab suất chiếu.'
      : 'Cấp phép cho phim có thể chiếu tại các rạp ...';

  const renderMediaPanel = ({
    title,
    description,
    fieldName,
    value,
    previewSrc,
    error,
    buttonLabel,
    onUpload,
    inputRef,
    isUploading,
  }) => (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition duration-200 hover:border-amber-200">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-700">
          media
        </span>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50">
        <AnimatePresence mode="wait">
          <MotionDiv
            key={previewSrc || `${fieldName}-empty`}
            variants={previewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex min-h-[220px] items-center justify-center"
          >
            {previewSrc ? (
              <ImageComponent
                src={previewSrc}
                width={fieldName === 'posterImage' ? 280 : 480}
                height={fieldName === 'posterImage' ? 420 : 220}
                className={
                  fieldName === 'posterImage'
                    ? 'h-[300px] w-full object-cover md:h-[360px]'
                    : 'h-[220px] w-full object-cover md:h-[280px]'
                }
              />
            ) : (
              <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center text-sm text-slate-500">
                <p className="text-sm font-medium text-slate-700">
                  Chưa có ảnh{' '}
                  {fieldName === 'posterImage' ? 'poster' : 'banner'}
                </p>
                <p className="max-w-xs leading-6">
                  Tải ảnh lên để kiểm tra nhanh bố cục và chất lượng hiển thị
                  trước khi lưu phim.
                </p>
              </div>
            )}
          </MotionDiv>
        </AnimatePresence>
      </div>

      <FormField
        name={fieldName}
        require={true}
        label={
          fieldName === 'posterImage' ? 'Đường dẫn poster' : 'Đường dẫn banner'
        }
        control={control}
        Component={TextInput}
        value={value}
        type="text"
        disabled
        placeHolder={
          fieldName === 'posterImage'
            ? 'Chưa có đường dẫn poster'
            : 'Chưa có đường dẫn banner'
        }
        error={error}
      />

      <Button
        variant="contained"
        color="warning"
        component="label"
        disabled={isUploading}
        className="!mt-1 h-10 w-full !rounded-xl !shadow-none transition duration-200 hover:!shadow-md"
      >
        {isUploading ? 'Đang tải ảnh...' : buttonLabel}
        <input
          ref={inputRef}
          type="file"
          hidden
          onChange={onUpload}
          accept="image/*"
          multiple={false}
        />
      </Button>
    </div>
  );

  return (
    <MotionDiv
      key={editingMovie?.movieId ?? 'create-movie'}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,251,235,0.85)_0%,_rgba(255,255,255,1)_18%,_rgba(255,255,255,1)_100%)]"
    >
      <div className="border-b border-slate-200 px-5 py-5 md:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          Movie Workspace
        </p>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {editingMovie ? 'Cập nhật thông tin phim' : 'Tạo phim mới'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Sắp xếp metadata, credits và hình ảnh trong cùng một biểu mẫu để
              kiểm tra nhanh nội dung trước khi lưu lên hệ thống.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {editingMovie
              ? 'Bạn đang ở chế độ chỉnh sửa. Các mốc ngày và trạng thái sẽ tiếp tục tuân theo ràng buộc hiện tại của phim.'
              : 'Tạo phim mới với đầy đủ mô tả, thể loại, credit và media để dữ liệu hiển thị đồng nhất ở trang người dùng.'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitForm(onSubmit)} className="px-5 py-6 md:px-7">
        <MotionSection
          variants={sectionVariants}
          className="border-b border-slate-200 pb-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Thông tin cơ bản
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Đặt tên phim, thời gian phát hành và các thông số hiển thị chính.
            </p>
          </div>

          <FormField
            name="title"
            require={true}
            label="Tên phim"
            control={control}
            Component={TextInput}
            type="text"
            placeHolder="Nhập tên phim"
            error={errors.title}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              disabled={isScheduleLocked}
              name="releaseDate"
              require={true}
              label="Ngày khởi chiếu"
              control={control}
              Component={TextInput}
              type="date"
              error={errors.releaseDate}
            />
            <FormField
              disabled={isScheduleLocked}
              name="endDate"
              require={true}
              label="Ngày kết thúc"
              control={control}
              Component={TextInput}
              type="date"
              error={errors.endDate}
            />
            <FormField
              name="duration"
              require={true}
              label="Thời lượng"
              control={control}
              Component={TextInput}
              type="number"
              placeHolder="Nhập thời lượng"
              error={errors.duration}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              name="status"
              disabled={isScheduleLocked}
              require={true}
              label="Trạng thái phim"
              control={control}
              options={statusOptions}
              Component={CustomSelect}
              type="text"
              placeHolder="Chọn trạng thái phim"
              error={errors.status}
            />
            <FormField
              name="age"
              require={true}
              label="Giới hạn độ tuổi"
              control={control}
              Component={CustomSelect}
              options={limitAgeOptions}
              type="number"
              placeHolder="Chọn độ tuổi"
              error={errors.age}
            />
            <FormField
              name="language"
              require={true}
              label="Ngôn ngữ"
              control={control}
              Component={TextInput}
              type="text"
              placeHolder=": Vietnamese"
              error={errors.language}
            />
          </div>
        </MotionSection>

        <MotionSection
          variants={sectionVariants}
          className="border-b border-slate-200 py-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Phân loại và credit
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Chọn thể loại và bổ sung danh sách đạo diễn, diễn viên để frontend
              có đủ dữ liệu hiển thị.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              name="genres"
              require={true}
              label="Thể loại"
              control={control}
              Component={MulSelect}
              options={genreOptions}
              type="number"
              placeHolder={
                isLoadingGenres ? 'Đang tải thể loại...' : 'Chọn thể loại phim'
              }
              error={errors.genres}
              disabled={isLoadingGenres || genreOptions.length === 0}
            />
            <FormField
              name="directors"
              label="Đạo diễn"
              control={control}
              Component={MulSelect}
              options={participantOptions}
              type="number"
              placeHolder={
                isLoadingParticipants
                  ? 'Đang tải đạo diễn...'
                  : 'Chọn đạo diễn cho phim'
              }
              error={errors.directors}
              disabled={
                isLoadingParticipants || participantOptions.length === 0
              }
            />
            <FormField
              name="casts"
              label="Diễn viên"
              control={control}
              Component={MulSelect}
              options={participantOptions}
              type="number"
              placeHolder={
                isLoadingParticipants
                  ? 'Đang tải diễn viên...'
                  : 'Chọn diễn viên cho phim'
              }
              error={errors.casts}
              disabled={
                isLoadingParticipants || participantOptions.length === 0
              }
            />
          </div>

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500">
            {creditsHelperMessage}
          </p>

          <div className="mt-4 grid gap-4">
            <FormField
              name="movieTheaterIds"
              label="Rạp áp dụng"
              control={control}
              Component={MulSelect}
              options={movieTheaterOptions}
              type="number"
              placeHolder={
                isLoadingMovieTheaters
                  ? 'Đang tải danh sách rạp...'
                  : isLoadingMovieTheaterMappings
                    ? 'Đang tải rạp đã gán...'
                    : 'Chọn rạp để mở suất chiếu'
              }
              error={errors.movieTheaterIds}
              disabled={
                isLoadingMovieTheaters || movieTheaterOptions.length === 0
              }
            />
          </div>

          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            {movieTheaterHelperMessage}
          </p>
        </MotionSection>

        <MotionSection
          variants={sectionVariants}
          className="border-b border-slate-200 py-6"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Nội dung hiển thị
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Hoàn thiện trailer, tóm tắt ngắn và mô tả chi tiết để đồng bộ giữa
              admin và trang phim.
            </p>
          </div>

          <FormField
            name="trailerLink"
            require={true}
            label="Đường dẫn video trailer"
            control={control}
            Component={TextInput}
            type="text"
            placeHolder="https://www.youtube.com/"
            error={errors.trailerLink}
          />

          <FormField
            name="synopsis"
            require={true}
            label="Tóm tắt"
            control={control}
            Component={TextAreaInput}
            rows={2}
            maxRows={4}
            type="text"
            placeHolder="Nhập tóm tắt bộ phim"
            error={errors.synopsis}
          />

          <FormField
            name="detailDescription"
            require={true}
            label="Mô tả bộ phim"
            control={control}
            Component={TextAreaInput}
            rows={4}
            maxRows={6}
            type="text"
            placeHolder="Mô tả chi tiết về phim"
            error={errors.detailDescription}
          />
        </MotionSection>

        <MotionSection variants={sectionVariants} className="py-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Media preview
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Kiểm tra nhanh poster và banner trực tiếp trong biểu mẫu để tránh
              lưu nhầm ảnh hoặc sai tỷ lệ.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            {renderMediaPanel({
              title: 'Poster dọc',
              description:
                'Ảnh chính cho danh sách phim và chi tiết phim. Ưu tiên bố cục dọc, vùng mặt nhân vật rõ nét.',
              fieldName: 'posterImage',
              value: posterImage,
              previewSrc: posterImage,
              error: errors.posterImage,
              buttonLabel: 'Tải ảnh poster',
              onUpload: (event) => handleUploadImage(event, 'poster'),
              inputRef: posterInputRef,
              isUploading: isUploadingPoster,
            })}

            {renderMediaPanel({
              title: 'Banner ngang',
              description:
                'Ảnh phụ cho khu vực nổi bật hoặc hero. Ưu tiên chiều ngang rộng và ít chi tiết gây nhiễu vùng chữ.',
              fieldName: 'bannerImage',
              value: bannerImage,
              previewSrc: bannerImage,
              error: errors.bannerImage,
              buttonLabel: 'Tải ảnh banner',
              onUpload: (event) => handleUploadImage(event, 'banner'),
              inputRef: bannerInputRef,
              isUploading: isUploadingBanner,
            })}
          </div>
        </MotionSection>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-6 text-slate-500">
            {editingMovie
              ? 'Biểu mẫu đang ở chế độ cập nhật. Bạn có thể tiếp tục chỉnh sửa credit, trailer và media trước khi lưu.'
              : 'Sau khi tạo phim thành công, toàn bộ trường nhập và input tải ảnh sẽ được làm sạch hoàn toàn.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={!!editingMovie || isBusy}
              className="!rounded-xl !shadow-none transition duration-200 hover:!shadow-md"
            >
              {isSubmitting && !editingMovie ? 'Đang tạo...' : 'Tạo mới'}
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="warning"
              disabled={!editingMovie || isBusy}
              className="!rounded-xl !shadow-none transition duration-200 hover:!shadow-md"
            >
              {isSubmitting && !!editingMovie ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
            <Button
              variant="outlined"
              color="info"
              type="button"
              onClick={handleReset}
              disabled={isBusy}
              className="!rounded-xl"
            >
              Làm mới
            </Button>
          </div>
        </div>
      </form>
    </MotionDiv>
  );
};

export default FormMovie;
