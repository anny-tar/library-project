# backend/books/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.contrib.auth.models import Group
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from django.db.models import Count, Avg
from django.db.models import Count, Q
from .serializers import GenreStatsSerializer


from .models import Author, Genre, Book, Reader, BookLoan, Review
from .serializers import (
    AuthorSerializer,
    GenreSerializer,
    BookSerializer,
    ReaderSerializer,
    BookLoanSerializer,
    ReviewSerializer,
    RegistrationSerializer
)
from .filters import BookFilter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    data = {
        'username': user.username,
        'email': user.email,
        'reader': {
            'card_number': user.reader.card_number,
            'registration_date': user.reader.registration_date
        }
    }
    return Response(data)

class IsLibrarian(BasePermission):
    """Права доступа только для библиотекарей"""

    def has_permission(self, request, view):
        return request.user.groups.filter(name='Librarians').exists()

class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def stats(self, request):
        data = {
            'total_books': Book.objects.count(),
            'available_books': Book.objects.filter(is_available=True).count(),
            'popular_genres': Genre.objects.annotate(book_count=Count('book')).order_by('-book_count')[:3]
        }
        return Response(data)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated(), IsLibrarian()]
        return [permissions.AllowAny()]

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Рекомендации книг (топ-5 по рейтингу)"""
        recommended_books = Book.objects.filter(rating__gte=4.0).order_by('-rating')[:5]
        serializer = self.get_serializer(recommended_books, many=True)
        return Response(serializer.data)


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated, IsLibrarian]


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated, IsLibrarian]


class ReaderViewSet(viewsets.ModelViewSet):
    queryset = Reader.objects.all()
    serializer_class = ReaderSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated(), IsLibrarian()]
        return [IsAuthenticated()]


class BookLoanViewSet(viewsets.ModelViewSet):
    queryset = BookLoan.objects.all()
    serializer_class = BookLoanSerializer
    permission_classes = [IsAuthenticated, IsLibrarian]

    def perform_create(self, serializer):
        """Автоматическое назначение текущего пользователя"""
        serializer.save(reader=self.request.user.reader)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Автоматическое назначение текущего пользователя"""
        serializer.save(reader=self.request.user.reader)


class UserRegistrationViewSet(viewsets.GenericViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Регистрация нового пользователя"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Добавление в группу Readers
            readers_group, _ = Group.objects.get_or_create(name='Readers')
            user.groups.add(readers_group)

            return Response(
                {'status': 'User created successfully', 'user_id': user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsLibrarian]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Основная статистика библиотеки"""
        data = {
            'total_books': Book.objects.count(),
            'available_books': Book.objects.filter(is_available=True).count(),
            'active_loans': BookLoan.objects.filter(return_date__isnull=True).count(),
            'popular_genres': self.get_genre_stats(),
            'top_rated_books': BookSerializer(
                Book.objects.order_by('-rating')[:5],
                many=True
            ).data
        }
        return Response(data)

    def get_genre_stats(self):
        return GenreStatsSerializer(
            Genre.objects.annotate(
                book_count=Count('book')
            ).order_by('-book_count')[:5],
            many=True
        ).data

    @action(detail=False, methods=['get'])
    def reader_stats(self, request):
        """Статистика по читателям"""
        active_readers = Reader.objects.filter(
            Q(bookloan__return_date__isnull=True)
        ).distinct().count()

        return Response({
            'total_readers': Reader.objects.count(),
            'active_readers': active_readers,
            'top_reviewers': self.get_top_reviewers()
        })

    def get_top_reviewers(self):
        return ReaderSerializer(
            Reader.objects.annotate(
                review_count=Count('review')
            ).order_by('-review_count')[:5],
            many=True
        ).data