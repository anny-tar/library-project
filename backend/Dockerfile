FROM python:3.12-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Создание виртуального окружения
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Рабочая директория
WORKDIR /app

# Копирование всего проекта
COPY . .

# Установка зависимостей Python
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Сборка статических файлов
RUN python manage.py collectstatic --noinput

# Команда запуска
CMD ["bash", "-c", \
    "./wait-for-db.sh && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000"]