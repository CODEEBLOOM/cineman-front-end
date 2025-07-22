import axios from '@apis/axiosClient';

/**
 *  Lấy tất cả vé của một lịch chiếu phim
 * @param {{ showTimeId: number }} param - ShowTime id của lịch chiếu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the ticket list.
 */
export const getAllTicketByShowTime = async ({ userId, showTimeId }) => {
  const url = `/ticket/show-time/${showTimeId}/user/${userId}/all`;
  return await axios.get(url);
};
