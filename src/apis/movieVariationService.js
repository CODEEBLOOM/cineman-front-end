import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractMovieVariationList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.movieVariations)) {
    return payload.movieVariations;
  }

  return [];
};

export const findAllMovieVariationsAdmin = async () => {
  return await axios.get('/admin/movie-variation/all');
};

export const findAllMovieVariationsPublic = async () => {
  return await axios.get('/movie-variation/all');
};

export const findMovieVariationById = async (id) => {
  return await axios.get(`/admin/movie-variation/${id}`);
};

export const createMovieVariation = async (data) => {
  return await axios.post('/admin/movie-variation/add', data);
};

export const updateMovieVariation = async (id, data) => {
  return await axios.put(`/admin/movie-variation/${id}/update`, data);
};

export const deleteMovieVariation = async (id) => {
  return await axios.delete(`/admin/movie-variation/${id}/delete`);
};
