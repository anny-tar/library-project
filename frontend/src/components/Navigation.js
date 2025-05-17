import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // Для отслеживания завершения проверки авторизации
  const navigate = useNavigate();

  // Проверка статуса авторизации и подписка на события
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
      setAuthChecked(true); // Помечаем проверку как завершенную
    };

    checkAuth(); // Первоначальная проверка

    // Слушатели событий
    const handleAuthChange = () => checkAuth();
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', checkAuth); // Для синхронизации между вкладками

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.dispatchEvent(new CustomEvent('auth-change')); // Форсируем обновление
    navigate('/');
  };

  // Показываем лоадер до завершения проверки авторизации
  if (!authChecked) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Основные ссылки */}
          <Button component={Link} to="/" color="inherit" sx={{ mr: 2 }}>
            Главная
          </Button>

          <Button component={Link} to="/books" color="inherit" sx={{ mr: 2 }}>
            Книги
          </Button>

          {/* Условный рендеринг */}
          <div style={{ marginLeft: 'auto' }}>
            {isLoggedIn ? (
              <>
                <Button
                  component={Link}
                  to="/profile"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Кабинет
                </Button>
                <Button
                  onClick={handleLogout}
                  color="inherit"
                  variant="outlined"
                >
                  Выход
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Вход
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  color="inherit"
                  variant="outlined"
                >
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;