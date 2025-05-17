import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { loginUser } from '../../utils/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Автоматический редирект для авторизованных пользователей
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/', { replace: true }); // Блокировка возврата на страницу входа
    }
  }, [navigate]);

  // Обработчик изменений в полях формы
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await loginUser(formData);

      // Сохранение токенов
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Принудительное обновление навигации
      window.dispatchEvent(new CustomEvent('auth-change'));

      // Перенаправление с заменой истории
      navigate('/', { replace: true });

    } catch (error) {
      let errorMessage = 'Ошибка сервера';
      if (error.response) {
        errorMessage = error.response.data.detail || 'Неверные учетные данные';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Вход в систему
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Имя пользователя"
            name="username"
            variant="outlined"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            autoComplete="username"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            type="password"
            name="password"
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            autoComplete="current-password"
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3 }}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;