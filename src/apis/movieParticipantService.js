import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

const API_ROOT = import.meta.env.VITE_HOST.replace(/\/api\/v01\/?$/, '');

const buildMovieParticipantUrl = (path) => `${API_ROOT}${path}`;

export const extractMovieParticipantList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.movieParticipants)) {
    return payload.movieParticipants;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const resolveMovieParticipantEntityId = (movieParticipant) => {
  if (!movieParticipant) {
    return null;
  }

  return (
    movieParticipant.id ??
    movieParticipant.movieParticipantId ??
    movieParticipant.movieParticipantsId ??
    null
  );
};

export const normalizeMovieParticipant = (movieParticipant) => {
  const movie = movieParticipant?.movie ?? movieParticipant?.movieResponse ?? {};
  const participant =
    movieParticipant?.participant ??
    movieParticipant?.director ??
    movieParticipant?.cast ??
    movieParticipant?.participantResponse ??
    {};
  const movieRole =
    movieParticipant?.movieRole ??
    movieParticipant?.role ??
    movieParticipant?.movieRoleResponse ??
    {};

  const movieId =
    movieParticipant?.movieId ??
    movieParticipant?.movie?.movieId ??
    movieParticipant?.movieResponse?.movieId ??
    movieParticipant?.id?.movieId ??
    null;

  const participantId =
    movieParticipant?.participantId ??
    movieParticipant?.directorId ??
    movieParticipant?.participant?.participantId ??
    movieParticipant?.participant?.id ??
    movieParticipant?.director?.participantId ??
    movieParticipant?.director?.id ??
    movieParticipant?.id?.participantId ??
    movieParticipant?.id?.directorId ??
    null;

  const movieRoleId =
    movieParticipant?.movieRoleId ??
    movieParticipant?.movieRole?.movieRoleId ??
    movieParticipant?.movieRole?.id ??
    movieParticipant?.role?.movieRoleId ??
    movieParticipant?.role?.id ??
    movieParticipant?.id?.movieRoleId ??
    null;

  return {
    ...movieParticipant,
    entityId: resolveMovieParticipantEntityId(movieParticipant),
    movieId,
    participantId,
    movieRoleId,
    movieTitle:
      movieParticipant?.movieTitle ??
      movie?.title ??
      movie?.movieTitle ??
      (movieId ? `Phim #${movieId}` : 'Chua có phim'),
    participantName:
      movieParticipant?.participantName ??
      participant?.nickname ??
      participant?.birthName ??
      participant?.fullName ??
      participant?.name ??
      (participantId ? `Participant #${participantId}` : 'Chua có ngu?i tham gia'),
    movieRoleName:
      movieParticipant?.movieRoleName ??
      movieRole?.name ??
      movieParticipant?.roleName ??
      (movieRoleId ? `Vai trò #${movieRoleId}` : 'Chua có vai trò'),
  };
};

export const findAllMovieParticipants = async () => {
  return await axios.get(buildMovieParticipantUrl('/admin/movie-participant/all'));
};

export const createMovieParticipant = async (data) => {
  return await axios.post(buildMovieParticipantUrl('/admin/movie-participant/add'), data);
};

export const updateMovieParticipant = async (id, data) => {
  return await axios.put(
    buildMovieParticipantUrl(`/admin/movie-participant/api/v01/${id}/update`),
    data
  );
};

export const deleteMovieParticipant = async (movieId, participantId) => {
  return await axios.delete(
    buildMovieParticipantUrl(
      `/admin/movie-participant/delete/${movieId}/${participantId}`
    )
  );
};
