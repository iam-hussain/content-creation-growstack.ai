import axios from 'axios';

import env from '@/providers/env-config';

const apiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.CHATGPT_API_KEY}`,
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
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
