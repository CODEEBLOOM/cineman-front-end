import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;
const MOVIE_PARTICIPANT_BASE = '/admin/movie-participant';

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
      (movieId ? `Phim #${movieId}` : 'Chua co phim'),
    participantName:
      movieParticipant?.participantName ??
      participant?.nickname ??
      participant?.birthName ??
      participant?.fullName ??
      participant?.name ??
      (participantId ? `Participant #${participantId}` : 'Chua co nguoi tham gia'),
    movieRoleName:
      movieParticipant?.movieRoleName ??
      movieRole?.name ??
      movieParticipant?.roleName ??
      (movieRoleId ? `Vai tro #${movieRoleId}` : 'Chua co vai tro'),
  };
};

export const findAllMovieParticipants = async () => {
  return await axios.get(`${MOVIE_PARTICIPANT_BASE}/all`);
};

export const createMovieParticipant = async (data) => {
  return await axios.post(`${MOVIE_PARTICIPANT_BASE}/add`, data);
};

export const updateMovieParticipant = async (id, data) => {
  return await axios.put(`${MOVIE_PARTICIPANT_BASE}/${id}/update`, data);
};

export const deleteMovieParticipant = async (movieId, participantId) => {
  return await axios.delete(
    `${MOVIE_PARTICIPANT_BASE}/delete/${movieId}/${participantId}`
  );
};
