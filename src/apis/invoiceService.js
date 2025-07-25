import axios from '@apis/axiosClient';

/**
 * Tạo hóa đơn cho khách hàng - Trạng thái PEDDING
 * @param {Object} data - thống tin hóa đơn
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const create = async (
  { email, phoneNumber, customerId, staffId },
  showTimeId
) => {
  const url = `/invoice/show-time/${showTimeId}/add`;
  return await axios.post(url, { email, phoneNumber, customerId, staffId });
};

export const update = async (data) => {
  const url = `/invoice/${data.id}/update`;
  return await axios.put(url, data);
};
