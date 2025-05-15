from django.contrib import admin
from .models import Author, Genre, Book, Reader, Review, BookLoan

admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(Reader)
admin.site.register(Review)
admin.site.register(BookLoan)