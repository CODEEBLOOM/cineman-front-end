import axios from '@apis/axiosClient';

/**
 *  Lấy tất cả phòng chiếu của hệ thống
 * @returns
 */
export const findAllMovieTheater = async () => {
  const url = '/admin/movie-theater/all';
  return await axios.get(url);
};
