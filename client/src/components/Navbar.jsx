import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navbarStyles = {
    width: "100%",
    padding: "10px 20px",
    boxSizing: "border-box",
    backgroundColor: darkMode ? "#2c2c3c" : "#fff",
    borderBottom: darkMode ? "1px solid #444" : "1px solid #ccc",
    color: darkMode ? "#fff" : "#000",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const buttonStyles = (path) => ({
    padding: "8px 16px",
    backgroundColor:
      location.pathname === path
        ? darkMode
          ? "#357a38"
          : "#115293"
        : darkMode
        ? "#4caf50"
        : "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  });

  return (
    <div style={navbarStyles}>
      <span>Factory Management Dashboard</span>
    </div>
  );
}