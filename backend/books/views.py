from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Book, Review
from .serializers import (
    BookSerializer,
    ReviewSerializer,
    UserSerializer,
    RegistrationSerializer
)
from .permissions import IsReaderOwner, IsLibrarian

User = get_user_model()

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        book = self.get_object()
        reviews = book.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsLibrarian()]
        return [IsReaderOwner()]

    def perform_create(self, serializer):
        reader = self.request.user.reader
        serializer.save(reader=reader)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]