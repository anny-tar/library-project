from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver

class Author(models.Model):
    name = models.CharField(max_length=200, verbose_name="Имя автора")
    bio = models.TextField(verbose_name="Биография", blank=True)
    birth_date = models.DateField(verbose_name="Дата рождения", null=True, blank=True)

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100, verbose_name="Жанр")

    def __str__(self):
        return self.name

class Book(models.Model):
    AGE_RATING_CHOICES = [('0+', '0+'), ('6+', '6+'), ('12+', '12+'), ('16+', '16+'), ('18+', '18+')]
    title = models.CharField(max_length=300, verbose_name="Название")
    author = models.ForeignKey(Author, on_delete=models.CASCADE, verbose_name="Автор")
    genres = models.ManyToManyField(Genre, verbose_name="Жанры")
    cover_image = models.ImageField(upload_to='covers/', null=True, blank=True, default='covers/default-cover.jpg')
    age_rating = models.CharField(max_length=3, choices=AGE_RATING_CHOICES, default='0+')
    publication_date = models.DateField(verbose_name="Дата публикации")
    is_available = models.BooleanField(default=True)

    @property
    def rating(self):
        avg = self.review_set.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    def __str__(self):
        return f"{self.title} ({self.author.name})"

class Reader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    card_number = models.CharField(max_length=20, unique=True)
    registration_date = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user'], name='unique_reader')]

    def __str__(self):
        return f"{self.user.username} ({self.card_number})"

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    reader = models.ForeignKey(Reader, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reader.user.username} → {self.book}: {self.rating}/5"

@receiver(post_save, sender=User)
def assign_roles(sender, instance, created, **kwargs):
    if created:
        Group.objects.get_or_create(name='Readers')
        instance.groups.add(Group.objects.get(name='Readers'))
    if instance.is_superuser:
        Group.objects.get_or_create(name='Librarians')
        instance.groups.add(Group.objects.get(name='Librarians'))