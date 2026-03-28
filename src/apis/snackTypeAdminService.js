import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractSnackTypeList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.snackTypes)) {
    return payload.snackTypes;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractSnackTypeDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const normalizeSnackType = (snackType) => ({
  ...snackType,
  snackTypeId: snackType?.snackTypeId ?? snackType?.id ?? null,
});

export const findAllSnackTypesAdmin = async () => {
  return await axios.get('/admin/snack-types/all');
};

export const findSnackTypeById = async (id) => {
  return await axios.get(`/admin/snack-types/${id}`);
};

export const createSnackType = async (data) => {
  return await axios.post('/admin/snack-types/add', data);
};

export const updateSnackType = async (id, data) => {
  return await axios.put(`/admin/snack-types/${id}`, data);
};

export const deleteSnackType = async (id) => {
  return await axios.delete(`/admin/snack-types/${id}`);
};
