import axios from '@apis/axiosClient';

/**
 * Tạo mới 1 ghế
 * @param {Object} data - thông tin ghế cần tạo
 * @param {string} data.seatType - ID loại ghế
 * @param {number} data.rowIndex - chỉ số hàng của ghế
 * @param {number} data.columnIndex - chỉ số cột của ghế
 * @param {string} data.label - nhãn của ghế
 * @param {number} data.cinemaTheaterId - ID của phòng chiếu chứa ghế
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const create = async (data) => {
  const url = `/admin/seat/add`;
  return await axios.post(url, data);
};

/**
 * Tạo hàng loạt ghế mới
 * @param {Object[]} data - danh sách thông tin ghế cần tạo
 * @param {string} data[].seatType - ID loại ghế
 * @param {number} data[].rowIndex - chỉ số hàng của ghế
 * @param {number} data[].columnIndex - chỉ số cột của ghế
 * @param {string} data[].label - nhãn ghế
 * @param {number} data[].cinemaTheaterId - ID của phòng chiếu chứa ghế
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const createMul = async (data) => {
  const url = `/admin/seat/add-mul`;
  return await axios.post(url, data);
};

/**
 * Xóa 1 ghế
 * @param {number} id - id của ghế
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteSeat = async (id) => {
  const url = `/admin/seat/${id}/delete`;
  return await axios.delete(url);
};

/**
 * Xóa hàng loạt ghế
 * @param {Object} data - danh sách id ghế
 * @returns
 */
export const deleteMulSeat = async (data) => {
  const url = `/admin/seat/delete-mul`;
  return await axios.delete(url, {
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Thay đôi trạng thái của ghế Active <==> Inactive
 * và chỉ dành cho những rạp chiếu đã được xuất bản
 * @param {number} id - ID of the seat to change the status.
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const changeStatusSeat = async (id) => {
  const url = `/admin/seat/${id}/change-status`;
  return await axios.put(url);
};
