export const getCardStyles = (darkMode) => ({
  width: "100%",
  maxWidth: "500px",
  padding: "30px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: darkMode ? "#2a2a3d" : "#fff",
});

export const getInputStyles = (darkMode) => ({
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "14px",
  backgroundColor: darkMode ? "#3a3a4f" : "#fff",
  color: darkMode ? "#fff" : "#000",
});

export const getButtonStyles = (darkMode) => ({
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  backgroundColor: darkMode ? "#444" : "#1976d2",
  color: darkMode ? "#fff" : "#000",
});

export const switchLabelStyles = {
  position: "relative",
  display: "inline-block",
  width: "40px",
  height: "20px",
};

export const switchSliderStyles = {
  position: "relative",
  display: "block",
  width: "100%",
  height: "100%",
  borderRadius: "34px",
  backgroundColor: "#ccc",
  transition: ".4s",
};

export const switchCircleStyles = {
  position: "absolute",
  top: "2px",
  left: "2px",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  background: "#fff",
  transition: ".4s",
};