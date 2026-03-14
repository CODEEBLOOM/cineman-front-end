import axios from '@apis/axiosClient';

export const getAllGenre = () => {
  return axios.get('/admin/genre/all');
};
