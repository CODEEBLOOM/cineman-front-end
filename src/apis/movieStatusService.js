import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractMovieStatusList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.movieStatuses)) {
    return payload.movieStatuses;
  }

  if (Array.isArray(payload?.statuses)) {
    return payload.statuses;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractMovieStatusDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const findAllMovieStatusesAdmin = async () => {
  return await axios.get('/admin/movie-status/all');
};

export const findMovieStatusById = async (id) => {
  return await axios.get(`/admin/movie-status/${id}`);
};

export const createMovieStatus = async (data) => {
  return await axios.post('/admin/movie-status/add', data);
};

export const updateMovieStatus = async (data) => {
  return await axios.put('/admin/movie-status/update', data);
};

export const deleteMovieStatus = async (id) => {
  return await axios.delete(`/admin/movie-status/${id}/remove`);
};
