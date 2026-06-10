import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data?.error;
    if (apiError) {
      return Promise.reject({
        code: apiError.code,
        message: apiError.message,
        status: error.response.status,
      });
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
      status: 0,
    });
  }
);

export default apiClient;
