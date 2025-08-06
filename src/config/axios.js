import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ecommerce.qafdev.com',
  timeout: 10000,
});

const guestApi = axios.create({
  baseURL: 'https://api.ecommerce.qafdev.com',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { guestApi };
export default api;