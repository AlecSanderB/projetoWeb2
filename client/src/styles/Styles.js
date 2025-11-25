export const getContainerStyles = (darkMode) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  fontFamily: "sans-serif",
  overflow: "hidden",
  backgroundColor: darkMode ? "#1e1e2f" : "#f0f0f0",
  color: darkMode ? "#fff" : "#000",
});

export const getBodyStyles = () => ({
  flex: 1,
  display: "flex",
  overflow: "hidden",
});

export const getMainStyles = () => ({
  flex: 1,
  padding: "40px",
  boxSizing: "border-box",
  overflowY: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
});

export const getCardStyles = (darkMode) => ({
  width: "100%",
  maxWidth: "600px",
  padding: "30px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
  backgroundColor: darkMode ? "#2a2a3d" : "#fff",
  boxSizing: "border-box",
  overflow: "hidden",
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

export const getButtonStyles = (active = false, darkMode = false, options = {}) => {
  return {
    flex: options.flex ?? 1,
    padding: "8px 0",
    cursor: "pointer",
    backgroundColor: options.backgroundColor
      ? options.backgroundColor
      : active
      ? "#1976d2"
      : darkMode
      ? "#444"
      : "#eee",
    color: options.color ? options.color : active ? "#fff" : darkMode ? "#fff" : "#000",
    border: "none",
    borderRadius: "4px",
    textAlign: "center",
    width: options.width ?? "auto",
  };
};

export const toggleButtonStyles = (active, darkMode) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "4px",
  backgroundColor: active ? "#1976d2" : darkMode ? "#555" : "#eee",
  color: active ? "#fff" : darkMode ? "#fff" : "#000",
  fontWeight: "bold",
});

export const toggleCircleStyle = (color) => ({
  display: "inline-block",
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 5,
});

export const flexColumnGap = (gap = "4px") => ({
  display: "flex",
  flexDirection: "column",
  gap,
});

export const flexRowGap = (gap = "10px", options = {}) => ({
  display: "flex",
  gap,
  ...options,
});

export const labelStyle = { margin: 0, lineHeight: "1.2" };

export const buttonContainerStyle = {
  display: "flex",
  marginBottom: "10px",
  gap: "5px",
  width: "100%",
};

export const renderedCircleStyle = (isRendered) => ({
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: isRendered ? "#4caf50" : "#d32f2f",
  display: "inline-block",
});

export const historyPanelWrapper = {
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
};

export const getMenuRowStyle = (level) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "4px",
  paddingLeft: level * 24,
});

export const getMenuButtonStyle = (hasChildren, isSelected, hasSelectedDescendant, darkMode) => ({
  marginRight: "6px",
  width: "24px",
  background: "none",
  border: "none",
  cursor: hasChildren ? "pointer" : "default",
  color: isSelected
    ? "#4caf50"
    : hasSelectedDescendant
      ? "#81c784"
      : darkMode
        ? "#fff"
        : "#000",
  fontWeight: isSelected || hasSelectedDescendant ? "bold" : "normal",
  fontSize: "14px",
  padding: 0,
  textAlign: "center",
});

export const getMenuItemStyle = (isSelected, hasSelectedDescendant, darkMode) => ({
  flex: 1,
  cursor: "pointer",
  userSelect: "none",
  fontWeight: isSelected ? "bold" : "normal",
  color: darkMode ? "#fff" : "#000",
  backgroundColor: isSelected
    ? darkMode
      ? "#2a2a3c"
      : "#d0f0d0"
    : hasSelectedDescendant
      ? darkMode
        ? "#3a3a4c"
        : "#e0f0e0"
      : "transparent",
  borderRadius: "4px",
  padding: "2px 4px",
});

export const enabledWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

export const enabledLabel = {
  margin: 0,
  fontWeight: "bold",
};

export const switchOuter = {
  position: "relative",
  width: "50px",
  height: "24px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

export const switchCircle = {
  position: "absolute",
  top: "2px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  backgroundColor: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
  transition: "left 0.3s",
};

// Modal related styles
export const getModalOverlayStyle = (darkMode) => ({
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: darkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

export const getModalStyle = (darkMode) => ({
  background: darkMode ? "#2a2a3d" : "#fff",
  color: darkMode ? "#fff" : "#000",
  padding: "30px",
  borderRadius: "10px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: darkMode
    ? "0 5px 15px rgba(0,0,0,0.7)"
    : "0 5px 15px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

export const getModalButtonsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
};

export const getModalCancelButtonStyle = (darkMode) => ({
  ...getButtonStyles(false, darkMode, { backgroundColor: darkMode ? "#555" : "#f0f0f0", color: darkMode ? "#fff" : "#000" }),
});

export const getModalConfirmButtonStyle = {
  ...getButtonStyles(false, false, { backgroundColor: "#d32f2f", color: "#fff" }),
};

export const getModalChildIndent = (childType) => {
  switch (childType) {
    case "machine": return "12px";
    case "chest": return "24px";
    default: return "0px";
  }
};