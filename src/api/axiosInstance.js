import axios from 'axios';
import { API_CONFIG } from '../core/config/apiConfig';
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearTokens,
} from '../utils/token';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.workshopBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        clearTokens();
        // You might want to redirect to login page here or use a callback
        // window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_CONFIG.authBaseUrl}/refresh`, {
          refreshToken: refreshToken,
        });

        const { token, refreshToken: newRefreshToken, accessToken: newAccessToken } = response.data.data;
        const finalAccessToken = newAccessToken || token;
        const finalRefreshToken = newRefreshToken || refreshToken;

        saveAccessToken(finalAccessToken);
        if (newRefreshToken) {
          saveRefreshToken(finalRefreshToken);
        }

        processQueue(null, finalAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${finalAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        clearTokens();
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
