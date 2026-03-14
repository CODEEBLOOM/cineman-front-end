import axios from '@apis/axiosClient';

export const createMultiple = async (data) => {
  const url = `/detail-booking-snack/create-multiple`;
  return await axios.put(url, data);
};

export const updateMultiple = async (data) => {
  const url = `/detail-booking-snack/update-multiple`;
  return await axios.put(url, data);
};

/**
 * Clear all snack booking detail for given invoice id
 * @param {string} invoiceId - Invoice id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const clearMultiple = async (invoiceId) => {
  const url = `/detail-booking-snack/invoice/${invoiceId}/clear-multiple`;
  return await axios.delete(url);
};
