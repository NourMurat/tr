Этап 1: Подготовка общей инфраструктуры

Шаг 1: Создание репозитория и базовой структуры проекта
Создание репозитория:
Зайдите на [GitHub/GitLab/Bitbucket].
Создайте новый репозиторий с названием ft_transcendence.
Установите права доступа для всех участников команды:
Назначьте себя владельцем репозитория.
Добавьте остальных участников с правами maintainer (или write).

Базовая структура проекта Создайте следующую структуру папок локально:

    ft_transcendence/
    ├── Makefile
    ├── README.md
    ├── docker-compose.yaml
    └── services/
        ├── auth/
        ├── user/
        ├── game/
        ├── waf/
        └── db/

Шаг 2: Настройка Docker и Docker Compose

    touch docker-compose.yml

Откройте файл docker-compose.yml и добавьте базовую конфигурацию для базы данных и Nginx:

    #ft_transcendence/docker-compose.yml
    version: '3.8'

    services:
    db:
        image: postgres:15
        container_name: postgres_db
        environment:
        POSTGRES_USER: user
        POSTGRES_PASSWORD: password
        POSTGRES_DB: ft_transcendence
        ports:
        - "5432:5432"
        volumes:
        - postgres_data:/var/lib/postgresql/data

    waf:
        image: nginx:1.25
        container_name: waf_service
        ports:
        - "80:80"
        volumes:
        - ./services/waf:/etc/nginx/conf.d
        depends_on:
        - db

    volumes:
    postgres_data:

Добавим базовый конфигурационный файл. В папке services/waf создайте файл конфигурации default.conf:

    #ft_transcendence/services/waf/default.conf
    server {
        listen 80;

        server_name localhost;

        location / {
            return 200 'Welcome to ft_transcendence!';
            add_header Content-Type text/plain;
        }
    }

Проверка Docker Compose
В корне проекта выполните:

    docker-compose up -d

Проверьте статус контейнеров:

    docker ps

Вы должны увидеть контейнеры postgres_db и waf_service в состоянии UP.

Проверочные тесты
1.База данных (PostgreSQL):

Для проверки состояния базы данных мы можем сделать следующее. Поскольку Nginx не может напрямую проверять TCP-соединения, используйте docker exec для проверки состояния PostgreSQL:

    docker exec -it postgres_db pg_isready -U user

Если PostgreSQL работает, команда вернет:

    postgres:5432 - accepting connections

Выполните подключение к PostgreSQL:

    docker exec -it postgres_db psql -U user -d ft_transcendence

Проверьте доступ к базе:

    \l

Вы должны увидеть список баз данных, включая ft_transcendence.

2.Nginx:
Перейдите в браузере на http://localhost на Mac или Windows.
Либо введите в командной строке:

    curl localhost

Если Nginx работает, вы увидите страницу "Welcome to ft_transcendence!".

Проверьте, что конфигурация Nginx активна:

    docker exec -it waf_service nginx -t

Если конфигурация корректна, команда покажет - syntax is ok.

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

Шаг 3: Создание тестового эндпоинта в Nginx для проверки API

Цель
Настроить базовый тестовый API-эндпоинт через Nginx, чтобы проверить маршрутизацию будущих микросервисов. Это создаст основу для добавления других сервисов (например, аутентификации, игровых данных и профилей пользователей).

Откройте файл services/waf/default.conf. Добавьте тестовый маршрут /api/test:

    location /api/test {
        return 200 '{"message": "API is working"}';
        add_header Content-Type application/json;
    }

Перезапустите контейнер:
    docker-compose down
    docker-compose up -d

Тестирование эндпоинта
Выполните запрос через curl:
    curl http://localhost/api/test

Ожидаемый результат:
    {"message": "API is working"}

Убедитесь, что конфигурация синтаксически корректна:
    docker exec -it waf_service nginx -t

Если все корректно, значит тестовый API-эндпоинт /api/test успешно настроен и возвращает корректный JSON, базовая маршрутизация готова для добавления микросервисов.

===================================================================================================

Этап 2: Разработка микросервисов
Шаг 1: Настройка аутентификационного микросервиса

1. Цель
Создать микросервис аутентификации, который будет обрабатывать регистрацию, вход пользователей и выдачу JWT-токенов. Этот сервис станет основой для взаимодействия всех остальных микросервисов.

2. Шаги выполнения
2.1. Создание структуры микросервиса
В папке services/auth создайте файл Dockerfile:


