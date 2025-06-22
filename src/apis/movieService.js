import axios from '@apis/axiosClient';

/**
 * Hàm lấy tất cả bộ phim có phần trang và status
 * @param {*} param thông tin query
 * @returns
 */
export const findAllMovies = async ({ page, size, status }) => {
  const url = '/movie/all';
  return await axios.get(url, {
    params: {
      page,
      size,
      status,
    },
  });
};

/**
 * API lấy tất cả thông tin của một bộ phim theo id
 * @param {*} id id của bộ phim
 * @returns
 */
export const findMovieById = async (id) => {
  const url = `/movie/${id}`;
  return await axios.get(url);
};
