import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractGenreList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.genres)) {
    return payload.genres;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractGenreDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const getAllGenre = async () => {
  return await axios.get('/admin/genre/all');
};

export const findGenreById = async (id) => {
  return await axios.get(`/admin/genre/${id}`);
};

export const createGenre = async (data) => {
  return await axios.post('/admin/genre/add', data);
};

export const updateGenre = async (id, data) => {
  return await axios.put(`/admin/genre/${id}/update`, data);
};

export const deleteGenre = async (id) => {
  return await axios.delete(`/admin/genre/${id}/delete`);
};
