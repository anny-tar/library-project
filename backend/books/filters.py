import django_filters
from .models import Book

class BookFilter(django_filters.FilterSet):
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='lte')

    class Meta:
        model = Book
        fields = ['author', 'genres', 'is_available']