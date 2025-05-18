// frontend/src/components/HomePage.js
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom>
        Добро пожаловать в библиотеку
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          О нашей библиотеке
        </Typography>
        <Typography paragraph>
          Мы предлагаем широкий выбор книг различных жанров.
          Зарегистрируйтесь, чтобы получить доступ к полному каталогу
          и возможности оставлять отзывы.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;