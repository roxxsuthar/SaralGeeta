// Global request object.

import axios from 'axios';
import handleError from './handleError';
// import { getRequest } from './firebaseTraceRequest';

export const axiosInstance = axios.create({
  responseType: 'json',
});

axiosInstance.interceptors.request.use(
  config => {
    // console.log('REQUEST: ', config);
    // getRequest(config?.url, config?.method);
    config.headers.deviceType = 'mobile';
    return config;
  },
  err => Promise.reject(err),
);

axiosInstance.interceptors.response.use(
  response => {
    // console.log('RESPONSE: ', response);
    if (response.data) {
      return response.data;
    }
    return response;
  },
  err => {
    handleError(err);
    return Promise.reject(err);
  },
);

export default function request(options) {
  return axiosInstance(options);
}
