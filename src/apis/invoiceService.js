import axios from '@apis/axiosClient';

export const findInvoiceByUserIdAndShowTimeId = async (userId, showTimeId) => {
  const url = `/invoice/user/${userId}/show-time/${showTimeId}`;
  return await axios.get(url);
};

/**
 * Tạo hóa đơn cho khách hàng - Trạng thái PEDDING
 * @param {Object} data - thống tin hóa đơn
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const create = async ({ email, phoneNumber, customerId, staffId }) => {
  const url = `/invoice/add`;
  return await axios.post(url, { email, phoneNumber, customerId, staffId });
};

export const update = async (data) => {
  const url = `/invoice/${data.id}/update`;
  return await axios.put(url, data);
};

/**
 * Cập nhật giao dịch id VNPay cho hóa đơn
 * @param {Object} data - Thông tin hóa đơn
 * @param {number} data.invoiceId - Id của hóa đơn
 * @param {string} data.txnRef - Mã giao dịch VNPay
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateIxnRef = async ({ invoiceId, txnRef, promotionId }) => {
  const url = `/invoice/${invoiceId}/update-tnx`;
  return await axios.put(
    url,
    {},
    {
      params: {
        txnRef,
        promotionId,
      },
    }
  );
};

export const updateInvoiceStatusSuccess = async ({ id }) => {
  const url = `/invoice/${String(id)}/update-status-success`;
  return await axios.put(url);
};
