const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});



// Middleware
app.use(cors());
app.use(express.json());

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Register user
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get all tasks for a user
app.get("/tasks", authenticateToken, async (req, res) => {
    try {
        const tasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [req.user.userId]);
        res.json(tasks.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new task
app.post("/tasks", authenticateToken, async (req, res) => {
    try {
        const { title, completed } = req.body;
        const result = await pool.query(
            "INSERT INTO tasks (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, completed || false, req.user.userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a task
app.delete("/tasks/:id", authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.user.userId]);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/verify-token", authenticateToken, (req, res) => {
    res.json({ message: "Valid token" });
});

// List all users and their tasks
app.get("/users", authenticateToken, async (req, res) => {
    try {
        console.log("Fetching users from database...");

        const result = await pool.query(`
            SELECT 
                users.id AS user_id, users.username, users.email, 
                tasks.id AS task_id, tasks.title, tasks.completed
            FROM users
            LEFT JOIN tasks ON users.id = tasks.user_id
            ORDER BY users.id, tasks.id;
        `);

        console.log("Raw DB Result:", result.rows);  // Log raw database output

        // Organizing data
        const usersMap = new Map();

        result.rows.forEach(row => {
            if (!usersMap.has(row.user_id)) {
                usersMap.set(row.user_id, {
                    id: row.user_id,
                    username: row.username,
                    email: row.email,
                    tasks: []
                });
            }
            if (row.task_id) {
                usersMap.get(row.user_id).tasks.push({
                    id: row.task_id,
                    title: row.title,
                    completed: row.completed
                });
            }
        });

        console.log("Final Users Data:", Array.from(usersMap.values())); // Log final result

        res.json(Array.from(usersMap.values()));
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
