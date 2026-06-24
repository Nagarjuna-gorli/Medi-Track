import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const start = Date.now();
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      console.log("Login Time:", Date.now() - start, "ms");
      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username);

        console.log("Stored Access:", localStorage.getItem("access"));
  console.log("Stored Role:", localStorage.getItem("role"));

        if (data.role === "admin") {
          navigate("/admin");
        } else if (data.role === "doctor") {
          navigate("/doctor");
        } else if (data.role === "patient") {
          navigate("/patient");
        } else {
          alert("Role not assigned");
        }
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
    
    {/* 🔥 Top Branding */}
    <h1 className="brand-title">MediTrack</h1>
     <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>

      {/* 🔥 REGISTER LINK ADDED */}
      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
      
      <p>
      <Link to="/">← Back to Home</Link>
      </p>

    </div>
  </div>  
  );
}

export default Login;