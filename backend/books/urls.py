from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import UserRegistrationView

router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'genres', views.GenreViewSet, basename='genre')

urlpatterns = [
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)