import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import api from '../utils/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('users/me/');
        setUserData(data);
      } catch (err) {
        setError('Ошибка загрузки профиля');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Профиль пользователя
      </Typography>
      <Typography>Имя: {userData.username}</Typography>
      <Typography>Email: {userData.email || 'не указан'}</Typography>
      {userData.reader && (
        <Typography>
          Читательский билет: {userData.reader.card_number}
        </Typography>
      )}
    </Container>
  );
};

export default ProfilePage;