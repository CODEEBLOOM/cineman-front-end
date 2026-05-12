import axios from '@apis/axiosClient';

export const findAllCombos = async () => {
  const url = '/snack/combo/all';
  return await axios.get(url);
};

export const findAllSnacks = async (snackTypeId) => {
  const url = `/snack/${snackTypeId}/all`;
  return await axios.get(url);
};
