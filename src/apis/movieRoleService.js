import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractMovieRoleList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.movieRoles)) {
    return payload.movieRoles;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractMovieRoleDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const findAllMovieRolesAdmin = async () => {
  return await axios.get('/admin/movie-role/all');
};

export const findMovieRoleById = async (id) => {
  return await axios.get(`/admin/movie-role/${id}`);
};

export const createMovieRole = async (data) => {
  return await axios.post('/admin/movie-role/add', data);
};

export const updateMovieRole = async (id, data) => {
  return await axios.put(`/admin/movie-role/${id}/update`, data);
};

export const deleteMovieRole = async (id) => {
  return await axios.delete(`/admin/movie-role/${id}/delete`);
};
