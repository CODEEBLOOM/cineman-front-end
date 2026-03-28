import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractParticipantList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.participants)) {
    return payload.participants;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractParticipantDetail = (response) => {
  const payload = unwrapData(response);

  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

export const findAll = async () => {
  return await axios.get('/admin/participant/all');
};

export const findParticipantById = async (id) => {
  return await axios.get(`/admin/participant/${id}`);
};

export const createParticipant = async (data) => {
  return await axios.post('/admin/participant/add', data);
};

export const updateParticipant = async (id, data) => {
  return await axios.put(`/admin/participant/${id}/update`, data);
};

export const deleteParticipant = async (id) => {
  return await axios.delete(`/admin/participant/${id}/delete`);
};
