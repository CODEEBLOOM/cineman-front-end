import axios from '@apis/axiosClient';

/**
 * Fetches all snack types from the server
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the response of the GET request
 */
export const getAllSnackType = () => {
  return axios.get('/snack-type/all');
};
