import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractCinemaTypeList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.cinemaTypes)) {
    return payload.cinemaTypes;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractCinemaTypeDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.cinemaType && !Array.isArray(payload.cinemaType)) {
    return payload.cinemaType;
  }

  return payload;
};

export const findAll = async () => {
  return await axios.get('/admin/cinema-type/all');
};

export const findCinemaTypeById = async (id) => {
  return await axios.get(`/admin/cinema-type/${id}`);
};

export const createCinemaType = async (data) => {
  return await axios.post('/admin/cinema-type/add', data);
};

export const updateCinemaType = async (id, data) => {
  return await axios.post(`/admin/cinema-type/${id}/update`, data);
};

export const deleteCinemaType = async (id) => {
  return await axios.delete(`/admin/cinema-type/${id}/delete`);
};