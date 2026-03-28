import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractProvinceList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.provinces)) {
    return payload.provinces;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractProvinceDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload?.province && !Array.isArray(payload.province)) {
    return payload.province;
  }

  return payload;
};

export const findAll = async () => {
  return await axios.get('/admin/province/all');
};

export const findProvinceById = async (id) => {
  return await axios.get(`/admin/province/${id}/id`);
};

export const findProvinceByName = async (name) => {
  return await axios.get(`/admin/province/${encodeURIComponent(name)}/name`);
};

export const createProvince = async (data) => {
  return await axios.post('/admin/province/add', data);
};

export const updateProvince = async (id, data) => {
  return await axios.put(`/admin/province/${id}/update`, data);
};

export const deleteProvince = async (id) => {
  return await axios.delete(`/admin/province/${id}/delete`);
};

export const deleteProvinceByCode = async (code) => {
  return await axios.delete(`/admin/province/${code}/code/delete`);
};
