from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, Review, Reader

class UserSerializer(serializers.ModelSerializer):
    reader = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'reader']

    def get_reader(self, obj):
        if hasattr(obj, 'reader'):
            return {
                'card_number': obj.reader.card_number,
                'registration_date': obj.reader.registration_date
            }
        return None

class BookSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()
    author = serializers.StringRelatedField()
    genres = serializers.StringRelatedField(many=True)

    class Meta:
        model = Book
        fields = '__all__'

    def get_rating(self, obj):
        return obj.rating if obj.rating else 0.0

class ReviewSerializer(serializers.ModelSerializer):
    reader = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'book', 'reader', 'rating', 'comment', 'created_at']
        read_only_fields = ['reader']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Рейтинг должен быть от 1 до 5")
        return value

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Имя пользователя уже занято")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Reader.objects.create(user=user, card_number=f"R-{user.id:04d}")
        return user