import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Chip,
  CardMedia,
  Box,
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/books/${id}/`)
      .then(response => {
        setBook(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки:', error);
        setLoading(false);
      });
  }, [id]);

  const renderDetailRow = (label, value) => {
    if (!value) return null;
    return (
      <>
        <Typography variant="subtitle1" mt={2}>
          <strong>{label}:</strong> {value}
        </Typography>
        <Divider sx={{ my: 1 }} />
      </>
    );
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            src={book.cover_image || '/default-cover.jpg'}
            alt={book.title}
            sx={{
              maxHeight: 400,
              objectFit: 'contain'
            }}
          />
        </Box>

        <Box sx={{ flex: 2 }}>
          <Typography variant="h3" gutterBottom>
            {book.title}
          </Typography>

          <Chip
            label={book.is_available ? 'Доступна' : 'На руках'}
            color={book.is_available ? 'success' : 'error'}
            sx={{ mb: 2 }}
          />

          {renderDetailRow('Автор', book.author.name)}
          {renderDetailRow('Рейтинг', book.rating)}
          {renderDetailRow('Возрастные ограничения', book.age_rating)}
          {renderDetailRow('Жанры', book.genres.map(g => g.name).join(', '))}

          {book.epigraph && (
            <>
              <Typography variant="body1" fontStyle="italic" mt={2}>
                "{book.epigraph}"
              </Typography>
              <Divider sx={{ my: 2 }} />
            </>
          )}

          {renderDetailRow('Издательство', book.publisher)}
          {renderDetailRow('Переводчик', book.translator)}
          {renderDetailRow('Количество страниц', book.page_count)}
          {renderDetailRow('Дата создания', new Date(book.creation_date).toLocaleDateString())}
          {renderDetailRow('Дата публикации', new Date(book.publication_date).toLocaleDateString())}
          {renderDetailRow('Правообладатель', book.copyright_holder)}
        </Box>
      </Box>
    </Container>
  );
};

export default BookDetailPage;