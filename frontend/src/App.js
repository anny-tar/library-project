// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import Navigation from './components/Navigation';
import ProfilePage from './components/ProfilePage';
import BookDetailPage from './components/BookDetailPage'; // Добавлен импорт
import Dashboard from './components/Dashboard'; // Убедитесь в правильности импорта

// Защищенные маршруты
const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// Обратные маршруты
const GuestRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return !isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Главная страница */}
        <Route path="/login" element={<GuestRoute element={<LoginForm />} />} />
        <Route path="/register" element={<GuestRoute element={<RegistrationForm />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        <Route path="/books" element={<BookList />} /> {/* Список книг */}
        <Route path="/books/:id" element={<BookDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;