import axios from 'axios';
import cookies from 'js-cookie';

/**
 * Custom base axios for
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  // timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  function (config) {
    //TODO: cần phải gắn access token vào đây
    const localData = JSON.parse(localStorage.getItem('persist:root'));
    if (localData.auth !== null) {
      const auth = JSON.parse(localData.auth);
      if (auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    // TODO: Cần phải refresh token nếu access token hết hạn và trả vể mã lỗi 401
    console.log(error);
    const originalRequest = error.config;
    if (error.response.status === 401 || !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        debugger;
        // const res = await axiosClient.post('/auth/refresh-token', {});
        const res = await axios.post(
          `${import.meta.env.VITE_HOST}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        console.log(res);

        // Cập nhật lại accessToken trong localStorage
        const localData = localStorage.getItem('persist:root');
        if (localData) {
          const parsedData = JSON.parse(localData);
          if (parsedData.auth) {
            const auth = JSON.parse(parsedData.auth);
            auth.accessToken = res.data.accessToken;
            parsedData.auth = JSON.stringify(auth);
            localStorage.setItem('persist:root', JSON.stringify(parsedData));
          }
        }

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        cookies.remove('refreshToken');
        localStorage.removeItem('persist:root');
        return Promise.reject(error);
      }
    }
  }
);

export default axiosClient;
