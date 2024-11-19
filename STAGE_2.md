Этап 2: Разработка первого микросервиса
Начнем с микросервиса Аутентификации (auth), так как он:

Является ключевым компонентом, обеспечивающим регистрацию и авторизацию пользователей.
Позволяет проверить интеграцию с базой данных (PostgreSQL).
Создаст основу для дальнейшей разработки других микросервисов.
Шаг 1: Создание Django-проекта для auth
1. Цель
Настроить базовый Django-проект для аутентификационного микросервиса с подключением к PostgreSQL через Docker.

2. Шаги выполнения
2.1. Инициализация Django-проекта
Перейдите в директорию services/auth и Создайте новый проект Django:

    django-admin startproject auth_service .

2.2. Настройка подключения к PostgreSQL
В файле auth_service/settings.py измените настройки базы данных:

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'ft_transcendence',
            'USER': 'user',
            'PASSWORD': 'password',
            'HOST': 'db',  # Название контейнера базы данных
            'PORT': '5432',
        }
    }

Добавьте настройку для разрешенных хостов:

    ALLOWED_HOSTS = ['*']

2.3. Создание Dockerfile для auth
В папке services/auth создайте файл Dockerfile:

    #ft_transcendence/services/auth/Dockerfile
    FROM python:3.10-slim

    # Установка необходимых утилит, включая psql,
    # которая позволяет запустить команду "python manage.py dbshell" внутри контейнера
    RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

    WORKDIR /app

    # Установка зависимостей
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    # Копируем проект
    COPY . .

    # Команда запуска сервера
    CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

Создайте файл requirements.txt и добавьте:

    #ft_transcendence/services/auth/requirements.txt
    django==4.2
    psycopg2-binary

2.4. Обновление docker-compose.yml
Добавьте сервис auth в docker-compose.yml:

    auth:
        build:
        context: ./services/auth
        container_name: auth_service
        ports:
        - "8000:8000"
        volumes:
        - ./services/auth:/app
        depends_on:
        - db

2.5. Инициализация базы данных
Перезапустите контейнеры и Выполните миграции Django:
Для этого зайдите сначала в контейнер auth_service:
    docker exec -it auth_service bash

Внутри контейнера выполните миграции
    python manage.py makemigrations
    python manage.py migrate

Для выхода из контейнера введите:

    exit

Проверьте доступность сервера:

Перейдите на http://localhost:8000 в браузере.
Вы должны увидеть страницу Django.

3. Проверочные тесты
Проверка подключения к базе данных:

Зайдите в базу данных:

    docker exec -it auth_service python manage.py dbshell

Проверьте доступ к базе и выполните SQL-запрос, например:

    \dt

Для выхода из бд введите:

    \q

4. Результат
Django-проект auth_service настроен и подключен к базе данных PostgreSQL.
Сервис работает в контейнере и доступен через порт 8000.
Если всё готово, переходим к настройке REST API для аутентификации.








