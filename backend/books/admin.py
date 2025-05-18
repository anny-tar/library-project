# books/admin.py
from django.contrib import admin
from .models import Author, Genre, Book, Reader, Review  # Убрали BookLoan

admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(Reader)
admin.site.register(Review)
