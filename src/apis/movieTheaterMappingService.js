import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

const findFirstArray = (value) => {
  if (!value || typeof value !== 'object') {
    return [];
  }

  return Object.values(value).find((entry) => Array.isArray(entry)) ?? [];
};

export const normalizeMovieTheaterMapping = (mapping) => {
  const movie = mapping?.movie ?? {};
  const movieTheater = mapping?.movieTheater ?? {};

  return {
    id: mapping?.movieTheaterMappingId ?? mapping?.id ?? null,
    movieId: mapping?.movieId ?? movie?.movieId ?? movie?.id ?? null,
    movieTitle: mapping?.movieTitle ?? movie?.title ?? '',
    movieTheaterId:
      mapping?.movieTheaterId ??
      movieTheater?.movieTheaterId ??
      movieTheater?.id ??
      null,
    movieTheaterName: mapping?.movieTheaterName ?? movieTheater?.name ?? '',
    raw: mapping,
  };
};

export const extractMovieTheaterMappingList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.movieTheaterMappings)) {
    return payload.movieTheaterMappings;
  }

  if (Array.isArray(payload?.mappings)) {
    return payload.mappings;
  }

  if (Array.isArray(payload?.data?.content)) {
    return payload.data.content;
  }

  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload?.data?.movieTheaterMappings)) {
    return payload.data.movieTheaterMappings;
  }

  if (Array.isArray(payload?.data?.mappings)) {
    return payload.data.mappings;
  }

  if (payload?.data && typeof payload.data === 'object') {
    return findFirstArray(payload.data);
  }

  return findFirstArray(payload);
};

export const extractMovieTheaterMappingDetail = (response) => {
  const payload = unwrapData(response);

  if (!payload) {
    return null;
  }

  if (payload?.data && !Array.isArray(payload.data)) {
    if (
      payload.data.movieTheaterMapping &&
      !Array.isArray(payload.data.movieTheaterMapping)
    ) {
      return payload.data.movieTheaterMapping;
    }

    return payload.data;
  }

  if (
    payload?.movieTheaterMapping &&
    !Array.isArray(payload.movieTheaterMapping)
  ) {
    return payload.movieTheaterMapping;
  }

  return payload;
};

export const findAllMovieTheaterMappings = async ({
  page = 0,
  size = 1000,
  ...params
} = {}) => {
  return await axios.get('/admin/movie-theater-mapping/all', {
    params: {
      page,
      size,
      ...params,
    },
  });
};

export const findMovieTheaterMappingById = async (id) => {
  return await axios.get(`/admin/movie-theater-mapping/${id}`);
};

export const createMovieTheaterMapping = async (data) => {
  return await axios.post('/admin/movie-theater-mapping/add', data);
};

export const updateMovieTheaterMapping = async (id, data) => {
  return await axios.put(`/admin/movie-theater-mapping/${id}/update`, data);
};

export const deleteMovieTheaterMapping = async (id) => {
  return await axios.delete(`/admin/movie-theater-mapping/${id}/delete`);
};

export const findAllMovieTheaterMappingsByMovieId = async (movieId) => {
  return await axios.get(`/admin/movie-theater-mapping/movie/${movieId}/all`);
};

export const findAllMovieTheaterMappingsByMovieTheaterId = async (
  movieTheaterId
) => {
  return await axios.get(
    `/admin/movie-theater-mapping/movie-theater/${movieTheaterId}/all`
  );
};
