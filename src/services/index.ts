/* eslint-disable no-param-reassign */
import axios, { AxiosInstance } from "axios";

// Use the GeoSewa API base URL
export const baseURL = "https://sujanadh.pythonanywhere.com/api";

export const api = axios.create({
  baseURL: baseURL,
  timeout: 30 * 1000, // Reduced from 5 minutes to 30 seconds for faster failure detection
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

// Add request interceptor for formDataAPI
formDataAPI.interceptors.request.use(
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

// Add a response interceptor to handle 401 errors and refresh tokens
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        // No refresh token available, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        processQueue(error, null);
        isRefreshing = false;
        window.dispatchEvent(new Event("authChanged"));
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${baseURL}/user/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;

        if (access) {
          localStorage.setItem("token", access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          processQueue(null, access);
          isRefreshing = false;
          return api(originalRequest);
        } else {
          throw new Error("No access token in refresh response");
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        processQueue(refreshError, null);
        isRefreshing = false;
        window.dispatchEvent(new Event("authChanged"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);