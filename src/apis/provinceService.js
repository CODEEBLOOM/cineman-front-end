import axios from '@apis/axiosClient';

/**
 * Fetches all provinces from the server
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the response of the GET request
 */
export const findAll = async () => {
  const url = '/admin/province/all';
  return await axios.get(url);
};
