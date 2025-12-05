import axios from 'axios';

export const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    if (error.response?.status === 404) {
    }
    return Promise.reject(error);
  }
);

export default apiClient;
