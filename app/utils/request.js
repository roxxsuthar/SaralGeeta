// Global request object.

import axios from 'axios';
import handleError from './handleError';

export const axiosInstance = axios.create({
  responseType: 'json',
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.deviceType = 'mobile';
    return config;
  },
  (err) => Promise.reject(err),
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('RESPONSE: ', response);
    if (response) {
      return response.data;
    }
    return response.data;
  },
  (err) => {
    handleError(err);
    return Promise.reject(err);
  },
);

export default function request(options) {
  return axiosInstance(options);
}
