import axios from '@apis/axiosClient';

export const register = async (data) => {
  return await axios.post('/auth/register', data);
};

export const login = async (data) => {
  return await axios.post('/auth/login', data);
};

export const forgotPassword = async (data) => {
  return await axios.post('/auth/forgot-password', data);
};

export const resetPassword = async (data) => {
  return await axios.post('/auth/reset-password', data);
};

export const loginWithGoogle = async () => {
  return await axios.get('/auth/social-login', {
    params: {
      login_type: 'google',
    },
  });
};

export const socialCallback = async (code) => {
  return await axios.get('/auth/social/callback', {
    params: {
      code,
      login_type: 'google',
    },
  });
};

export const logout = async () => {
  return await axios.post('/auth/logout');
};
