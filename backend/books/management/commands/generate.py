# backend/books/management/commands/generate.py
from django.core.management.base import BaseCommand
from books.models import Author, Genre, Book
from faker import Faker
import random

fake = Faker('ru_RU')


class Command(BaseCommand):
    help = 'Generate test data for books'

    def add_arguments(self, parser):
        parser.add_argument('count', type=int, help='Number of books to create')

    def handle(self, *args, **options):
        count = options['count']

        # Создаем авторов
        authors = [Author.objects.create(name=fake.name()) for _ in range(5)]

        # Создаем жанры
        genres = [Genre.objects.create(name=fake.word().capitalize()) for _ in range(5)]

        # Возрастные рейтинги
        age_ratings = ['0+', '6+', '12+', '16+', '18+']

        # Генерируем книги
        for _ in range(count):
            Book.objects.create(
                title=fake.sentence(nb_words=3),
                author=random.choice(authors),
                publication_date=fake.date_between(start_date='-30y', end_date='today'),
                age_rating=random.choice(age_ratings),
                is_available=random.choice([True, False])
            ).genres.set(random.sample(genres, k=random.randint(1, 3)))

        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} books'))