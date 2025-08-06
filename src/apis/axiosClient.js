import axios from 'axios';
import { setAccessToken, clearInfoAuth } from '@redux/slices/authSlice';

let store; // sẽ được inject sau
export const injectStore = (_store) => {
  store = _store;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const { auth } = store.getState();
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_HOST}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;

        // Cập nhật accessToken trong Redux store
        store.dispatch(setAccessToken(newAccessToken));

        // Gắn token mới vào request ban đầu rồi gọi lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        store.dispatch(clearInfoAuth());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
