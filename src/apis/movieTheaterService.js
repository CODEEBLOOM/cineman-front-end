import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractMovieTheaterList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.movieTheaters)) {
    return payload.data.movieTheaters;
  }

  if (Array.isArray(payload?.movieTheaters)) {
    return payload.movieTheaters;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractMovieTheaterDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    if (payload.data.movieTheater && !Array.isArray(payload.data.movieTheater)) {
      return payload.data.movieTheater;
    }

    return payload.data;
  }

  if (payload?.movieTheater && !Array.isArray(payload.movieTheater)) {
    return payload.movieTheater;
  }

  return payload;
};

export const extractMovieTheaterMeta = (response) => {
  const payload = unwrapData(response);

  if (payload?.data?.meta) {
    return payload.data.meta;
  }

  return payload?.meta ?? null;
};

export const findAllMovieTheater = async ({
  page = 0,
  size = 1000,
  ...params
} = {}) => {
  return await axios.get('/admin/movie-theater/all', {
    params: {
      page,
      size,
      ...params,
    },
  });
};

export const findAllMovieTheaterByProvinceId = async (provinceId) => {
  return await axios.get(`/admin/movie-theater/province/${provinceId}/all`);
};

export const findMovieTheaterById = async (id) => {
  return await axios.get(`/admin/movie-theater/${id}`);
};

export const createMovieTheater = async (data) => {
  return await axios.post('/admin/movie-theater/add', data);
};

export const updateMovieTheater = async (id, data) => {
  return await axios.put(`/admin/movie-theater/${id}/update`, data);
};

export const deleteMovieTheater = async (id) => {
  return await axios.delete(`/admin/movie-theater/${id}/delete`);
};
