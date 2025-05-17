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
import { registerUser } from '../../utils/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Автоматический редирект для авторизованных пользователей
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/', { replace: true });
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

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        username: formData.username,
        password: formData.password,
        email: formData.email
      });

      // Триггерим обновление навигации
      window.dispatchEvent(new CustomEvent('auth-change'));

      // Перенаправляем на страницу входа
      navigate('/login', { replace: true });

    } catch (error) {
      let errorMessage = 'Ошибка регистрации';
      if (error.response) {
        // Обработка ошибок валидации Django
        errorMessage = Object.values(error.response.data)
          .flat()
          .join(', ') || errorMessage;
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
          Регистрация
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
            required
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
            required
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Подтверждение пароля"
            type="password"
            name="confirmPassword"
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            autoComplete="email"
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
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrationForm;