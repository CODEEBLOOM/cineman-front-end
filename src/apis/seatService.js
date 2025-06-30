import axios from '@apis/axiosClient';

export const create = async (data) => {
  const url = `/admin/seat/add`;
  return await axios.post(url, data);
};

export const deleteSeat = async (id) => {
  const url = `/admin/seat/${id}/delete`;
  return await axios.delete(url);
};
