import axios from '@apis/axiosClient';

/**
 * Tạo mới lịch sử điểm của người dùng
 * @param {Object} data - thông tin lịch sử điểm người dùng
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createUserHistoryPoint = async (data) => {
  return axios.post(`/user-point-history/add`, data);
};

/**
 * Hoàn trả điểm cho người dùng khi thanh toán không thành công hoặc api dùng để tích lũy điểm cho hóa đơn
 * @param {string} vnTxnRef - Mã giao dịch VNPay
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const refundUserHistoryPoint = async (vnTxnRef) => {
  return axios.get(`/user-point-histories/refund/${vnTxnRef}`);
};
