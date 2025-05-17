import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress
} from '@mui/material';
import api from '../utils/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/books/')
      .then(response => {
        setBooks(response.data);
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
        Список книг
      </Typography>
      <Grid container spacing={3}>
        {books.map(book => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {book.title}
                </Typography>
                <Typography color="text.secondary">
                  Автор: {book.author.name}
                </Typography>
                <Typography variant="body2">
                  Жанр: {book.genre.name}
                </Typography>
                <Typography variant="body2">
                  Год публикации: {new Date(book.publication_date).getFullYear()}
                </Typography>
                <Typography variant="body2">
                  Рейтинг: {book.rating}/5
                </Typography>
                <Typography
                  color={book.is_available ? 'success.main' : 'error.main'}
                >
                  {book.is_available ? 'Доступна' : 'На руках'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList;