import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");
    const API_BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUsers(res.data))
        .catch(err => console.error(err));
    }, [token]);

    return (
        <div>
            <h1>All Users & Their Tasks</h1>
            {users.length === 0 ? (
                <p>Loading users...</p>
            ) : (
                users.map(user => (
                    <div key={user.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
                        <h3>{user.username} ({user.email})</h3>
                        <ul>
                            {user.tasks.length > 0 ? (
                                user.tasks.map(task => (
                                    <li key={task.id}>
                                        {task.title} - {task.completed ? "✅ Completed" : "❌ Pending"}
                                    </li>
                                ))
                            ) : (
                                <p>No tasks assigned</p>
                            )}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default Users;
