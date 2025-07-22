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
 * get url Đăng nhập bằng google
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const loginWithGoogle = async () => {
  const url = '/auth/social-login';
  return await axios.get(url, {
    params: {
      login_type: 'google',
    },
  });
};

/**
 * Xác thực callback của google sau khi user cho phép app
 * @param {string} code mã code được gửi lại sau khi user cho phép
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const socialCallback = async (code) => {
  const url = '/auth/social/callback';
  return await axios.get(url, {
    params: {
      code,
      login_type: 'google',
    },
  });
};

/**
 * Đăng xuất tài khoản
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const logout = async () => {
  const url = '/auth/logout';
  return await axios.post(url);
};
