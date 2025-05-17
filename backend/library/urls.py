from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from books import views
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = routers.DefaultRouter()
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'genres', views.GenreViewSet, basename='genre')
router.register(r'books', views.BookViewSet, basename='book')
router.register(r'readers', views.ReaderViewSet, basename='reader')
router.register(r'loans', views.BookLoanViewSet, basename='loan')
router.register(r'reviews', views.ReviewViewSet, basename='review')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('books.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]