import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractCinemaTheaterList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.cinemaTheaters)) {
    return payload.data.cinemaTheaters;
  }

  if (Array.isArray(payload?.cinemaTheaters)) {
    return payload.cinemaTheaters;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractCinemaTheaterDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    if (payload.data.cinemaTheater && !Array.isArray(payload.data.cinemaTheater)) {
      return payload.data.cinemaTheater;
    }

    return payload.data;
  }

  if (payload?.cinemaTheater && !Array.isArray(payload.cinemaTheater)) {
    return payload.cinemaTheater;
  }

  return payload;
};

export const extractCinemaTheaterMeta = (response) => {
  const payload = unwrapData(response);

  if (payload?.data?.meta) {
    return payload.data.meta;
  }

  return payload?.meta ?? null;
};

/**
 * Lấy toàn bộ danh sách phòng chiếu của hệ thống.
 */
export const findAll = async ({ page = null, size = null, status = null } = {}) => {
  return await axios.get('/admin/cinema-theater/all', {
    params: {
      page,
      size,
      status,
    },
  });
};

export const findById = async (id) => {
  return await axios.get(`/admin/cinema-theater/${id}`);
};

export const findByMovieTheaterId = async (movieTheaterId) => {
  return await axios.get(`/admin/cinema-theater/movie-theater/${movieTheaterId}/all`);
};

export const create = async (data) => {
  return await axios.post('/admin/cinema-theater/add', data);
};

export const update = async ({ id, data }) => {
  return await axios.put(`/admin/cinema-theater/${id}/update`, data);
};

export const deleteCinemaTheater = async (id) => {
  return await axios.delete(`/admin/cinema-theater/${id}/delete`);
};

export const getSeatMap = async (id) => {
  return await axios.get(`/admin/cinema-theater/${id}/seat-map`);
};

export const published = async (id) => {
  return await axios.put(`/admin/cinema-theater/${id}/published`);
};

export const findCinemaTheaterById = findById;
