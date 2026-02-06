import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';

export const saveAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const saveRefreshToken = (token) => {
  // Save to cookies. expires in 7 days for example, adjust as needed.
  Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = () => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};

export const saveUserId = (userId) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};

export const clearTokens = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUserId();
};
