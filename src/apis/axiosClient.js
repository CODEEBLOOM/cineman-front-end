import axios from 'axios'

/**
 * Custom base axios for
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use(function (config) {
    //TODO: cần phải gắn access token vào đây
  return config;
}, function (error) {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use(function (response) {
  if(response && response.data){
    return response.data;
  }
  return response;
}, function (error) {
  if(error && error.response && error.response.data){
    return error.response.data;
  }
  return Promise.reject(error);
});

export default axiosClient;