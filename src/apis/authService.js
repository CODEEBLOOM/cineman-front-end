import axios from '@apis/axiosClient';

/**
 * Hàm gọi api đăng kí tài khoản người dùng
 * @param {*} data thông tin người dùng
 */
export const register = async (data) => {
  const url = '/auth/register';
  return await axios.post(url, data);
};

export const login = async (data) => {
  const url = '/auth/login';
  return await axios.post(url, data);
};
