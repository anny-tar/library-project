import axios from 'axios';

// Создание экземпляра axios с базовыми настройками
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Интерцептор для автоматической подстановки токена в заголовки
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api/'}token/refresh/`,
          { refresh: refreshToken }
        );

        // Сохраняем новый access-токен
        localStorage.setItem('access_token', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Если обновление токена не удалось - разлогиниваем
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new CustomEvent('auth-change'));
        return Promise.reject(refreshError);
      }
    }

    // Для всех других ошибок
    return Promise.reject(error);
  }
);

// API методы
export const registerUser = async (userData) => {
  return await api.post('register/', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('token/', credentials);
};

export const getCurrentUser = async () => {
  return await api.get('users/me/');
};

export default api;