import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Users from "./Users";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    // Fetch tasks when logged in
    useEffect(() => {
        if (token) {
            axios.get("http://localhost:5000/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setTasks(res.data))
            .catch(err => console.error(err));
        }
    }, [token]);

    // Register user
    const register = async () => {
        try {
            await axios.post("http://localhost:5000/register", { username, email, password });
            alert("User registered! Now log in.");
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    // Login user
    const login = async () => {
        try {
            const res = await axios.post("http://localhost:5000/login", { email, password });
            setToken(res.data.token);
            localStorage.setItem("token", res.data.token);
        } catch (err) {
            alert("Invalid email or password");
        }
    };

    // Add a task
    const addTask = async () => {
        if (!newTask) return;
        const res = await axios.post("http://localhost:5000/tasks", 
            { title: newTask, completed: false },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
        setNewTask("");
    };

    // Delete a task
    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.filter(task => task.id !== id));
    };

    // Logout
    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    return (
        <div>
            <h1>Task Manager</h1>
            
            {!token ? (
                <>
                    <h2>Register</h2>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={register}>Register</button>

                    <h2>Login</h2>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={login}>Login</button>
                </>
            ) : (
                <>
                    <button onClick={logout}>Logout</button>
                    <h2>Add Task</h2>
                    <input type="text" placeholder="Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <button onClick={addTask}>Add</button>

                    <h2>Tasks</h2>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id}>
                                {task.title} <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

// Navigation component (works for all pages)
function Navigation() {
    const location = useLocation();
    const token = localStorage.getItem("token");

    return (
        <nav>
            {/* Show "Home" only on /users */}
            {location.pathname === "/users" && <Link to="/">Home</Link>}

            {/* Show "View Users" when logged in */}
            {token && <Link to="/users" style={{ marginLeft: "10px" }}>View Users</Link>}
        </nav>
    );
}

// Main App Component
function App() {
    return (
        <Router>
            <Navigation />  {/* ✅ Always show navigation */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Router>
    );
}

export default App;
