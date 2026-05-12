import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractSnackList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.snacks)) {
    return payload.snacks;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractSnackDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const normalizeSnack = (snack) => {
  const snackType =
    snack?.snackType ??
    snack?.snackTypes ??
    snack?.snackTypeResponse ??
    snack?.type ??
    {};

  const snackId = snack?.snackId ?? snack?.id ?? null;
  const snackTypeId =
    snack?.snackTypeId ?? snackType?.snackTypeId ?? snackType?.id ?? null;

  return {
    ...snack,
    snackId,
    snackTypeId,
    snackTypeName:
      snack?.snackTypeName ??
      snack?.typeName ??
      snackType?.name ??
      (snackTypeId ? `Loại đồ ăn vặt #${snackTypeId}` : 'Chưa phân loại'),
  };
};

export const findAllSnacksAdmin = async () => {
  return await axios.get('/admin/snacks/all');
};

export const findSnackById = async (id) => {
  return await axios.get(`/admin/snacks/${id}`);
};

export const createSnack = async (data) => {
  return await axios.post('/admin/snacks/add', data);
};

export const updateSnack = async (id, data) => {
  return await axios.put(`/admin/snacks/${id}`, data);
};

export const deleteSnack = async (id) => {
  return await axios.delete(`/admin/snacks/${id}`);
};


