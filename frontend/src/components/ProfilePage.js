// frontend/src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import api from '../utils/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/')
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
        Личный кабинет
      </Typography>
      {userData && (
        <>
          <Typography>Имя пользователя: {userData.username}</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Номер читательского билета: {userData.reader.card_number}</Typography>
        </>
      )}
    </Container>
  );
};

export default ProfilePage;