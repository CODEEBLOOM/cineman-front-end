import axios from '@apis/axiosClient';

export const findAll = async () => {
  const url = '/admin/participant/all';
  return await axios.get(url);
};
