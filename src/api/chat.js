import axios from 'axios';
import { API_CONFIG } from '../core/config/apiConfig';
import { getAccessToken } from '../utils/token';

export const getChatHistory = async (limit = 50, offset = 0) => {
  const token = getAccessToken();
  const response = await axios.get(`${API_CONFIG.chatBaseUrl}/chats`, {
    params: { limit, offset },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
