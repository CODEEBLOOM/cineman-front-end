import axios from '@apis/axiosClient';

/**
 * lấy toàn bộ danh sách lịch chiếu theo movieId va  movieTheaterId
 * @param {number} param.movieId - id bộ phim
 * @param {number} param.movieTheaterId - id rạp chiếu
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const findAllShowTimeByMovieIdAndMovieTheaterId = async ({
  movieId,
  movieTheaterId,
}) => {
  const url = `/show-times/movie/${movieId}/movie-theater/${movieTheaterId}`;
  return await axios.get(url);
};

/**
 * Fetches showtime details for a specific movie at a particular theater on a given date.
 * @param {number} param.movieId - ID của bộ phim chiếu
 * @param {number} param.movieTheaterId - ID của rạp chiếu
 * @param {string} param.showDate - Ngày chiếu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the showtime details.
 */
export const getShowTimeDetail = async ({
  movieId,
  movieTheaterId,
  showDate,
}) => {
  const url = `show-times/movie/${movieId}/movie-theater/${movieTheaterId}/by-date`;
  return await axios.get(url, {
    params: {
      showDate,
    },
  });
};

/**
 * Lấy chi tiết thông tin lịch chiếu theo id lịch chiếu
 * @param {number} id - id cua lich chieu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the showtime details.
 */
export const findById = async (id) => {
  const url = `/show-times/${id}`;
  return await axios.get(url);
};
