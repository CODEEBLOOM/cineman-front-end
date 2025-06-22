import axios from '@apis/axiosClient';

/**
 * Hàm gọi api đăng kí tài khoản người dùng
 * @param {*} data thông tin người dùng
 */
export const register = async (data) => {
  const url = '/auth/register';
  return await axios.post(url, data);
};

/**
 * Login tài khoản
 * @param data dữ liệu người dùng {email và password}
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const login = async (data) => {
  const url = '/auth/login';
  return await axios.post(url, data);
};

/**
 * Đăng xuất tài khoản
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const logout = async () => {
  const url = '/auth/logout';
  return await axios.post(url);
};
