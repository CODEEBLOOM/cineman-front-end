import axios from '@apis/axiosClient';

/**
 * Tạo hóa đơn cho khách hàng - Trạng thái PEDDING
 * @param {Object} data - thống tin hóa đơn
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const create = async ({ email, phoneNumber, customerId, staffId }) => {
  const url = '/invoice/add';
  return await axios.post(url, { email, phoneNumber, customerId, staffId });
};
