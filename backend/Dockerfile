# backend/Dockerfile
FROM python:3.12-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    zlib1g-dev \
    libjpeg-dev \
    libopenjp2-7-dev \
    libtiff5-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/media
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
RUN python manage.py collectstatic --noinput
CMD ["./wait-for-db.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]