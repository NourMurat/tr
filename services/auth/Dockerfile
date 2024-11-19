FROM python:3.10-slim

# Установка необходимых утилит, включая psql
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем проект
COPY . .

# Команда запуска сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
