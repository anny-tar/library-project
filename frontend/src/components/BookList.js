import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  CardMedia,
  Chip,
  Grid,
  Alert,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books/');
        setBooks(response.data);
      } catch (err) {
        setError('Ошибка загрузки книг');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ p: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
        Каталог книг
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {books.map(book => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              onClick={() => handleBookClick(book.id)}
              sx={{
                width: 280,
                height: 420,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 4,
                  '& .MuiCardContent-root': {
                    backgroundColor: 'action.hover'
                  }
                }
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  height: 240,
                  width: 280,
                  objectFit: 'cover',
                  flexShrink: 0
                }}
                image={book.cover_image || '/default-cover.jpg'}
                alt={book.title}
              />

              <CardContent sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: 2
              }}>
                {/* Заголовок с многострочным переносом */}
                <Typography
                  gutterBottom
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.2,
                    minHeight: '3.6em',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word'
                  }}
                >
                  {book.title || 'Без названия'}
                </Typography>

                {/* Информация об авторе */}
                <Box sx={{ mb: 1, flexShrink: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Автор: {book.author?.name || 'Не указан'}
                  </Typography>
                </Box>

                {/* Статус книги */}
                <Box sx={{ mt: 'auto', pt: 1 }}>
                  <Chip
                    label={book.is_available ? 'Доступна' : 'На руках'}
                    color={book.is_available ? 'success' : 'error'}
                    size="small"
                    sx={{
                      width: '100%',
                      maxWidth: 120,
                      mx: 'auto',
                      fontWeight: 500
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList;