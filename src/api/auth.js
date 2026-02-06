import axios from 'axios';
import { API_CONFIG } from '../core/config/apiConfig';
import {
  saveAccessToken,
  saveRefreshToken,
  saveUserId,
  clearTokens,
} from '../utils/token';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_CONFIG.authBaseUrl}/login`, {
      email,
      password,
    });

    if (response.data.status === 'success') {
      const { accessToken, token, refreshToken, id, user } = response.data.data;
      const finalAccessToken = accessToken || token;
      const finalUserId = id || (user ? user.id : null);

      saveAccessToken(finalAccessToken);
      if (refreshToken) {
        saveRefreshToken(refreshToken);
      }
      if (finalUserId) {
        saveUserId(finalUserId);
      }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_CONFIG.authBaseUrl}/register`, {
      name,
      email,
      password,
    });

    if (response.data.status === 'success') {
      const { accessToken, token, refreshToken, id, user } = response.data.data;
      const finalAccessToken = accessToken || token;
      const finalUserId = id || (user ? user.id : null);

      saveAccessToken(finalAccessToken);
      if (refreshToken) {
        saveRefreshToken(refreshToken);
      }
      if (finalUserId) {
        saveUserId(finalUserId);
      }
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logout = () => {
  clearTokens();
};
