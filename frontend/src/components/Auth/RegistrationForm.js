import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { registerUser, loginUser } from '../../utils/api';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Регистрация
      await registerUser(formData);

      // Автоматический вход после регистрации
      const { data } = await loginUser({
        username: formData.username,
        password: formData.password
      });

      // Сохраняем токены
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Обновляем интерфейс
      window.dispatchEvent(new Event('auth-change'));

      // Редирект
      navigate('/', { replace: true });

    } catch (err) {
      setError('Ошибка регистрации: ' + (err.response?.data?.username?.[0] || ''));
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4">Регистрация</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Имя пользователя"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Зарегистрироваться
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrationForm;