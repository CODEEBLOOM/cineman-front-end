import axios from '@apis/axiosClient';

/**
 * lay toan bo danh sach lich chieu theo movieId va movieTheaterId
 * @param {number} param.movieId - id bo phim
 * @param {number} param.movieTheaterId - id rap chieu
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
 * @param {number} param.movieId - ID cua bo phim chieu
 * @param {number} param.movieTheaterId - ID cua rap chieu
 * @param {string} param.showDate - Ngay chieu
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
 * Lay chi tiet thong tin lich chieu theo id lich chieu
 * @param {number} id - id cua lich chieu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the showtime details.
 */
export const findById = async (id) => {
  const url = `/show-times/${id}`;
  return await axios.get(url);
};

/**
 * Lay tat ca cac ngay chieu phim cua rap chieu theo id rap chieu
 * @param {number} id - ID cua rap chieu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the array of show dates in featured.
 */
export const findAllShowDateByCinemaTheaterIdInFeatured = async (id) => {
  const url = `/show-times/cinema-theater/${id}`;
  return await axios.get(url);
};

/**
 * Lay tat ca cac phim chieu tai rap chieu theo id rap chieu va ngay chieu
 * @param {number} cinemaTheaterId - ID cua rap chieu
 * @param {string} showDate - Ngay chieu
 * @returns {Promise<axios.AxiosResponse<any>>} A promise that resolves to the movies list.
 */
export const findAllMovieByCinemaTheaterIdAndShowDate = async (
  cinemaTheaterId,
  showDate
) => {
  const url = `/show-times/cinema-theater/${cinemaTheaterId}/show-date/${showDate}`;
  return await axios.get(url);
};

export const findAll = async () => {
  const url = '/admin/show-time/all';
  return await axios.get(url);
};

export const findAllAdminShowTimes = async ({
  movieTheaterId = '',
  showDate = '',
  showTimeStatus = '',
} = {}) => {
  const url = '/admin/show-time/all';
  return await axios.get(url, {
    params: {
      movieTheaterId: movieTheaterId || undefined,
      showDate: showDate || undefined,
      showTimeStatus: showTimeStatus || undefined,
    },
  });
};

export const findAdminShowTimeById = async (id) => {
  const url = `/admin/show-time/${id}`;
  return await axios.get(url);
};

export const findOccupiedSlotsByCinemaTheaterId = async (id, showDate) => {
  const url = `/admin/show-time/cinema-theater/${id}/occupied-slots`;
  return await axios.get(url, {
    params: {
      showDate,
    },
  });
};

export const addShowTime = async (data) => {
  const url = '/admin/show-time/add';
  return await axios.post(url, data);
};

export const updateShowTime = async (id, data) => {
  const url = `/admin/show-time/${id}/update`;
  return await axios.put(url, data);
};

export const deleteShowTime = async (id) => {
  const url = `/admin/show-time/${id}/delete`;
  return await axios.delete(url);
};
