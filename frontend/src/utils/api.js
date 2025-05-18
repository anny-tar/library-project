import axios from 'axios';

// Настройка базового URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api/'
    : '/api/', // Для продакшена
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для автоматической подстановки токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Обновление токена при 401 ошибке
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      try {
        const { data } = await axios.post('token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', data.access);
        return api(originalRequest);
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth-change'));
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = data => api.post('register/', data);
export const loginUser = data => api.post('token/', data);
export const getCurrentUser = () => api.get('users/me/');
export default api;