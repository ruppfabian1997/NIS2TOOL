import { useState, useEffect } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.removeItem("jwt"); // Clear any existing JWT token
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        username: email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      alert("Login successful");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
