from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Author, Genre, Book, Reader, BookLoan, Review


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    reader_card = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'reader_card']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False}
        }

    def get_reader_card(self, obj):
        return obj.reader.card_number if hasattr(obj, 'reader') else None

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio', 'birth_date']
        read_only_fields = ['id']
        extra_kwargs = {
            'bio': {'required': False, 'allow_blank': True},
            'birth_date': {'required': False}
        }


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']
        read_only_fields = ['id']


class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    genre = GenreSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        source='author',
        write_only=True
    )
    genre_id = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='genre',
        write_only=True
    )
    def validate_rating(self, value):
        if value < 0 or value > 5:
            raise serializers.ValidationError("Рейтинг должен быть от 0 до 5")
        return value

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'author_id',
            'genre', 'genre_id', 'publication_date',
            'rating', 'is_available'
        ]
        read_only_fields = ['id', 'rating']


class ReaderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Reader
        fields = ['id', 'user', 'card_number', 'registration_date']
        read_only_fields = ['id', 'registration_date']


class BookLoanSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    reader = ReaderSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True
    )
    reader_id = serializers.PrimaryKeyRelatedField(
        queryset=Reader.objects.all(),
        source='reader',
        write_only=True
    )

    class Meta:
        model = BookLoan
        fields = [
            'id', 'book', 'book_id',
            'reader', 'reader_id',
            'loan_date', 'return_date'
        ]
        read_only_fields = ['id', 'loan_date']


class ReviewSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    reader = ReaderSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        source='book',
        write_only=True
    )
    reader_id = serializers.PrimaryKeyRelatedField(
        queryset=Reader.objects.all(),
        source='reader',
        write_only=True
    )

    class Meta:
        model = Review
        fields = [
            'id', 'book', 'book_id',
            'reader', 'reader_id',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        Reader.objects.create(
            user=user,
            card_number=f"R-{user.id:04d}"
        )
        return user


class LoanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLoan
        fields = ['book']

    def create(self, validated_data):
        user = self.context['request'].user
        return BookLoan.objects.create(
            book=validated_data['book'],
            reader=user.reader
        )

class GenreStatsSerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField()

    class Meta:
        model = Genre
        fields = ['id', 'name', 'book_count']