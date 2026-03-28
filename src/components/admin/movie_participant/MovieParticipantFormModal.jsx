import {
  createMovieParticipant,
  resolveMovieParticipantEntityId,
  updateMovieParticipant,
} from '@apis/movieParticipantService';
import {
  extractMovieRoleList,
  findAllMovieRolesAdmin,
} from '@apis/movieRoleService';
import { extractParticipantList, findAll } from '@apis/participantService';
import { findAllByFilterAdmin } from '@apis/movieService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import CustomSelect from '@component/form_field/CustomSelect';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const formSchema = yup.object({
  movieId: yup
    .number()
    .typeError('Vui lòng chọn phim!')
    .required('Vui lòng chọn phim!'),
  participantId: yup
    .number()
    .typeError('Vui lòng chọn người tham gia!')
    .required('Vui lòng chọn người tham gia!'),
  movieRoleId: yup
    .number()
    .typeError('Vui lòng chọn vai trò!')
    .required('Vui lòng chọn vai trò!'),
});

const extractAdminMovieList = (response) => {
  const payload = response?.data ?? response ?? {};
  const container = payload?.data ?? payload;

  if (Array.isArray(container?.movies)) {
    return container.movies;
  }

  if (Array.isArray(payload?.movies)) {
    return payload.movies;
  }

  if (Array.isArray(container)) {
    return container;
  }

  return [];
};

const mapMoviesToOptions = (movies) =>
  movies.map((movie) => ({
    value: movie.movieId ?? movie.id,
    label: movie.title ?? `Phim #${movie.movieId ?? movie.id}`,
  }));

const mapParticipantsToOptions = (participants) =>
  participants.map((participant) => ({
    value: participant.participantId ?? participant.id,
    label:
      participant.nickname ||
      participant.birthName ||
      participant.fullName ||
      `Participant #${participant.participantId ?? participant.id}`,
  }));

const mapMovieRolesToOptions = (movieRoles) =>
  movieRoles.map((movieRole) => ({
    value: movieRole.movieRoleId ?? movieRole.id,
    label: movieRole.name,
  }));

const MovieParticipantFormModal = ({
  movieParticipant,
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const entityId = resolveMovieParticipantEntityId(movieParticipant);
  const isEditing = Boolean(movieParticipant);
  const formId = 'movie-participant-form';

  const [movieOptions, setMovieOptions] = useState([]);
  const [participantOptions, setParticipantOptions] = useState([]);
  const [movieRoleOptions, setMovieRoleOptions] = useState([]);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      movieId: '',
      participantId: '',
      movieRoleId: '',
    },
  });

  useEffect(() => {
    reset({
      movieId: movieParticipant?.movieId ?? '',
      participantId: movieParticipant?.participantId ?? '',
      movieRoleId: movieParticipant?.movieRoleId ?? '',
    });
  }, [movieParticipant, reset]);

  useEffect(() => {
    const bootstrap = async () => {
      setIsBootstrapping(true);

      try {
        const [movieResponse, participantResponse, movieRoleResponse] =
          await Promise.all([
            findAllByFilterAdmin({
              page: 0,
              size: 1000,
              status: 'ALL',
            }),
            findAll(),
            findAllMovieRolesAdmin(),
          ]);

        setMovieOptions(mapMoviesToOptions(extractAdminMovieList(movieResponse)));
        setParticipantOptions(
          mapParticipantsToOptions(extractParticipantList(participantResponse))
        );
        setMovieRoleOptions(
          mapMovieRolesToOptions(extractMovieRoleList(movieRoleResponse))
        );
      } catch {
        toast.error('Không thể tải dữ liệu cho biểu mẫu liên kết phim!');
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const handleReset = () => {
    reset({
      movieId: movieParticipant?.movieId ?? '',
      participantId: movieParticipant?.participantId ?? '',
      movieRoleId: movieParticipant?.movieRoleId ?? '',
    });
  };

  const cannotSubmit = useMemo(() => {
    return (
      isSubmitting ||
      isBootstrapping ||
      movieOptions.length === 0 ||
      participantOptions.length === 0 ||
      movieRoleOptions.length === 0
    );
  }, [
    isBootstrapping,
    isSubmitting,
    movieOptions.length,
    movieRoleOptions.length,
    participantOptions.length,
  ]);

  const onSubmit = async (value) => {
    try {
      const payload = {
        movieId: Number(value.movieId),
        participantId: Number(value.participantId),
        movieRoleId: Number(value.movieRoleId),
      };

      if (isEditing) {
        if (!entityId) {
          toast.error('Bản ghi này chưa có id để cập nhật. Hãy xóa và tạo lại!');
          return;
        }

        await updateMovieParticipant(entityId, payload);
        toast.success('Cập nhật người tham gia phim thành công!');
      } else {
        await createMovieParticipant(payload);
        toast.success('Thêm người tham gia phim thành công!');
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
          ? 'Cập nhật người tham gia phim thất bại!'
          : 'Thêm người tham gia phim thất bại!'
      );
    }
  };

  const helperMessage =
    participantOptions.length === 0
      ? 'Hiện chưa có participant trong hệ thống. Bạn cần tạo người tham gia trước khi gán vào phim.'
      : movieRoleOptions.length === 0
        ? 'Hiện chưa có vai trò phim nào. Hãy tạo vai trò phim trước khi gán người tham gia.'
        : movieOptions.length === 0
          ? 'Hiện chưa có phim nào trong hệ thống.'
          : 'Chọn phim, người tham gia và vai trò tương ứng để tạo liên kết.';

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật người tham gia phim' : 'Tạo người tham gia phim'}
      description={helperMessage}
      onClose={closeTopModal}
      size="sm"
      placement={placement}
      actions={
        <>
          <Button type="button" variant="outlined" color="info" onClick={handleReset}>
            Làm mới
          </Button>
          <Button type="button" variant="outlined" color="warning" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
          <Button type="submit" form={formId} variant="contained" disabled={cannotSubmit}>
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="movieId"
          require={true}
          label="Phim"
          control={control}
          Component={CustomSelect}
          options={movieOptions}
          placeHolder={
            isBootstrapping ? 'Đang tải danh sách phim...' : 'Chọn phim cần gán'
          }
          error={errors.movieId}
          disabled={isBootstrapping || movieOptions.length === 0}
        />

        <FormField
          name="participantId"
          require={true}
          label="Người tham gia"
          control={control}
          Component={CustomSelect}
          options={participantOptions}
          placeHolder={
            isBootstrapping
              ? 'Đang tải danh sách người tham gia...'
              : 'Chọn người tham gia'
          }
          error={errors.participantId}
          disabled={isBootstrapping || participantOptions.length === 0}
        />

        <FormField
          name="movieRoleId"
          require={true}
          label="Vai trò phim"
          control={control}
          Component={CustomSelect}
          options={movieRoleOptions}
          placeHolder={
            isBootstrapping ? 'Đang tải danh sách vai trò...' : 'Chọn vai trò phim'
          }
          error={errors.movieRoleId}
          disabled={isBootstrapping || movieRoleOptions.length === 0}
        />
      </form>
    </AdminModal>
  );
};

export default MovieParticipantFormModal;
