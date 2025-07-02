import axios from '@apis/axiosClient';

/**
 * Lấy toàn bộ seat map của hệ thống
 * @returns
 */
export const findAll = async ({ page, size, status }) => {
  const url = '/admin/cinema-theater/all';
  return await axios.get(url, {
    params: {
      page,
      size,
      status,
    },
  });
};

export const findById = async (id) => {
  const url = `/admin/cinema-theater/${id}`;
  return await axios.get(url);
};

export const create = async (data) => {
  const url = `/admin/cinema-theater/add`;
  return await axios.post(url, data);
};

export const update = async ({ id, data }) => {
  const url = `/admin/cinema-theater/${id}/update`;
  return await axios.put(url, data);
};

export const deleteCinemaTheater = async (id) => {
  const url = `/admin/cinema-theater/${id}/delete`;
  return await axios.delete(url);
};

export const getSeatMap = async (id) => {
  const url = `/admin/cinema-theater/${id}/seat-map`;
  return await axios.get(url);
};

export const published = async (id) => {
  const url = `/admin/cinema-theater/${id}/published`;
  return await axios.put(url);
};
