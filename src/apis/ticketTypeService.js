import axios from '@apis/axiosClient';

const unwrapData = (response) => response?.data ?? response ?? null;

export const extractTicketTypeList = (response) => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.ticketTypes)) {
    return payload.ticketTypes;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

export const extractTicketTypeDetail = (response) => unwrapData(response);

export const findAllTicketTypesAdmin = async () => {
  return await axios.get('/admin/ticket-type/all');
};

export const findTicketTypeById = async (id) => {
  return await axios.get(`/admin/ticket-type/${id}`);
};

export const createTicketType = async (data) => {
  return await axios.post('/admin/ticket-type/add', data);
};

export const updateTicketType = async (id, data) => {
  return await axios.put(`/admin/ticket-type/${id}/update`, data);
};

export const deleteTicketType = async (id) => {
  return await axios.delete(`/admin/ticket-type/${id}/delete`);
};
