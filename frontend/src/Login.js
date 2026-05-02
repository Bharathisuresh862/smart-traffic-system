import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const submit = async () => {
    try {
      const res = await axios.post("https://smart-traffic-system-ea56.onrender.com/login", {
        username: u,
        password: p
      });

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Admin Login</h2>
      <input placeholder="username" onChange={e => setU(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setP(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}