import { axiosInstance } from './request';

export const setAxiosToken = (token) => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const deleteAxiosToken = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
};
