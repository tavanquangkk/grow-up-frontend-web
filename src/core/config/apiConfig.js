const DEV_SERVER_IP = 'localhost';
const SERVER_PORT = '8080';

export const API_CONFIG = {
  baseUrl: `http://${DEV_SERVER_IP}:${SERVER_PORT}`,
  authBaseUrl: `http://${DEV_SERVER_IP}:${SERVER_PORT}/api/v1/auth`,
  workshopBaseUrl: `http://${DEV_SERVER_IP}:${SERVER_PORT}/api/v1`,
  chatBaseUrl: `http://${DEV_SERVER_IP}:8081`,
  wsBaseUrl: `ws://${DEV_SERVER_IP}:8081`,
};
