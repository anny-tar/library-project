from django.db import models
from django.contrib.auth.models import User

class Author(models.Model):
    name = models.CharField(max_length=200, verbose_name="Имя автора")

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100, verbose_name="Жанр")

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=300, verbose_name="Название")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, verbose_name="Автор")
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, verbose_name="Жанр")
    publication_date = models.DateField(verbose_name="Дата публикации")
    rating = models.FloatField(default=0.0, verbose_name="Рейтинг")
    is_available = models.BooleanField(default=True, verbose_name="Доступна")

    def __str__(self):
        return f"{self.title} ({self.author})"

class Reader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    card_number = models.CharField(max_length=20, unique=True, verbose_name="Номер читательского билета")
    registration_date = models.DateField(auto_now_add=True, verbose_name="Дата регистрации")

    def __str__(self):
        if self.user:
            return f"{self.user.username} ({self.card_number})"
        return f"Reader (no user)"

class BookLoan(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, verbose_name="Книга")
    reader = models.ForeignKey(Reader, on_delete=models.CASCADE, verbose_name="Читатель")
    loan_date = models.DateField(auto_now_add=True, verbose_name="Дата выдачи")
    return_date = models.DateField(null=True, blank=True, verbose_name="Дата возврата")

    def __str__(self):
        return f"{self.book} → {self.reader}"

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, verbose_name="Книга")
    reader = models.ForeignKey(Reader, on_delete=models.CASCADE, verbose_name="Читатель")
    rating = models.PositiveSmallIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        verbose_name="Оценка"
    )
    comment = models.TextField(verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата отзыва")

    def __str__(self):
        return f"{self.reader} → {self.book}: {self.rating}/5"