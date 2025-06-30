import axios from '@apis/axiosClient';

/**
 *  Lấy tất cả loại phòng chiếu của hệ thống
 * @returns
 */
export const findAll = async () => {
  const url = '/admin/cinema-type/all';
  return await axios.get(url);
};
