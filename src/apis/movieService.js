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

export const findAllByFilter = async ({
  page,
  size,
  status,
  movieTheaterId,
}) => {
  const url = `/movie/movie-theater/${movieTheaterId}`;
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

export const addMovie = async (data) => {
  const url = `/admin/movie/add`;
  return await axios.post(url, data);
};

export const updateMovie = async (data) => {
  const url = `/admin/movie/update`;
  return await axios.put(url, data);
};

export const deleteMovie = async (id) => {
  const url = `/admin/movie/${id}/delete`;
  return await axios.delete(url);
};

export const findAllByFilterAdmin = async ({ page = 0, size = 10, status }) => {
  const url = '/admin/movie/all';
  return await axios.get(url, {
    params: {
      page,
      size,
      status,
    },
  });
};
