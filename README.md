1. Set up Project Stucture
mkdir backend frontend database

2. Set up PostgreSQL in Docker

Create a docker-compose.yaml file in the root folder.

version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: taskmanager-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: taskmanager
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:

Start PostgreSQL
docker compose up -d

3. Initialize the Database
Inside the database/ folder, create an init.sql file:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

Apply the script 

psql -U postgres -h localhost -p 5432 -d taskmanager -f database/init.sql


4. Set up backend
cd backend
npm init -y

Install Dependencies
npm install express pg bcryptjs jsonwebtoken dotenv cors bcrypt

Create backend/server.js (content included)
Create .env File (content included)

5. Start backend
 node server.js 

6. Set up Frontend

cd ../frontend
npx create-react-app .
npm install axios react-router-dom web-vitals


Modify src/App.js (content included)

7. Start frontend
npm start