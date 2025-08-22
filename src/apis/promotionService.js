import axios from '@apis/axiosClient';

/**
 * Sử dụng voucher
 * @param {string} code - Code của voucher
 * @param {number} amount - Tổng tiền của ticket
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const applyVoucher = async ({ code, amount }) => {
  const url = `/promotion/${code}/amount/${amount}/apply`;
  return await axios.put(url);
};

/**
 * Hủy sử dụng voucher
 * @param {number} id - Id của voucher
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const cancelApplyVoucher = async (id) => {
  const url = `/promotion/${id}/cancel`;
  return await axios.put(url);
};

/**
 * Cập nhật số lượng voucher --> người dùng thanh toán thất bại
 * @param {number} id - Id của voucher
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const revertApplyVoucher = async (vnp_TxnRef) => {
  const url = `/promotion/revert-quantity/invoice/${vnp_TxnRef}`;
  return await axios.put(url);
};

export const findAllPromotions = async (userId) => {
  const url = `/promotion/user/${userId}/all`;
  return await axios.get(url);
};
