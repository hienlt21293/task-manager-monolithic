# Task Manager App 📝

A full-stack task management application with authentication, built using React (Frontend), Express (Backend), and PostgreSQL (Database).

  

**📌 Features**

✔️ User Registration & Login (JWT Authentication)

✔️ Create, View, and Delete Tasks

✔️ Secure API with Auth Middleware

✔️ List All Users & Their Tasks 

✔️ Dockerized Frontend, Backend, PostgreSQL Database

  

**🚀 Tech Stack**

Frontend: React, React Router, Axios

Backend: Express.js, PostgreSQL, bcrypt, JWT

Database: PostgreSQL (Docker)

Deployment: Docker, Docker Compose

**🛠️ Setup Instructions**
Run docker-compose up from root folder to start everything.

    docker-compose up --build -d

Frontend: localhost:80

Backend: localhost:5000

---


You can also start Postgres from docker-compose, then manually start frontend and backend separately

    docker-compose -f 'docker-compose.yaml' up -d --build 'postgres' 
    # from frontend folder
    npm install
    npm start
    # from backend folder
    npm install
    npm start
Frontend: localhost:3000

Backend: localhost:5000

**🔌 API Endpoints**

|  Method| Endpoint | Description| Auth Required?
|--|--|--|--|
|POST | /register  |  Register a new user|  ❌ No|
|POST |/login | Login & get JWT Token| ❌ No
|GET |/tasks |Get user’s tasks |✅ Yes
|POST |/tasks |Add a new task |✅ Yes
|DELETE |/tasks/:id| Delete a task |✅ Yes
|GET |/users |Get all users & tasks |✅ Yes


  

**🤝 Contributing**

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

  

**📝 License**

This project is MIT Licensed.