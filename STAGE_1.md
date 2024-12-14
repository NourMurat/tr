#STAGE_1.md

Stage 1: Setting Up the Core Infrastructure

Step 1: Create the Repository and Basic Project Structure
Create the Repository:
Go to [GitHub/GitLab/Bitbucket].
Create a new repository named ft_transcendence.
Set access permissions for all team members:
Assign yourself as the repository owner.
Add other team members with maintainer (or write) permissions.
Basic Project Structure:
Create the following folder structure locally:

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

Step 2: Set Up Docker and Docker Compose
Create the docker-compose.yml File:
Run the following command in the root directory:

    touch docker-compose.yml

Open the docker-compose.yml file and add the basic configuration for the database and Nginx:

# ft_transcendence/docker-compose.yml
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

Add a Basic Configuration File for Nginx:
In the services/waf directory, create a configuration file named default.conf:

# ft_transcendence/services/waf/default.conf
    server {
        listen 80;

        server_name localhost;

        location / {
            return 200 'Welcome to ft_transcendence!';
            add_header Content-Type text/plain;
        }
    }


Step 3: Verify Docker Compose Configuration
Run the following command in the root of the project:

    docker-compose up -d

Check the status of the containers:

    docker ps

You should see the postgres_db and waf_service containers in the UP state.

Verification Tests:
Database (PostgreSQL):

Check the PostgreSQL status using docker exec:

    docker exec -it postgres_db pg_isready -U user

If PostgreSQL is running, the command will return:

    postgres:5432 - accepting connections

Connect to PostgreSQL:

    docker exec -it postgres_db psql -U user -d ft_transcendence

Verify the database list:

    \l

You should see a list of databases, including ft_transcendence.

Nginx:

Open a browser and go to http://localhost on Mac or Windows.

Alternatively, run the following command in the terminal:

    curl localhost

If Nginx is running, you should see the message: "Welcome to ft_transcendence!".

Check if the Nginx configuration is valid:

    docker exec -it waf_service nginx -t

If the configuration is correct, the command will output: syntax is ok.

Restart and Clean Up:

Stop the containers:

    docker-compose down

Ensure all containers are stopped:

    docker ps

Outcome:
The Docker Compose configuration is successfully created.

The PostgreSQL database and Nginx server are running in containers.

Any team member can set up the project's infrastructure using a single command:

    docker-compose up -d


Step 4: Create a Test Endpoint in Nginx for API Verification
Goal:
Set up a basic test API endpoint via Nginx to verify the routing for future microservices. This will lay the foundation for adding other services (e.g., authentication, game data, and user profiles).

Open the file services/waf/default.conf. Add the test route /api/test:

    location /api/test {
        return 200 '{"message": "API is working"}';
        add_header Content-Type application/json;
    }

Restart the container:

    docker-compose down
    docker-compose up -d

Test the Endpoint:
Make a request using curl:

    curl http://localhost/api/test

Expected output:

    {"message": "API is working"}

Verify that the configuration syntax is correct:

    docker exec -it waf_service nginx -t

Outcome:
The /api/test endpoint is successfully configured and returns the expected JSON.
The basic routing is ready for integrating additional microservices.

=================================================================================================================