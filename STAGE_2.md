STAGE_2.md
Stage 2: Developing the First Microservice

We'll start with the Authentication (auth) microservice because:

It is a key component for user registration and authorization.
It allows integration testing with the PostgreSQL database.
It forms the foundation for developing other microservices.

Step 1: Setting Up the Django Project for auth
1. Objective:
Set up a basic Django project for the authentication microservice, with PostgreSQL integration through Docker.

2. Steps:
2.1. Initialize the Django Project:

Navigate to the services/auth directory and create a new Django project:

    django-admin startproject auth_service .

2.2. Configure PostgreSQL Connection:
In the auth_service/settings.py file, update the database settings as follows:

# ft_transcendence/services/auth/auth_service/settings.py
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'ft_transcendence',
            'USER': 'user',
            'PASSWORD': 'password',
            'HOST': 'db',  # Name of the database container
            'PORT': '5432',
        }
    }

Add the configuration for allowed hosts:

    ALLOWED_HOSTS = ['*']

2.3. Create a Dockerfile for auth:
In the services/auth folder, create a file named Dockerfile:

# ft_transcendence/services/auth/Dockerfile
    FROM python:3.10-slim

    # Install necessary utilities, including psql for running
    # "python manage.py dbshell" inside the container
    RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

    WORKDIR /app

    # Install dependencies
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    # Copy the project
    COPY . .

    # Command to start the server
    CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

Create a requirements.txt file and add the following dependencies:

# ft_transcendence/services/auth/requirements.txt
    django==4.2
    psycopg2-binary

2.4. Update docker-compose.yml:
Add the auth service to docker-compose.yml:

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

2.5. Initialize the Database:
Restart the containers and apply Django migrations. First, enter the auth_service container:

    docker exec -it auth_service bash

Inside the container, run the following commands:

    python manage.py makemigrations
    python manage.py migrate

To exit the container, type:

    exit

Verify the server's availability by visiting:

    http://localhost:8000

You should see the default Django welcome page.

3. Verification Tests:

Test Database Connection:
Access the database using the following command:

    docker exec -it auth_service python manage.py dbshell

Verify database access by running an SQL query, for example:

    \dt

To exit the database, type:

    \q

4. Outcome:
The auth_service Django project is set up and connected to the PostgreSQL database.
The service runs in a container and is accessible on port 8000.
If everything is ready, proceed to configure the RESTful API for authentication.

=================================================================================================================