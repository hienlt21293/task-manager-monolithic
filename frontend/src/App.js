import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Users from "./Users";

function Home({ token, setToken }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:5000/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setTasks(res.data))
            .catch(err => console.error(err));
        }
    }, [token]);

    const register = async () => {
        try {
            await axios.post("http://localhost:5000/register", { username, email, password });
            alert("User registered! Now log in.");
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    const login = async () => {
        try {
            const res = await axios.post("http://localhost:5000/login", { email, password });
            setToken(res.data.token); // ✅ Update state
            localStorage.setItem("token", res.data.token);
        } catch (err) {
            alert("Invalid email or password");
        }
    };

    const addTask = async () => {
        if (!newTask) return;
        const res = await axios.post("http://localhost:5000/tasks", 
            { title: newTask, completed: false },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks([...tasks, res.data]);
        setNewTask("");
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.filter(task => task.id !== id));
    };

    const logout = () => {
        setToken(""); // ✅ Clear token from state
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

// ✅ Updated Navigation component
function Navigation({ token }) {
    const location = useLocation();

    return (
        <nav>
            {/* Show "Home" only when on /users */}
            {location.pathname === "/users" && <Link to="/">Home</Link>}

            {/* Show "View Users" only when logged in */}
            {token && <Link to="/users" style={{ marginLeft: "10px" }}>View Users</Link>}
        </nav>
    );
}

// ✅ Manage token in App.js and pass it as prop
function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    return (
        <Router>
            <Navigation token={token} />  {/* ✅ Pass token as prop */}
            <Routes>
                <Route path="/" element={<Home token={token} setToken={setToken} />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Router>
    );
}

export default App;
