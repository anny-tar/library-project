import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Обновление состояния при изменении localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Слушатель событий для обновления состояния
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new Event('auth-change')); // Триггер обновления
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Button component={Link} to="/" color="inherit">Главная</Button>
          <Button component={Link} to="/books" color="inherit">Книги</Button>
          {isLoggedIn ? (
            <>
              <Button component={Link} to="/profile" color="inherit">Кабинет</Button>
              <Button onClick={handleLogout} color="inherit">Выход</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">Вход</Button>
              <Button component={Link} to="/register" color="inherit">Регистрация</Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;