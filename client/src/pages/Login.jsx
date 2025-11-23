import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { darkMode } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        setError("Invalid login or password");
        return;
      }

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  }

  const containerStyles = {
    backgroundColor: darkMode ? "#2c2c3c" : "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: darkMode
      ? "0 0 10px rgba(0,0,0,0.5)"
      : "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
    maxWidth: "400px",
  };

  const themeStyles = {
    backgroundColor: darkMode ? "#1e1e2f" : "#f0f0f0",
    color: darkMode ? "#fff" : "#000",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    padding: "20px",
  };

    const inputStyles = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: darkMode ? "#2c2c3c" : "#fff",
    color: darkMode ? "#fff" : "#000",
    boxSizing: "border-box", // <-- include padding/border in width
    };

    const buttonStyles = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: darkMode ? "#4caf50" : "#1976d2",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    boxSizing: "border-box",
    };

  return (
    <div style={themeStyles}>
      <div style={containerStyles}>
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Sign In</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={inputStyles}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyles}
            required
          />

          <button type="submit" style={buttonStyles}>
            Log In
          </button>
        </form>

        {error && (
          <p
            style={{
              color: "#f44336",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}