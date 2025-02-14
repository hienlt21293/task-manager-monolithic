# Task Manager App 📝

A full-stack task management application with authentication, built using React (Frontend), Express (Backend), and PostgreSQL (Database).

**Note:**

*This repository is intended for practicing Docker and Docker Compose. It serves as a baseline for further DevOps exploration, such as breaking the application into microservices and deploying it with Kubernetes, among other improvements.*

*The source code for this application was entirely generated by ChatGPT as part of an experiment in AI-assisted development.*


#### Environment used:
- **OS**: Ubuntu 24.04
- **Node.JS**: npm v10.9.2
- **Docker** version 26.1.3
- **docker-compose** version 1.29.2
 
-----


#### To make the most of this repo, I recommend:
- **(Optional) Manually start the app:**
    - Install Postgres. 
    - Start Frontend and Backend by running `npm install` and then `npm start`
- **Rebuilding Docker setup from scratch:** Delete and recreate all Dockerfile and docker-compose.yaml files.

<br>

> **Important:** 
> - For Postgress: set up username, password, database based on **backend/.env** file.
> - Create the required tables (refer to **database/init.sql**.)


### Expected Behavior
Ideally, you should be able to start the app with:

`docker-compose up --build -d`

Data should be persisted across restarts. 

---

**📌 Features**

✔️ User Registration & Login (JWT Authentication)

✔️ Create, View, and Delete Tasks

✔️ Secure API with Auth Middleware

✔️ List All Users & Their Tasks 

✔️ Dockerized Frontend, Backend, PostgreSQL Database

  
<br/>
<br/>  

**🚀 Tech Stack**

Frontend: React, React Router, Axios

Backend: Express.js, PostgreSQL, bcrypt, JWT

Database: PostgreSQL (Docker)

Deployment: Docker, Docker Compose

<br/>
<br/>

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

  
<br/>
<br/>

**🔌 API Endpoints**

|  Method| Endpoint | Description| Auth Required?
|--|--|--|--|
|POST | /register  |  Register a new user|  ❌ No|
|POST |/login | Login & get JWT Token| ❌ No
|GET |/tasks |Get user’s tasks |✅ Yes
|POST |/tasks |Add a new task |✅ Yes
|DELETE |/tasks/:id| Delete a task |✅ Yes
|GET |/users |Get all users & tasks |✅ Yes

<br/>
<br/>  

**🤝 Contributing**

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

  
<br/>
<br/>

**📝 License**

This project is MIT Licensed.