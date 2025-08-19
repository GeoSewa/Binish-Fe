/* eslint-disable no-param-reassign */
import axios, { AxiosInstance } from "axios";

// Use the GeoSewa API base URL
export const baseURL = "https://sujanadh.pythonanywhere.com/api";

export const api = axios.create({
  baseURL: baseURL,
  timeout: 5 * 60 * 1000,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const formDataAPI = axios.create({
  baseURL: baseURL,
  timeout: 5 * 60 * 1000,
  headers: {
    accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

export const authenticated = (apiInstance: AxiosInstance) => {
  const token = localStorage.getItem("token");
  if (!token) return apiInstance;
  if (process.env.NODE_ENV === "development") {
    apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    apiInstance.defaults.withCredentials = false;
  }
  return apiInstance;
};

// Add a request interceptor to always use the latest access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
