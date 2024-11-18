Этап 1: Подготовка общей инфраструктуры

Шаг 1: Создание репозитория и базовой структуры проекта
Шаг 2: Настройка Docker и Docker Compose

    touch docker-compose.yml

Откройте файл docker-compose.yml и добавьте базовую конфигурацию для базы данных и Nginx:

#ft_transcendence/docker-compose.yml
    version: '3.8'

    services:
    db:
        image: postgres:15.4
        container_name: postgres_db
        environment:
        POSTGRES_USER: user
        POSTGRES_PASSWORD: password
        POSTGRES_DB: ft_transcendence
        ports:
        - "5432:5432"
        volumes:
        - postgres_data:/var/lib/postgresql/data

    nginx:
        image: nginx:1.24.0
        container_name: nginx_proxy
        ports:
        - "80:80"
        volumes:
        - ./services/nginx:/etc/nginx/conf.d
        depends_on:
        - db

    volumes:
    postgres_data:

Проверка Docker Compose
В корне проекта выполните:

    docker-compose up -d

Проверьте статус контейнеров:

    docker ps
Вы должны увидеть контейнеры postgres_db и nginx_proxy в состоянии UP.

Проверочные тесты
1.База данных (PostgreSQL):

Выполните подключение к PostgreSQL:

    docker exec -it postgres_db psql -U user -d ft_transcendence

Проверьте доступ к базе:

    \l
Вы должны увидеть список баз данных, включая ft_transcendence.

2.Nginx:
Перейдите в браузере на http://localhost на Mac или Windows.
Если Nginx работает, вы увидите страницу "Welcome to nginx!".

3.Перезапуск и удаление:
Остановите контейнеры:
   
   docker-compose down

Убедитесь, что все контейнеры остановлены:
    
    docker ps

Результат
Конфигурация Docker Compose успешно создана.
База данных PostgreSQL и сервер Nginx работают в контейнерах.
Каждый участник команды может запустить инфраструктуру проекта с помощью одной команды:

    docker-compose up -d








