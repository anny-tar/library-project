FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY . .

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

RUN python manage.py collectstatic --noinput

CMD ["bash", "-c", "./wait-for-db.sh && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]