import axios from '@apis/axiosClient';

export const findAllCombos = async () => {
  const url = '/snack/combo/all';
  return await axios.get(url);
};
