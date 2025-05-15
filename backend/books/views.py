from rest_framework import viewsets

from .models import Author, Genre, Book, Reader, BookLoan, Review
from .serializers import (
    AuthorSerializer, GenreSerializer, BookSerializer,
    ReaderSerializer, BookLoanSerializer, ReviewSerializer
)
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.shortcuts import render, redirect


# Базовый класс для устранения дублирования
class BaseViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return self.model.objects.all()
    def get_serializer_class(self):
        return self.serializer_class

# Наследование от BaseViewSet
class AuthorViewSet(BaseViewSet):
    model = Author
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

class GenreViewSet(BaseViewSet):
    model = Genre
    serializer_class = GenreSerializer
    queryset = Genre.objects.all()

class BookViewSet(BaseViewSet):
    model = Book
    serializer_class = BookSerializer
    queryset = Book.objects.all()

class ReaderViewSet(BaseViewSet):
    model = Reader
    serializer_class = ReaderSerializer
    queryset = Reader.objects.all()

class BookLoanViewSet(BaseViewSet):
    model = BookLoan
    serializer_class = BookLoanSerializer
    queryset = BookLoan.objects.all()

class ReviewViewSet(BaseViewSet):
    model = Review
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})