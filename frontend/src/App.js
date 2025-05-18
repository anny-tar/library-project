import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import BookList from './components/BookList';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import Navigation from './components/Navigation';
import ProfilePage from './components/ProfilePage';
import BookDetailPage from './components/BookDetailPage';
import HomePage from './components/HomePage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<HomePage />} />

          {/* Страница с книгами */}
          <Route path="/books" element={<BookList />} />

          {/* Авторизация */}
          <Route path="/login" element={<GuestRoute><LoginForm /></GuestRoute>} />

          {/* Регистрация */}
          <Route path="/register" element={<GuestRoute><RegistrationForm /></GuestRoute>} />

          {/* Личный кабинет */}
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route path="/books/:id" element={<BookDetailPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;